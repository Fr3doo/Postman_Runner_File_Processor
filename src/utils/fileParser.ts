import { FileData } from '../types';
import { validateAndSanitizeContent } from './securityValidator';

export const parseFileContent = (content: string): FileData => {
  // Validate and sanitize content first
  const validation = validateAndSanitizeContent(content);
  
  if (!validation.isValid) {
    throw new Error(`Security validation failed: ${validation.errors.join(', ')}`);
  }

  // Use sanitized content for parsing
  const sanitizedContent = validation.sanitizedContent || content;
  const lines = sanitizedContent.split('\n').map(line => line.trim());
  
  // Find the data block between dashes
  const startIndex = lines.findIndex(line => line.includes('-'.repeat(10)));
  const endIndex = lines.findIndex((line, index) => index > startIndex && line.includes('-'.repeat(10)));
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No valid data block found. Expected format with dashed separators.');
  }
  
  const dataBlock = lines.slice(startIndex + 1, endIndex);
  const data: Partial<FileData> = {};
  
  for (const line of dataBlock) {
    try {
      if (line.includes('Nombre de fichier(s) restant(s)')) {
        const match = line.match(/:\s*(\d+)/);
        if (match) {
          const count = parseInt(match[1], 10);
          // Validate reasonable range
          if (count < 0 || count > 999999) {
            throw new Error('Invalid file count.');
          }
          data.nombre_fichiers_restants = count;
        }
      } else if (line.includes('numeroTélédémarche')) {
        const match = line.match(/AUTO-(\w+)/);
        if (match) {
          const teledemarcheNumber = match[1];
          // Validate format (alphanumeric only)
          if (!/^[A-Z0-9]+$/.test(teledemarcheNumber)) {
            throw new Error('Invalid télédémarche number format.');
          }
          data.numero_teledemarche = teledemarcheNumber;
        }
      } else if (line.includes('Nom de projet')) {
        const match = line.match(/TRA - (\w+) - (.+?) - v([\d.]+)/);
        if (match) {
          const [, code, name, version] = match;
          
          // Validate components
          if (!/^[A-Z0-9]+$/.test(code)) {
            throw new Error('Invalid project code format.');
          }
          
          // Sanitize project name (remove potentially dangerous characters)
        const sanitizedName = name.replace(/[<>:"|?*\\/]/g, '_').trim();
          if (sanitizedName.length === 0) {
            throw new Error('Project name is empty after sanitization');
          }
          
          // Validate version format
          if (!/^\d+(\.\d+)*$/.test(version)) {
            throw new Error('Invalid version format.');
          }
          
          data.nom_projet = `TRA - ${code} - ${sanitizedName} - v${version}`;
        }
      } else if (line.includes('Numero dossier')) {
        const match = line.match(/D(\w+)/);
        if (match) {
          const dossierNumber = match[1];
          // Validate format (alphanumeric only)
          if (!/^[A-Z0-9]+$/.test(dossierNumber)) {
            throw new Error('Invalid dossier number format.');
          }
          data.numero_dossier = dossierNumber;
        }
      } else if (line.includes('Date de dépot')) {
        const match = line.match(/:\s*(.+)$/);
        if (match) {
          const dateStr = match[1].trim();
          
          // Validate date format and sanitize
          const sanitizedDate = sanitizeDate(dateStr);
          if (!sanitizedDate) {
            throw new Error('Invalid date format.');
          }
          
          data.date_depot = sanitizedDate;
        }
      }
    } catch (error) {
      // Re-throw with context without leaking line content
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new Error(`Error parsing file content: ${message}`);
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
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
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
  
  // Check for common date patterns
  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY or MM/DD/YYYY
    /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
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
    numero_teledemarche: String(data.numero_teledemarche).replace(/[^\w]/g, ''),
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