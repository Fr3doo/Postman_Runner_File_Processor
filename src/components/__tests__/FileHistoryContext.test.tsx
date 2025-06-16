import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileHistoryProvider, useFileHistory } from '../FileHistoryContext';
import type { IFileHistoryService } from '../../services/FileHistoryService';
import type { ProcessedFile } from '../../types';

const createFile = (id: string): ProcessedFile => ({
  id,
  filename: `${id}.txt`,
  status: 'success',
});

const createMockService = (initial: ProcessedFile[]): IFileHistoryService & {
  getLoadCount(): number;
} => {
  let history = [...initial];
  const load = vi.fn(() => {
    history = [...initial];
  });
  const removeFile = vi.fn((id: string) => {
    history = history.filter((f) => f.id !== id);
  });
  const clearHistory = vi.fn(() => {
    history = [];
  });
  const save = vi.fn();
  return {
    addFile: vi.fn(),
    getHistory: () => [...history],
    removeFile,
    clearHistory,
    load,
    save,
    getLoadCount: () => load.mock.calls.length,
  };
};

describe('FileHistoryProvider', () => {
  it('loads history on mount and updates on remove/clear', () => {
    const files = [createFile('a'), createFile('b')];
    const service = createMockService(files);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );

    const { result } = renderHook(() => useFileHistory(), { wrapper });

    expect(service.getLoadCount()).toBe(1);
    expect(result.current.history).toEqual(files);

    act(() => {
      result.current.removeFile('a');
    });
    expect(service.removeFile).toHaveBeenCalledWith('a');
    expect(result.current.history.some((f) => f.id === 'a')).toBe(false);

    act(() => {
      result.current.clearHistory();
    });
    expect(service.clearHistory).toHaveBeenCalled();
    expect(result.current.history.length).toBe(0);
    expect(service.save).not.toHaveBeenCalled();
  });

  it('throws when used outside FileHistoryProvider', () => {
    const fn = () => renderHook(() => useFileHistory());
    expect(fn).toThrow('useFileHistory must be used within a FileHistoryProvider');
  });
});
