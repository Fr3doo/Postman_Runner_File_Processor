import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FileProcessor } from '../../services/FileProcessor';
import type { FileParserService } from '../../services/FileParserService';
import type { FileValidationService } from '../../services/FileValidationService';
import { notificationService } from '../../services/NotificationService';
import { ParsingError, ValidationError, RateLimitError } from '../errors';
import type { ProcessedFile } from '../../types';
import type { Dispatch, SetStateAction } from 'react';

const createFile = (name: string): File =>
  new File(['dummy'], name, { type: 'text/plain' });

describe('FileProcessor error handling', () => {
  let parseMock: ReturnType<typeof vi.fn>;
  let validateFilesMock: ReturnType<typeof vi.fn>;
  let validateRateLimitMock: ReturnType<typeof vi.fn>;
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
    processor = new FileProcessor(
      { parse: parseMock } as unknown as FileParserService,
      {
        validateFiles: validateFilesMock,
        validateRateLimit: validateRateLimitMock,
      } as unknown as FileValidationService,
      notificationService,
    );
    processedFiles = [];
    setProcessedFiles = (update) => {
      processedFiles =
        typeof update === 'function' ? update(processedFiles) : update;
    };
    setIsProcessing = vi.fn();
    (
      processor as unknown as { readFileWithTimeout: () => Promise<string> }
    ).readFileWithTimeout = vi.fn(async () => 'content');
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
});
