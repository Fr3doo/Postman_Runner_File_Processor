// Node modules are loaded lazily to avoid bundling them in the browser


export interface ILocalFileService {
  listJSONFiles(): Promise<string[]>;
  deleteFile(filename: string): Promise<void>;
  downloadFile(filename: string): Promise<string>;
}

export class LocalFileService implements ILocalFileService {
  constructor(private directory: string = process.cwd()) {}

  private isNode(): boolean {
    return (
      typeof process !== 'undefined' &&
      !!(process.versions && process.versions.node)
    );
  }

  private async fs() {
    if (!this.isNode()) {
      throw new Error('Local filesystem not accessible in the browser');
    }
    const { promises } = await import('fs');
    return promises;
  }

  private async joinPath(filename: string): Promise<string> {
    if (!this.isNode()) {
      throw new Error('Local filesystem not accessible in the browser');
    }
    const { join } = await import('path');
    return join(this.directory, filename);
  }

  async listJSONFiles(): Promise<string[]> {
    try {
      const fs = await this.fs();
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
      const fs = await this.fs();
      const filePath = await this.joinPath(filename);
      await fs.unlink(filePath);
    } catch (err) {
      console.error(`Failed to delete file ${filename}`, err);
      throw err;
    }
  }

  async downloadFile(filename: string): Promise<string> {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename provided');
    }

    const fs = await this.fs();
    const filePath = await this.joinPath(filename);
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
