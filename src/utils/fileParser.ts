import { FileData } from '../types';
import { validateAndSanitizeContent } from './securityValidator';
import { ParsingError } from './errors';

export const parseFileContent = (content: string): FileData => {
  // Validate and sanitize content first
  const validation = validateAndSanitizeContent(content);

  // Use sanitized content for parsing
  const sanitizedContent = validation.sanitizedContent || content;
  const lines = sanitizedContent.split('\n').map(line => line.trim());
  
  // Find the LAST occurrence of the summary block (the final results)
  // Look for the pattern that appears at the end of the file
  let lastSummaryStart = -1;
  
  // Find the last occurrence of the summary pattern
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.includes('📂 Nombre de fichier(s) restant(s)') || 
        line.includes('Nombre de fichier(s) restant(s)')) {
      // Found a summary block, check if it's followed by the expected pattern
      let hasValidPattern = false;
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('numeroTélédémarche') && lines[j].includes('AUTO-')) {
          hasValidPattern = true;
          break;
        }
      }
      if (hasValidPattern) {
        lastSummaryStart = i;
        break;
      }
    }
  }
  
  if (lastSummaryStart === -1) {
    throw new ParsingError('No valid summary block found. Expected format with file count and télédémarche number.');
  }
  
  // Process the last 20 lines from the summary start to ensure we get the complete block
  const summaryLines = lines.slice(lastSummaryStart, Math.min(lastSummaryStart + 20, lines.length));
  const data: Partial<FileData> = {};
  
  for (const line of summaryLines) {
    try {
      // Handle "📂 Nombre de fichier(s) restant(s) : 0"
      if (line.includes('Nombre de fichier(s) restant(s)')) {
        const match = line.match(/:\s*(\d+)/);
        if (match) {
          const count = parseInt(match[1], 10);
          // Validate reasonable range
          if (count < 0 || count > 999999) {
            throw new ParsingError('Invalid file count.');
          }
          data.nombre_fichiers_restants = count;
        }
      } 
      // Handle "➡️ Le dossier au numeroTélédémarche: AUTO-YWSEVNW5 est déposé"
      else if (line.includes('numeroTélédémarche') || line.includes('numeroTeledemarche')) {
        const match = line.match(/AUTO-([A-Z0-9\-]+)/);
        if (match) {
          const teledemarcheNumber = match[1];
          // Clean up any trailing characters and validate format
          const cleanNumber = teledemarcheNumber.replace(/[^A-Z0-9\-]/g, '');
          if (!/^[A-Z0-9\-]+$/.test(cleanNumber)) {
            throw new ParsingError('Invalid télédémarche number format.');
          }
          data.numero_teledemarche = cleanNumber;
        }
      } 
      // Handle "➡️ Nom de projet : TRA - DICPE - Test Fred - v5"
      else if (line.includes('Nom de projet')) {
        // More flexible regex to handle different project name formats
        const match = line.match(/:\s*TRA\s*-\s*([A-Z0-9]+)\s*-\s*(.+?)\s*-\s*v([\d.]+)/);
        if (match) {
          const [, code, name, version] = match;
          
          // Validate components
          if (!/^[A-Z0-9]+$/.test(code)) {
            throw new ParsingError('Invalid project code format.');
          }
          
          // Sanitize project name (remove potentially dangerous characters)
          const sanitizedName = name.replace(/[<>:"|?*\\/]/g, '_').trim();
          if (sanitizedName.length === 0) {
            throw new ParsingError('Project name is empty after sanitization');
          }
          
          // Validate version format (more flexible for single digit versions)
          if (!/^\d+(\.\d+)*$/.test(version)) {
            throw new ParsingError('Invalid version format.');
          }
          
          data.nom_projet = `TRA - ${code} - ${sanitizedName} - v${version}`;
        } else {
          // Fallback: try to extract the full project name as-is
          const fallbackMatch = line.match(/:\s*(.+)$/);
          if (fallbackMatch) {
            const projectName = fallbackMatch[1].trim();
            // Basic validation that it contains TRA
            if (projectName.includes('TRA')) {
              data.nom_projet = projectName;
            }
          }
        }
      } 
      // Handle "➡️ Numero dossier : D001726159"
      else if (line.includes('Numero dossier')) {
        const match = line.match(/D([A-Z0-9]+)/);
        if (match) {
          const dossierNumber = match[1];
          // Validate format (alphanumeric only)
          if (!/^[A-Z0-9]+$/.test(dossierNumber)) {
            throw new ParsingError('Invalid dossier number format.');
          }
          data.numero_dossier = dossierNumber;
        }
      } 
      // Handle "➡️ Date de dépot : 2025-06-11T12:00:00"
      else if (line.includes('Date de dépot') || line.includes('Date de depot')) {
        const match = line.match(/:\s*(.+)$/);
        if (match) {
          const dateStr = match[1].trim();
          
          // Validate date format and sanitize
          const sanitizedDate = sanitizeDate(dateStr);
          if (!sanitizedDate) {
            throw new ParsingError('Invalid date format.');
          }
          
          data.date_depot = sanitizedDate;
        }
      }
    } catch (error) {
      // Re-throw with context without leaking line content
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new ParsingError(`Error parsing file content: ${message}`);
    }
  }
  
  // Validate required fields
  const requiredFields: (keyof FileData)[] = [
    'nombre_fichiers_restants',
    'numero_teledemarche',
    'nom_projet',
    'numero_dossier',
    'date_depot'
  ];
  
  const missingFields = requiredFields.filter(field => data[field] === undefined);
  
  if (missingFields.length > 0) {
    throw new ParsingError(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return data as FileData;
};

/**
 * Sanitizes and validates date strings
 */
const sanitizeDate = (dateStr: string): string | null => {
  // Remove potentially dangerous characters
  const sanitized = dateStr.replace(/[<>:"|?*\\/]/g, '').trim();
  
  if (sanitized.length === 0) {
    return null;
  }
  
  // Check for common date patterns including ISO format
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
    /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
    /^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}$/, // ISO format: YYYY-MM-DDTHH:MM:SS
    /^\d{1,2}-\d{1,2}-\d{4}$/, // DD-MM-YYYY
    /^\d{1,2}\.\d{1,2}\.\d{4}$/, // DD.MM.YYYY
  ];
  
  const isValidFormat = datePatterns.some(pattern => pattern.test(sanitized));
  
  if (!isValidFormat) {
    // If it doesn't match common patterns, check if it's a reasonable string
    if (sanitized.length > 50) {
      return null; // Too long to be a valid date
    }
    
    // Allow some flexibility for different date formats
    // but ensure it contains some numbers
    if (!/\d/.test(sanitized)) {
      return null;
    }
  }
  
  return sanitized;
};

export const generateJSONContent = (data: FileData): string => {
  // Ensure data is properly sanitized before JSON generation
  const sanitizedData = {
    nombre_fichiers_restants: Number(data.nombre_fichiers_restants),
    numero_teledemarche: String(data.numero_teledemarche).replace(/[^\w\-]/g, ''),
    nom_projet: String(data.nom_projet).substring(0, 200), // Limit length
    numero_dossier: String(data.numero_dossier).replace(/[^\w]/g, ''),
    date_depot: String(data.date_depot).substring(0, 50), // Limit length
  };
  
  return JSON.stringify(sanitizedData, null, 2);
};

export const downloadJSON = (data: FileData, filename: string): void => {
  try {
    const jsonContent = generateJSONContent(data);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Sanitize filename
    const sanitizedFilename = filename
      .replace(/[<>:"|?*\\/]/g, '_')
      .replace(/\.txt$/i, '')
      .substring(0, 100); // Limit filename length
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedFilename}.json`;
    
    // Security: Set additional attributes
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading JSON file:', error);
    throw new Error('Failed to download JSON file. Please try again.');
  }
};