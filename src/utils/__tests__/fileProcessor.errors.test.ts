import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileProcessor } from '../../services/FileProcessor';
import type { FileParserService } from '../../services/FileParserService';
import type { FileValidationService } from '../../services/FileValidationService';
import { FileReaderService } from '../../services/FileReaderService';
import { notificationService } from '../../services/NotificationService';
import { type ILoggingService } from '../../services/LoggingService';
import { ParsingError, ValidationError, RateLimitError } from '../errors';
import type { ProcessedFile } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

const createFile = (name: string): File =>
  new File(['dummy'], name, { type: 'text/plain' });

describe('FileProcessor error handling', () => {
  let parseMock: ReturnType<typeof vi.fn>;
  let validateFilesMock: ReturnType<typeof vi.fn>;
  let validateRateLimitMock: ReturnType<typeof vi.fn>;
  let fileReader: FileReaderService;
  let processor: FileProcessor;
  let processedFiles: ProcessedFile[];
  let setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>;
  let setIsProcessing: Dispatch<SetStateAction<boolean>>;

  beforeEach(() => {
    parseMock = vi.fn(() => []);
    validateFilesMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    validateRateLimitMock = vi.fn(() => ({
      isValid: true,
      errors: [],
      warnings: [],
    }));
    const logService: ILoggingService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
      exportLogs: vi.fn(() => ''),
    };
    processor = new FileProcessor(
      { parse: parseMock } as unknown as FileParserService,
      {
        validateFiles: validateFilesMock,
        validateRateLimit: validateRateLimitMock,
      } as unknown as FileValidationService,
      (fileReader = new FileReaderService()),
      notificationService,
      undefined,
      logService,
    );
    processedFiles = [];
    setProcessedFiles = (update) => {
      processedFiles =
        typeof update === 'function' ? update(processedFiles) : update;
    };
    setIsProcessing = vi.fn();
    vi.spyOn(fileReader, 'readFileWithTimeout').mockResolvedValue('content');
    notificationService.clearWarnings();
  });

  it('handles validation errors', async () => {
    validateFilesMock.mockImplementation(() => {
      throw new ValidationError('bad');
    });
    const files = [createFile('bad.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(parseMock).not.toHaveBeenCalled();
    expect(processedFiles[0]?.status).toBe('error');
    expect(processedFiles[0]?.filename).toBe('Validation Error');
  });

  it('handles rate limit errors', async () => {
    validateRateLimitMock.mockImplementation(() => {
      throw new RateLimitError('too fast');
    });
    const files = [createFile('rate.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(parseMock).not.toHaveBeenCalled();
    expect(validateFilesMock).not.toHaveBeenCalled();
    expect(processedFiles[0]?.filename).toBe('Rate Limit Error');
  });

  it('handles parsing errors', async () => {
    parseMock.mockImplementation(() => {
      throw new ParsingError('oops');
    });
    const files = [createFile('parse.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(processedFiles[0]?.status).toBe('error');
    expect(processedFiles[0]?.error).toMatch(/oops/);
  });

  it('sends validation warnings to notification service', async () => {
    validateFilesMock.mockReturnValue({
      isValid: true,
      errors: [],
      warnings: ['warn'],
    });
    const listener = vi.fn();
    const unsubscribe = notificationService.subscribe(listener);
    const files = [createFile('good.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(listener).toHaveBeenCalledWith(['warn']);
    unsubscribe();
  });

  it('does not set processing state when validation fails', async () => {
    validateFilesMock.mockImplementation(() => {
      throw new ValidationError('bad');
    });
    const files = [createFile('v.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(setIsProcessing).not.toHaveBeenCalled();
  });

  it('does not set processing state when rate limited', async () => {
    validateRateLimitMock.mockImplementation(() => {
      throw new RateLimitError('oops');
    });
    const files = [createFile('r.txt')];
    await processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    expect(setIsProcessing).not.toHaveBeenCalled();
  });

  it('rethrows unexpected error from rate limit check', async () => {
    const err = new Error('boom');
    validateRateLimitMock.mockImplementation(() => {
      throw err;
    });
    const files = [createFile('e.txt')];
    await expect(
      processor.processFiles(
        files as unknown as FileList,
        setProcessedFiles,
        setIsProcessing,
      ),
    ).rejects.toThrow('boom');
  });

  it('rethrows unexpected error from file validation', async () => {
    const err = new Error('weird');
    validateFilesMock.mockImplementation(() => {
      throw err;
    });
    const files = [createFile('e2.txt')];
    await expect(
      processor.processFiles(
        files as unknown as FileList,
        setProcessedFiles,
        setIsProcessing,
      ),
    ).rejects.toThrow('weird');
  });

  it('toggles processing state around successful run', async () => {
    vi.useFakeTimers();
    const files = [createFile('a.txt')];
    const promise = processor.processFiles(
      files as unknown as FileList,
      setProcessedFiles,
      setIsProcessing,
    );
    await vi.runAllTimersAsync();
    await promise;
    expect(setIsProcessing).toHaveBeenNthCalledWith(1, true);
    expect(setIsProcessing).toHaveBeenLastCalledWith(false);
  });
});
