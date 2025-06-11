import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileProcessor } from '../FileProcessor';
import { FileParserService } from '../FileParserService';
import { FileValidationService } from '../FileValidationService';
import { CONCURRENCY_LIMIT } from '../../config/app';
import type { FileData, ProcessedFile } from '../../types';
import { ParsingError } from '../../utils/errors';
import type { Dispatch, SetStateAction } from 'react';

const createFile = (name: string): File => new File(['dummy'], name, { type: 'text/plain' });

describe('FileProcessor', () => {
  let parseMock: ReturnType<typeof vi.fn>;
  let validateFilesMock: ReturnType<typeof vi.fn>;
  let validateRateLimitMock: ReturnType<typeof vi.fn>;
  let processor: FileProcessor;
  let processedFiles: ProcessedFile[];
  let isProcessing: boolean;
  let setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>;
  let setIsProcessing: Dispatch<SetStateAction<boolean>>;

  beforeEach(() => {
    parseMock = vi.fn((): FileData => ({} as FileData));
    validateFilesMock = vi.fn(() => ({ isValid: true, errors: [], warnings: [] }));
    validateRateLimitMock = vi.fn(() => ({ isValid: true, errors: [], warnings: [] }));

    const parserService = { parse: parseMock } as unknown as FileParserService;
    const validationService = {
      validateFiles: validateFilesMock,
      validateRateLimit: validateRateLimitMock,
    } as unknown as FileValidationService;

    processor = new FileProcessor(parserService, validationService);

    processedFiles = [];
    isProcessing = false;
    setProcessedFiles = (update): void => {
      processedFiles = typeof update === 'function' ? update(processedFiles) : update;
    };
    setIsProcessing = (update): void => {
      isProcessing = typeof update === 'function' ? update(isProcessing) : update;
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('processes files respecting CONCURRENCY_LIMIT', async () => {
    vi.useFakeTimers();
    let active = 0;
    let maxActive = 0;
    (processor as unknown as { readFileWithTimeout: (file: File) => Promise<string> }).readFileWithTimeout = vi.fn(async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise(resolve => setTimeout(resolve, 10));
      active--;
      return 'content';
    });

    const files = Array.from({ length: CONCURRENCY_LIMIT * 2 }, (_, i) => createFile(`f${i}.txt`));

    const promise = processor.processFiles(files as unknown as FileList, setProcessedFiles, setIsProcessing);
    await vi.runAllTimersAsync();
    await promise;

    expect(parseMock).toHaveBeenCalledTimes(files.length);
    expect(maxActive).toBeLessThanOrEqual(CONCURRENCY_LIMIT);
    expect(isProcessing).toBe(false);
  });

  it('updates status to error when parsing fails', async () => {
    vi.useFakeTimers();
    parseMock.mockImplementation((content: string): FileData => {
      if (content === 'bad') throw new ParsingError('fail');
      return {} as FileData;
    });
    (processor as unknown as { readFileWithTimeout: (file: File) => Promise<string> }).readFileWithTimeout = vi.fn(async (file: File) => (file.name.includes('bad') ? 'bad' : 'good'));

    const files = [createFile('good.txt'), createFile('bad.txt')];
    const promise = processor.processFiles(files as unknown as FileList, setProcessedFiles, setIsProcessing);
    await vi.runAllTimersAsync();
    await promise;

    const good = processedFiles.find(f => f.filename === 'good.txt');
    const bad = processedFiles.find(f => f.filename === 'bad.txt');
    expect(good?.status).toBe('success');
    expect(bad?.status).toBe('error');
    expect(bad?.error).toBeDefined();
  });
});
