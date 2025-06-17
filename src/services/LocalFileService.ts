import { promises as fs } from 'fs';
import { join } from 'path';

export interface ILocalFileService {
  listJSONFiles(): Promise<string[]>;
  deleteFile(filename: string): Promise<void>;
  downloadFile(filename: string): Promise<string>;
}

export class LocalFileService implements ILocalFileService {
  constructor(private directory: string = process.cwd()) {}

  async listJSONFiles(): Promise<string[]> {
    try {
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
    try {
      await fs.unlink(join(this.directory, filename));
    } catch (err) {
      console.error(`Failed to delete file ${filename}`, err);
      throw err; // Re-throw to allow caller to handle the error
    }
  }
  }

  async downloadFile(filename: string): Promise<string> {
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
