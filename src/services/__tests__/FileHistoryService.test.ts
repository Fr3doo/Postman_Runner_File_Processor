import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileHistoryService, FileHistoryService } from '../FileHistoryService';
import type { ProcessedFile } from '../../types';

const createFile = (id: string): ProcessedFile => ({
  id,
  filename: `${id}.txt`,
  status: 'success',
  size: 10,
  processedAt: 123,
  recordCount: 2,
  durationMs: 5,
});

describe('fileHistoryService', () => {
  beforeEach(() => {
    fileHistoryService.clearHistory();
    window.localStorage.clear();
  });

  it('adds files to the beginning of history', () => {
    const a = createFile('a');
    const b = createFile('b');
    fileHistoryService.addFile(a);
    fileHistoryService.addFile(b);
    const history = fileHistoryService.getHistory();
    expect(history[0].id).toBe('b');
    expect(history[1].id).toBe('a');
  });

  it('getHistory returns a copy', () => {
    const f = createFile('x');
    fileHistoryService.addFile(f);
    const hist = fileHistoryService.getHistory();
    hist.push(createFile('y'));
    expect(fileHistoryService.getHistory().length).toBe(1);
  });

  it('removes files by id', () => {
    const a = createFile('a');
    const b = createFile('b');
    fileHistoryService.addFile(a);
    fileHistoryService.addFile(b);
    fileHistoryService.removeFile('a');
    const ids = fileHistoryService.getHistory().map((f) => f.id);
    expect(ids).not.toContain('a');
  });

  it('clears history', () => {
    fileHistoryService.addFile(createFile('a'));
    fileHistoryService.clearHistory();
    expect(fileHistoryService.getHistory().length).toBe(0);
  });

  it('saves and loads history from localStorage', () => {
    const f = createFile('p');
    fileHistoryService.addFile(f);
    const newService = new FileHistoryService();
    newService.load();
    const loaded = newService.getHistory()[0];
    expect(loaded.id).toBe('p');
    expect(loaded.size).toBe(10);
    expect(loaded.recordCount).toBe(2);
    expect(loaded.durationMs).toBe(5);
  });

  it('preserves existing localStorage items when instantiated', () => {
    const oldFile = createFile('old');
    window.localStorage.setItem('fileHistory', JSON.stringify([oldFile]));

    const newService = new FileHistoryService();
    const newFile = createFile('new');
    newService.addFile(newFile);

    const ids = newService.getHistory().map((f) => f.id);
    expect(ids).toContain('old');
    expect(ids).toContain('new');
    expect(ids[0]).toBe('new');
  });

  it('handles localStorage errors gracefully', () => {
    const setSpy = vi
      .spyOn(window.localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('fail');
      });
    const getSpy = vi
      .spyOn(window.localStorage, 'getItem')
      .mockImplementation(() => {
        throw new Error('fail');
      });

    expect(() => fileHistoryService.save()).not.toThrow();
    expect(() => fileHistoryService.load()).not.toThrow();

    setSpy.mockRestore();
    getSpy.mockRestore();
  });
});
