// Node modules are loaded lazily to avoid bundling them in the browser


export interface ILocalFileService {
  listJSONFiles(): Promise<string[]>;
  deleteFile(filename: string): Promise<void>;
  downloadFile(filename: string): Promise<string>;
}

export class LocalFileService implements ILocalFileService {
  private directory: string;
  private directoryHandle?: FileSystemDirectoryHandle;
  constructor(directory?: string) {
    if (directory) {
      this.directory = directory;
    } else if (typeof process !== 'undefined' && process.cwd) {
      this.directory = process.cwd();
    } else {
      this.directory = '';
    }
  }

  private isNode(): boolean {
    return (
      typeof process !== 'undefined' &&
      !!(process.versions && process.versions.node)
    );
  }

  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof (window as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === 'function'
    );
  }

  private async fs() {
    if (!this.isNode()) {
      throw new Error('Local filesystem not accessible in the browser');
    }
    const { promises } = await import('fs');
    return promises;
  }

  hasDirectoryHandle(): boolean {
    return !!this.directoryHandle;
  }

  async requestDirectoryAccess(): Promise<FileSystemDirectoryHandle> {
    if (!this.isBrowser()) {
      throw new Error('Directory access only available in the browser');
    }
    if (!this.directoryHandle) {
      const picker = (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker;
      this.directoryHandle = await picker();
    }
    return this.directoryHandle;
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
      if (this.isNode()) {
        const fs = await this.fs();
        const files = await fs.readdir(this.directory);
        return files.filter((f) => f.toLowerCase().endsWith('.json'));
      }
      if (this.isBrowser()) {
        if (!this.directoryHandle) {
          throw new Error('Directory handle not set');
        }
        const files: string[] = [];
        for await (const entry of this.directoryHandle.values()) {
          if (
            entry.kind === 'file' &&
            entry.name.toLowerCase().endsWith('.json')
          ) {
            files.push(entry.name);
          }
        }
        return files;
      }
      return [];
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
      if (this.isNode()) {
        const fs = await this.fs();
        const filePath = await this.joinPath(filename);
        await fs.unlink(filePath);
        return;
      }
      if (this.isBrowser()) {
        if (!this.directoryHandle) {
          throw new Error('Directory handle not set');
        }
        await this.directoryHandle.removeEntry(filename);
        return;
      }
    } catch (err) {
      console.error(`Failed to delete file ${filename}`, err);
      throw err;
    }
  }

  async downloadFile(filename: string): Promise<string> {
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      throw new Error('Invalid filename provided');
    }
    let data = '';
    if (this.isNode()) {
      const fs = await this.fs();
      const filePath = await this.joinPath(filename);
      data = await fs.readFile(filePath, 'utf8');
    } else if (this.isBrowser()) {
      if (!this.directoryHandle) {
        throw new Error('Directory handle not set');
      }
      const handle = await this.directoryHandle.getFileHandle(filename);
      const file = await handle.getFile();
      data = await file.text();
    }

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
