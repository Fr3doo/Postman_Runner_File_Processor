import { FileData } from '../types';
import { validateAndSanitizeContent } from './securityValidator';
import { ParsingError } from './errors';

export type ParseStrategy = (content: string) => FileData[];

export const defaultParseStrategy: ParseStrategy = (
  content: string,
): FileData[] => {
  const validation = validateAndSanitizeContent(content);
  const sanitizedContent = validation.sanitizedContent || content;
  const lines = sanitizedContent.split('\n').map((line) => line.trim());

  const starts: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes('📂 Nombre de fichier(s) restant(s)') ||
      line.includes('Nombre de fichier(s) restant(s)')
    ) {
      let hasValidPattern = false;
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (
          lines[j].includes('numeroTélédémarche') &&
          lines[j].includes('AUTO-')
        ) {
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
    throw new ParsingError(
      'No valid summary block found. Expected format with file count and télédémarche number.',
    );
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

export const parseSummaryLines = (
  summaryLines: string[],
  helpers: {
    extractFileCount?: typeof extractFileCount;
    extractTeledemarche?: typeof extractTeledemarche;
    extractProjectName?: typeof extractProjectName;
    extractDossierNumber?: typeof extractDossierNumber;
    extractDateDepot?: typeof extractDateDepot;
  } = {},
): FileData => {
  const data: Partial<FileData> = {};

  const {
    extractFileCount: efc = extractFileCount,
    extractTeledemarche: etd = extractTeledemarche,
    extractProjectName: epn = extractProjectName,
    extractDossierNumber: edn = extractDossierNumber,
    extractDateDepot: edd = extractDateDepot,
  } = helpers;

  for (const line of summaryLines) {
    try {
      if (data.nombre_fichiers_restants === undefined) {
        const count = efc(line);
        if (count !== undefined) data.nombre_fichiers_restants = count;
      }

      if (data.numero_teledemarche === undefined) {
        const num = etd(line);
        if (num !== undefined) data.numero_teledemarche = num;
      }

      if (data.nom_projet === undefined) {
        const proj = epn(line);
        if (proj !== undefined) data.nom_projet = proj;
      }

      if (data.numero_dossier === undefined) {
        const dossier = edn(line);
        if (dossier !== undefined) data.numero_dossier = dossier;
      }

      if (data.date_depot === undefined) {
        const date = edd(line);
        if (date !== undefined) data.date_depot = date;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown parsing error';
      throw new ParsingError(`Error parsing file content: ${message}`);
    }
  }

  const requiredFields: (keyof FileData)[] = [
    'nombre_fichiers_restants',
    'numero_teledemarche',
    'nom_projet',
    'numero_dossier',
    'date_depot',
  ];
  const missingFields = requiredFields.filter(
    (field) => data[field] === undefined,
  );
  if (missingFields.length > 0) {
    throw new ParsingError(
      `Missing required fields: ${missingFields.join(', ')}`,
    );
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

  const isValidFormat = datePatterns.some((pattern) => pattern.test(sanitized));

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

export const extractFileCount = (line: string): number | undefined => {
  if (!line.includes('Nombre de fichier(s) restant(s)')) return undefined;
  const match = line.match(/:\s*(\d+)/);
  if (match) {
    const count = parseInt(match[1], 10);
    if (count < 0 || count > 999999) {
      throw new ParsingError('Invalid file count.');
    }
    return count;
  }
  return undefined;
};

export const extractTeledemarche = (line: string): string | undefined => {
  if (
    !line.includes('numeroTélédémarche') &&
    !line.includes('numeroTeledemarche')
  ) {
    return undefined;
  }
  const match = line.match(/AUTO-([A-Z0-9-]+)/);
  if (match) {
    const cleanNumber = match[1].replace(/[^A-Z0-9-]/g, '');
    if (!/^[A-Z0-9-]+$/.test(cleanNumber)) {
      throw new ParsingError('Invalid télédémarche number format.');
    }
    return cleanNumber;
  }
  return undefined;
};

export const extractProjectName = (line: string): string | undefined => {
  if (!line.includes('Nom de projet')) return undefined;
  const match = line.match(
    /:\s*TRA\s*-\s*([A-Z0-9]+)\s*-\s*(.+?)\s*-\s*v([\d.]+)/,
  );
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
    return `TRA - ${code} - ${sanitizedName} - v${version}`;
  }
  const fallbackMatch = line.match(/:\s*(.+)$/);
  if (fallbackMatch) {
    const projectName = fallbackMatch[1].trim();
    if (projectName.includes('TRA')) {
      const parts = projectName.split('-').map((p) => p.trim());
      if (parts.length >= 2 && !/^[A-Z0-9]+$/.test(parts[1])) {
        throw new ParsingError('Invalid project code format.');
      }
      return projectName;
    }
  }
  return undefined;
};

export const extractDossierNumber = (line: string): string | undefined => {
  if (!line.includes('Numero dossier')) return undefined;
  const match = line.match(/D([A-Z0-9]+)/);
  if (match) {
    const dossierNumber = match[1];
    if (!/^[A-Z0-9]+$/.test(dossierNumber)) {
      throw new ParsingError('Invalid dossier number format.');
    }
    return dossierNumber;
  }
  return undefined;
};

export const extractDateDepot = (line: string): string | undefined => {
  if (!line.includes('Date de dépot') && !line.includes('Date de depot')) {
    return undefined;
  }
  const match = line.match(/:\s*(.+)$/);
  if (match) {
    const sanitizedDate = sanitizeDate(match[1].trim());
    if (!sanitizedDate) {
      throw new ParsingError('Invalid date format.');
    }
    return sanitizedDate;
  }
  return undefined;
};

export { sanitizeDate };
