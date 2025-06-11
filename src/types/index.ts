export interface FileData {
  nombre_fichiers_restants: number;
  numero_teledemarche: string;
  nom_projet: string;
  numero_dossier: string;
  date_depot: string;
}

export interface ProcessedFile {
  id: string;
  filename: string;
  status: 'processing' | 'success' | 'error';
  data?: FileData;
  error?: string;
  originalContent?: string;
}

export interface ProcessingStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}