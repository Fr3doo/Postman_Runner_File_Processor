import { FileData } from '../types';
import { defaultParseStrategy } from './parseStrategies';

export const parseFileContent = (content: string): FileData => {
  const all = defaultParseStrategy(content);
  return all[all.length - 1];
};

export const parseAllSummaryBlocks = defaultParseStrategy;

export const sanitizeFileData = (data: FileData): FileData => ({
  nombre_fichiers_restants: Number(data.nombre_fichiers_restants),
  numero_teledemarche: String(data.numero_teledemarche).replace(/[^\w]/g, ''),
  nom_projet: String(data.nom_projet).substring(0, 200),
  numero_dossier: String(data.numero_dossier).replace(/[^\w]/g, ''),
  date_depot: String(data.date_depot).substring(0, 50),
});

export const generateJSONContent = (data: FileData): string => {
  return JSON.stringify(data, null, 2);
};

export const downloadJSON = (data: FileData, filename: string): void => {
  try {
    const sanitized = sanitizeFileData(data);
    const jsonContent = generateJSONContent(sanitized);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const sanitizedFilename = filename
      .replace(/[<>:"|?*\\/]/g, '_')
      .replace(/\.txt$/i, '')
      .substring(0, 100);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedFilename}.json`;
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
