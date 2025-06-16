export interface IFileHistoryService {
  addFile(file: ProcessedFile): void;
  getHistory(): ProcessedFile[];
  removeFile(id: string): void;
  clearHistory(): void;
  load(): void;
  save(): void;
}

import type { ProcessedFile } from '../types';

class FileHistoryService implements IFileHistoryService {
  private history: ProcessedFile[] = [];
  private readonly storageKey = 'fileHistory';

  constructor() {
    this.load();
  }

  addFile(file: ProcessedFile): void {
    this.history.unshift(file);
  }

  getHistory(): ProcessedFile[] {
    return [...this.history];
  }

  removeFile(id: string): void {
    this.history = this.history.filter((f) => f.id !== id);
  }

  clearHistory(): void {
    this.history = [];
  }

  load(): void {
    if (typeof localStorage === 'undefined') return;
    let data: string | null = null;
    try {
      data = localStorage.getItem(this.storageKey);
    } catch (err) {
      console.error('Failed to read file history from localStorage', err);
      return;
    }
    if (!data) return;
    try {
      this.history = JSON.parse(data) as ProcessedFile[];
    } catch {
      this.history = [];
    }
  }

  save(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (err) {
      console.error('Failed to save file history to localStorage', err);
    }
  }
}

export const fileHistoryService: IFileHistoryService = new FileHistoryService();
export { FileHistoryService };
