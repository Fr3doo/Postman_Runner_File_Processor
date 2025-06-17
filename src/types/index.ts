/* c8 ignore file */
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
  /** Size of the original file in bytes */
  size?: number;
  /** Epoch timestamp when processing completed */
  processedAt?: number;
  /** Number of summary records parsed from the file */
  recordCount?: number;
  /** Total processing duration in milliseconds */
  durationMs?: number;
  summaries?: FileData[];
  error?: string;
  originalContent?: string;
}

export interface ProcessingStats {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}
