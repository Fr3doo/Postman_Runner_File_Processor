import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFileProcessor } from '../../hooks/useFileProcessor';
import { FileProcessor } from '../../services/FileProcessor';
import { FileReaderService } from '../../services/FileReaderService';
import { type ILoggingService } from '../../services/LoggingService';
import type { FileParserService } from '../../services/FileParserService';
import type { FileValidationService } from '../../services/FileValidationService';
import type { FileData } from '../../types';
import { ParsingError } from '../../utils/errors';

const createFile = (name: string): File =>
  new File(['dummy'], name, { type: 'text/plain' });

const data: FileData = {
  nombre_fichiers_restants: 0,
  numero_teledemarche: 'T',
  nom_projet: 'P',
  numero_dossier: 'D',
  date_depot: '2024',
};

describe('useFileProcessor', () => {
  it('processes files and calculates stats', async () => {
    vi.useFakeTimers();
    const parseMock = vi.fn(() => [data]);
    const validateFilesMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const validateRateLimitMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const parser = { parse: parseMock } as unknown as FileParserService;
    const validator = {
      validateFiles: validateFilesMock,
      validateRateLimit: validateRateLimitMock,
    } as unknown as FileValidationService;
    const reader = new FileReaderService();
    const logService: ILoggingService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
      exportLogs: vi.fn(() => ''),
    };
    const processor = new FileProcessor(
      parser,
      validator,
      reader,
      undefined,
      undefined,
      logService,
    );
    vi.spyOn(reader, 'readFileWithTimeout').mockResolvedValue('content');

    const { result } = renderHook(() => useFileProcessor(processor));
    const files = [createFile('good.txt')];

    await act(async () => {
      const promise = result.current.processFiles(files as unknown as FileList);
      await vi.runAllTimersAsync();
      await promise;
    });

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.processedFiles[0]?.status).toBe('success');
    const stats = result.current.getStats();
    expect(stats.total).toBe(1);
    expect(stats.successful).toBe(1);
    expect(stats.failed).toBe(0);
  });

  it('handles parsing errors', async () => {
    vi.useFakeTimers();
    const parseMock = vi.fn(() => {
      throw new ParsingError('nope');
    });
    const validateFilesMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const validateRateLimitMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const parser = { parse: parseMock } as unknown as FileParserService;
    const validator = {
      validateFiles: validateFilesMock,
      validateRateLimit: validateRateLimitMock,
    } as unknown as FileValidationService;
    const reader = new FileReaderService();
    const logService: ILoggingService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
      exportLogs: vi.fn(() => ''),
    };
    const processor = new FileProcessor(
      parser,
      validator,
      reader,
      undefined,
      undefined,
      logService,
    );
    vi.spyOn(reader, 'readFileWithTimeout').mockResolvedValue('content');

    const { result } = renderHook(() => useFileProcessor(processor));
    const files = [createFile('bad.txt')];

    await act(async () => {
      const promise = result.current.processFiles(files as unknown as FileList);
      await vi.runAllTimersAsync();
      await promise;
    });

    expect(result.current.isProcessing).toBe(false);
    const file = result.current.processedFiles[0];
    expect(file.status).toBe('error');
    expect(file.error).toMatch(/nope/);
    const stats = result.current.getStats();
    expect(stats.failed).toBe(1);
  });

  it('clears previous results', async () => {
    vi.useFakeTimers();
    const parseMock = vi.fn(() => [data]);
    const validateFilesMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const validateRateLimitMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const parser = { parse: parseMock } as unknown as FileParserService;
    const validator = {
      validateFiles: validateFilesMock,
      validateRateLimit: validateRateLimitMock,
    } as unknown as FileValidationService;
    const reader = new FileReaderService();
    const logService: ILoggingService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
      exportLogs: vi.fn(() => ''),
    };
    const processor = new FileProcessor(
      parser,
      validator,
      reader,
      undefined,
      undefined,
      logService,
    );
    vi.spyOn(reader, 'readFileWithTimeout').mockResolvedValue('content');

    const { result } = renderHook(() => useFileProcessor(processor));
    const files = [createFile('to-clear.txt')];

    await act(async () => {
      const promise = result.current.processFiles(files as unknown as FileList);
      await vi.runAllTimersAsync();
      await promise;
    });

    expect(result.current.processedFiles.length).toBe(1);

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.processedFiles).toEqual([]);
  });
});
