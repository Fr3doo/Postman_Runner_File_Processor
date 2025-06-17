export type HistoryListener = (history: ProcessedFile[]) => void;

export interface IFileHistoryService {
  addFile(file: ProcessedFile): void;
  getHistory(): ProcessedFile[];
  removeFile(id: string): void;
  clearHistory(): void;
  load(): void;
  save(): void;
  subscribe(listener: HistoryListener): () => void;
}

import type { ProcessedFile } from '../types';

class FileHistoryService implements IFileHistoryService {
  private history: ProcessedFile[] = [];
  private readonly storageKey = 'fileHistory';
  private listeners: HistoryListener[] = [];

  constructor() {
    this.load();
  }

  addFile(file: ProcessedFile): void {
    this.history.unshift(file);
    this.save();
    this.notify();
  }

  getHistory(): ProcessedFile[] {
    return [...this.history];
  }

  removeFile(id: string): void {
    this.history = this.history.filter((f) => f.id !== id);
    this.save();
    this.notify();
  }

  clearHistory(): void {
    this.history = [];
    this.save();
    this.notify();
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
    this.notify();
  }

  save(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    } catch (err) {
      console.error('Failed to save file history to localStorage', err);
    }
  }

  subscribe(listener: HistoryListener): () => void {
    this.listeners.push(listener);
    listener(this.getHistory());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    const histCopy = this.getHistory();
    this.listeners.forEach((l) => l(histCopy));
  }
}

export const fileHistoryService: IFileHistoryService = new FileHistoryService();
export { FileHistoryService };
