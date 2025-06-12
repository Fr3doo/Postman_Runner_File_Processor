import { FileData } from '../types';
import { validateAndSanitizeContent } from './securityValidator';
import { ParsingError } from './errors';

export type ParseStrategy = (content: string) => FileData[];

export const defaultParseStrategy: ParseStrategy = (content: string): FileData[] => {
  const validation = validateAndSanitizeContent(content);
  const sanitizedContent = validation.sanitizedContent || content;
  const lines = sanitizedContent.split('\n').map(line => line.trim());

  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('📂 Nombre de fichier(s) restant(s)') || line.includes('Nombre de fichier(s) restant(s)')) {
      let hasValidPattern = false;
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes('numeroTélédémarche') && lines[j].includes('AUTO-')) {
          hasValidPattern = true;
          break;
        }
      }
      if (hasValidPattern) {
        starts.push(i);
      }
    }
  }

  if (starts.length === 0) {
    throw new ParsingError('No valid summary block found. Expected format with file count and télédémarche number.');
  }

  const summaries: FileData[] = [];
  for (let idx = 0; idx < starts.length; idx++) {
    const start = starts[idx];
    const end = idx + 1 < starts.length ? starts[idx + 1] : lines.length;
    const summaryLines = lines.slice(start, Math.min(start + 20, end));
    summaries.push(parseSummaryLines(summaryLines));
  }
  return summaries;
};

const parseSummaryLines = (summaryLines: string[]): FileData => {
  const data: Partial<FileData> = {};

  for (const line of summaryLines) {
    try {
      if (line.includes('Nombre de fichier(s) restant(s)')) {
        const match = line.match(/:\s*(\d+)/);
        if (match) {
          const count = parseInt(match[1], 10);
          if (count < 0 || count > 999999) {
            throw new ParsingError('Invalid file count.');
          }
          data.nombre_fichiers_restants = count;
        }
      } else if (line.includes('numeroTélédémarche') || line.includes('numeroTeledemarche')) {
        const match = line.match(/AUTO-([A-Z0-9-]+)/);
        if (match) {
          const cleanNumber = match[1].replace(/[^A-Z0-9-]/g, '');
          if (!/^[A-Z0-9-]+$/.test(cleanNumber)) {
            throw new ParsingError('Invalid télédémarche number format.');
          }
          data.numero_teledemarche = cleanNumber;
        }
      } else if (line.includes('Nom de projet')) {
        const match = line.match(/:\s*TRA\s*-\s*([A-Z0-9]+)\s*-\s*(.+?)\s*-\s*v([\d.]+)/);
        if (match) {
          const [, code, name, version] = match;
          if (!/^[A-Z0-9]+$/.test(code)) {
            throw new ParsingError('Invalid project code format.');
          }
          const sanitizedName = name.replace(/[<>:"|?*\\/]/g, '_').trim();
          if (sanitizedName.length === 0) {
            throw new ParsingError('Project name is empty after sanitization');
          }
          if (!/^\d+(\.\d+)*$/.test(version)) {
            throw new ParsingError('Invalid version format.');
          }
          data.nom_projet = `TRA - ${code} - ${sanitizedName} - v${version}`;
        } else {
          const fallbackMatch = line.match(/:\s*(.+)$/);
          if (fallbackMatch) {
            const projectName = fallbackMatch[1].trim();
            if (projectName.includes('TRA')) {
              const parts = projectName.split('-').map(p => p.trim());
              if (parts.length >= 2 && !/^[A-Z0-9]+$/.test(parts[1])) {
                throw new ParsingError('Invalid project code format.');
              }
              data.nom_projet = projectName;
            }
          }
        }
      } else if (line.includes('Numero dossier')) {
        const match = line.match(/D([A-Z0-9]+)/);
        if (match) {
          const dossierNumber = match[1];
          if (!/^[A-Z0-9]+$/.test(dossierNumber)) {
            throw new ParsingError('Invalid dossier number format.');
          }
          data.numero_dossier = dossierNumber;
        }
      } else if (line.includes('Date de dépot') || line.includes('Date de depot')) {
        const match = line.match(/:\s*(.+)$/);
        if (match) {
          const sanitizedDate = sanitizeDate(match[1].trim());
          if (!sanitizedDate) {
            throw new ParsingError('Invalid date format.');
          }
          data.date_depot = sanitizedDate;
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      throw new ParsingError(`Error parsing file content: ${message}`);
    }
  }

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

const sanitizeDate = (dateStr: string): string | null => {
  const sanitized = dateStr.replace(/[<>'"|?*\\]/g, '').trim();

  if (sanitized.length === 0) {
    return null;
  }

  const datePatterns = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    /^\d{4}-\d{1,2}-\d{1,2}$/,
    /^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}$/,
    /^\d{1,2}-\d{1,2}-\d{4}$/,
    /^\d{1,2}\.\d{1,2}\.\d{4}$/,
  ];

  const isValidFormat = datePatterns.some(pattern => pattern.test(sanitized));

  if (!isValidFormat) {
    if (sanitized.length > 50) {
      return null;
    }

    if (!/\d/.test(sanitized)) {
      return null;
    }
  }

  return sanitized;
};
