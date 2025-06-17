/* c8 ignore file */
export type Language = 'fr' | 'en';

interface Dictionary {
  [key: string]: string;
}

const fr: Dictionary = {
  uploadTitle: 'Téléverser des fichiers Postman Runner',
  uploadSubtitle: 'Déposez vos fichiers .txt ici ou cliquez pour parcourir',
  chooseFiles: 'Choisir des fichiers',
  securityLimits: 'Limites de sécurité',
  maxFilesCount: 'Maximum {count} fichiers par envoi',
  maxFileSize: 'Taille maximale {size} par fichier',
  maxTotalSize: 'Taille totale maximale {size}',
  onlyTxtSupported:
    'Seuls les fichiers .txt provenant de Postman Runner sont pris en charge',
  dropFilesHere: 'Déposez les fichiers ici',
  validationErrorsTitle: 'Erreurs de validation',
  warningsTitle: 'Avertissements',
  processingSummary: 'Résumé du traitement',
  clearResults: 'Effacer les résultats',
  totalFiles: 'Fichiers totaux',
  processed: 'Traités',
  successful: 'Réussis',
  failed: 'Échoués',
  progress: 'Avancement',
  statusSuccess: '✅ Réussi',
  statusError: '⛔️ Erreur',
  statusProcessing: '🔄 Traitement',
  processingError: 'Erreur de traitement',
  fileProcessing: 'Traitement du fichier...',
  remainingFiles: 'Fichiers restants',
  teledemarche: 'Télédémarche',
  projectName: 'Nom du projet',
  folderNumber: 'Numéro de dossier',
  depositDate: 'Date de dépôt',
  fileSize: 'Taille',
  processedAt: 'Traité le',
  recordCount: 'Enregistrements',
  durationMs: 'Durée (ms)',
  historyTitle: 'Historique des fichiers',
  historyEmpty: "Aucun fichier dans l'historique.",
  downloadAgain: 'Télécharger à nouveau',
  downloadJson: 'Télécharger le JSON',
  clearHistory: "Effacer l'historique",
  removeFile: 'Supprimer',
  appTitle: 'Convertisseur de fichiers Postman Runner',
  appSubtitle:
    "Téléchargez et traitez vos fichiers .txt issus de Postman Runner afin d'extraire des données structurées et de générer des fichiers JSON téléchargeables avec une gestion complète des erreurs.",
  emptyState:
    "Aucun fichier traité pour l'instant. Importez des fichiers .txt pour commencer !",
};

const en: Dictionary = {
  uploadTitle: 'Upload Postman Runner files',
  uploadSubtitle: 'Drop your .txt files here or click to browse',
  chooseFiles: 'Choose files',
  securityLimits: 'Security limits',
  maxFilesCount: 'Maximum {count} files per upload',
  maxFileSize: 'Maximum size {size} per file',
  maxTotalSize: 'Total size limit {size}',
  onlyTxtSupported: 'Only Postman Runner .txt files are supported',
  dropFilesHere: 'Drop files here',
  validationErrorsTitle: 'Validation errors',
  warningsTitle: 'Warnings',
  processingSummary: 'Processing summary',
  clearResults: 'Clear results',
  totalFiles: 'Total files',
  processed: 'Processed',
  successful: 'Succeeded',
  failed: 'Failed',
  progress: 'Progress',
  statusSuccess: '✅ Success',
  statusError: '⛔️ Error',
  statusProcessing: '🔄 Processing',
  processingError: 'Processing error',
  fileProcessing: 'Processing file...',
  remainingFiles: 'Remaining files',
  teledemarche: 'Workflow',
  projectName: 'Project name',
  folderNumber: 'Folder number',
  depositDate: 'Submission date',
  fileSize: 'Size',
  processedAt: 'Processed at',
  recordCount: 'Records',
  durationMs: 'Duration (ms)',
  historyTitle: 'File history',
  historyEmpty: 'No file history yet.',
  downloadAgain: 'Download again',
  downloadJson: 'Download JSON',
  clearHistory: 'Clear history',
  removeFile: 'Remove',
  appTitle: 'Postman Runner File Converter',
  appSubtitle:
    'Upload and process your .txt files from Postman Runner to extract structured data and generate downloadable JSON files with full error management.',
  emptyState: 'No files processed yet. Upload some .txt files to get started!',
};

const translations: Record<Language, Dictionary> = { fr, en };

let currentLanguage: Language = 'fr';

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
};

export const getLanguage = (): Language => currentLanguage;

export const t = (
  key: string,
  replacements?: Record<string, string | number>,
): string => {
  const dict = translations[currentLanguage] || translations.fr;
  let text = dict[key] || translations.fr[key] || key;
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(`{${placeholder}}`, String(value));
    });
  }
  return text;
};

export default t;