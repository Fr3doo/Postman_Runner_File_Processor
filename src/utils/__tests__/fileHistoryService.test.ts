import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fileHistoryService, FileHistoryService } from '../../services/FileHistoryService';
import type { ProcessedFile } from '../../types';

const createFile = (id: string): ProcessedFile => ({
  id,
  filename: `${id}.txt`,
  status: 'success',
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

  it('trims history to the maximum size', () => {
    const svc = new FileHistoryService(2);
    svc.addFile(createFile('a'));
    svc.addFile(createFile('b'));
    svc.addFile(createFile('c'));
    const ids = svc.getHistory().map((f) => f.id);
    expect(ids).toEqual(['c', 'b']);
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
    expect(newService.getHistory()[0].id).toBe('p');
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

  it('resets history when localStorage returns malformed data', () => {
    fileHistoryService.addFile(createFile('a'));
    const spy = vi
      .spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
      .mockReturnValue('not-json');
    expect(() => fileHistoryService.load()).not.toThrow();
    expect(fileHistoryService.getHistory()).toEqual([]);
    spy.mockRestore();
  });
});
