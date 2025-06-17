
export const isNode = (): boolean =>
  typeof process !== 'undefined' && 
  !!process.versions?.node && 
  typeof require !== 'undefined';

export interface ILocalFileService {
  listJSONFiles(): Promise<string[]>;
  deleteFile(filename: string): Promise<void>;
  downloadFile(filename: string): Promise<string>;
}

export class LocalFileService implements ILocalFileService {
  constructor(private directory: string = process.cwd()) {}

  async listJSONFiles(): Promise<string[]> {
    if (!isNode()) {
      throw new Error(
        "La lecture des fichiers locaux n'est pas disponible dans ce navigateur."
      );
    }
    try {
      const { promises: fs } = await import('fs');
      const files = await fs.readdir(this.directory);
      return files.filter((f) => f.toLowerCase().endsWith('.json'));
    } catch (err) {
      console.error('Failed to list files', err);
      return [];
    }
  }

  async deleteFile(filename: string): Promise<void> {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename provided');
    }
    if (!isNode()) {
      throw new Error(
        "La suppression de fichiers locaux n'est pas disponible dans ce navigateur."
      );
    }
    try {
      const { promises: fs } = await import('fs');
      const { join } = await import('path');
      await fs.unlink(join(this.directory, filename));
    } catch (err) {
      console.error(`Failed to delete file ${filename}`, err);
      throw err;
    }
  }

  async downloadFile(filename: string): Promise<string> {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename provided');
    }
    if (!isNode()) {
      throw new Error(
        "Le t\xE9l\xE9chargement de fichiers locaux n'est pas disponible dans ce navigateur."
      );
    }

    const { promises: fs } = await import('fs');
    const { join } = await import('path');
    const filePath = join(this.directory, filename);
    const data = await fs.readFile(filePath, 'utf8');
    if (
      typeof document !== 'undefined' &&
      typeof URL !== 'undefined' &&
      typeof URL.createObjectURL === 'function'
    ) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return data;
  }
}

export const localFileService = new LocalFileService();
export type { LocalFileService as LocalFileServiceClass };
