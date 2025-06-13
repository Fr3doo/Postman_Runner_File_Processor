import { Dispatch, SetStateAction } from 'react';
import { ProcessedFile } from '../types';
import { FileParserService } from './FileParserService';
import { FileValidationService } from './FileValidationService';
import {
  notificationService,
  type INotificationService,
} from './NotificationService';
import { loggingService } from './LoggingService';
import { configService } from './ConfigService';
import { ErrorHandler } from './ErrorHandler';
import { RateLimitError, ValidationError } from '../utils/errors';
import { ValidationResult } from '../utils/securityValidator';
import { ProcessFileCommand } from './ProcessFileCommand';

export class FileProcessor {
  constructor(
    private parserService: FileParserService,
    private validationService: FileValidationService,
    private notifyService: INotificationService = notificationService,
    private errorHandler: ErrorHandler = new ErrorHandler(),
  ) {}

  async processFiles(
    files: FileList,
    setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>,
    setIsProcessing: Dispatch<SetStateAction<boolean>>,
  ): Promise<void> {
    loggingService.logInfo(`Start processing ${files.length} file(s)`);
    try {
      this.validationService.validateRateLimit();
    } catch (error) {
      if (error instanceof RateLimitError) {
        const message = this.errorHandler.handle(error);
        loggingService.logError(`Rate limit exceeded: ${message}`);
        const errorFile: ProcessedFile = {
          id: crypto.randomUUID(),
          filename: 'Rate Limit Error',
          status: 'error',
          error: message,
        };
        setProcessedFiles((prev) => [errorFile, ...prev]);
        return;
      }
      throw error;
    }

    let validation: ValidationResult;
    try {
      validation = this.validationService.validateFiles(files);
    } catch (error) {
      if (error instanceof ValidationError) {
        const message = this.errorHandler.handle(error);
        loggingService.logError(`Validation failed: ${message}`);
        const errorFile: ProcessedFile = {
          id: crypto.randomUUID(),
          filename: 'Validation Error',
          status: 'error',
          error: message,
        };
        setProcessedFiles((prev) => [errorFile, ...prev]);
        return;
      }
      throw error;
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach((w) => this.notifyService.addWarning(w));
      validation.warnings.forEach((w) =>
        loggingService.logInfo(`Warning: ${w}`),
      );
    }

    setIsProcessing(true);
    const fileArray = Array.from(files);

    const initialFiles: ProcessedFile[] = fileArray.map((file) => ({
      id: crypto.randomUUID(),
      filename: file.name,
      status: 'processing',
    }));

    setProcessedFiles((prev) => [...initialFiles, ...prev]);

    const tasks = fileArray.map((file, index) => {
      const command = new ProcessFileCommand(
        file,
        initialFiles[index].id,
        this.parserService,
        (f) => this.readFileWithTimeout(f, configService.fileReadTimeout),
        setProcessedFiles,
        this.errorHandler,
      );
      return () => command.execute().then(() => new Promise((r) => setTimeout(r, 300)));
    });

    const limit = configService.concurrencyLimit;
    for (let i = 0; i < tasks.length; i += limit) {
      const chunk = tasks.slice(i, i + limit).map((task) => task());
      await Promise.allSettled(chunk);
    }

    setIsProcessing(false);
    loggingService.logInfo('All files processed');
  }

  private readFileWithTimeout(file: File, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(
          new Error(
            'Délai de lecture dépassé. Le fichier est peut-être corrompu ou trop volumineux.',
          ),
        );
      }, timeout);

      reader.onload = () => {
        clearTimeout(timeoutId);
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Impossible de lire le fichier en texte.'));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(
          new Error(
            'Impossible de lire le fichier. Il est peut-être corrompu.',
          ),
        );
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(new Error('La lecture du fichier a été annulée.'));
      };

      try {
        reader.readAsText(file, 'utf-8');
      } catch {
        clearTimeout(timeoutId);
        reject(new Error('Impossible de démarrer la lecture du fichier.'));
      }
    });
  }
}
