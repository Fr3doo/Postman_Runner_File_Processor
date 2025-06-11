import { Dispatch, SetStateAction } from 'react';
import { ProcessedFile } from '../types';
import { FileParserService } from './FileParserService';
import { FileValidationService } from './FileValidationService';
import { CONCURRENCY_LIMIT, FILE_READ_TIMEOUT } from '../config/app';
import { RateLimitError, ValidationError, ParsingError } from '../utils/errors';
import { ValidationResult } from '../utils/securityValidator';

export class FileProcessor {
  constructor(
    private parserService: FileParserService,
    private validationService: FileValidationService
  ) {}

  async processFiles(
    files: FileList,
    setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>,
    setIsProcessing: Dispatch<SetStateAction<boolean>>
  ): Promise<void> {
    try {
      this.validationService.validateRateLimit();
    } catch (error) {
      if (error instanceof RateLimitError) {
        const errorFile: ProcessedFile = {
          id: crypto.randomUUID(),
          filename: 'Rate Limit Error',
          status: 'error',
          error: error.message,
        };
        setProcessedFiles(prev => [errorFile, ...prev]);
        return;
      }
      throw error;
    }

    let validation: ValidationResult;
    try {
      validation = this.validationService.validateFiles(files);
    } catch (error) {
      if (error instanceof ValidationError) {
        const errorFile: ProcessedFile = {
          id: crypto.randomUUID(),
          filename: 'Validation Error',
          status: 'error',
          error: error.message,
        };
        setProcessedFiles(prev => [errorFile, ...prev]);
        return;
      }
      throw error;
    }

    if (validation.warnings.length > 0) {
      console.warn('File validation warnings:', validation.warnings);
    }

    setIsProcessing(true);
    const fileArray = Array.from(files);

    const initialFiles: ProcessedFile[] = fileArray.map(file => ({
      id: crypto.randomUUID(),
      filename: file.name,
      status: 'processing',
    }));

    setProcessedFiles(prev => [...initialFiles, ...prev]);

    const tasks = fileArray.map((file, index) => async () => {
      const fileId = initialFiles[index].id;

      try {
        const content = await this.readFileWithTimeout(file, FILE_READ_TIMEOUT);
        if (!content || content.trim().length === 0) {
          throw new Error('File is empty or could not be read.');
        }

        const data = this.parserService.parse(content);

        setProcessedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, status: 'success', data, originalContent: content }
              : f
          )
        );
      } catch (error) {
        let errorMessage = 'Unknown error occurred';
        if (
          error instanceof ParsingError ||
          error instanceof ValidationError ||
          error instanceof RateLimitError
        ) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        errorMessage = errorMessage.replace(/[<>]/g, '').substring(0, 500);

        setProcessedFiles(prev =>
          prev.map(f =>
            f.id === fileId ? { ...f, status: 'error', error: errorMessage } : f
          )
        );
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    });

    for (let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT) {
      const chunk = tasks.slice(i, i + CONCURRENCY_LIMIT).map(task => task());
      await Promise.allSettled(chunk);
    }

    setIsProcessing(false);
  }

  private readFileWithTimeout(file: File, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(
          new Error('File reading timeout. File may be corrupted or too large.')
        );
      }, timeout);

      reader.onload = () => {
        clearTimeout(timeoutId);
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as text.'));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read file. File may be corrupted.'));
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(new Error('File reading was aborted.'));
      };

      try {
        reader.readAsText(file, 'utf-8');
      } catch {
        clearTimeout(timeoutId);
        reject(new Error('Failed to start reading file.'));
      }
    });
  }
}
