import { Dispatch, SetStateAction } from 'react';
import type { ProcessedFile } from '../types';
import { FileParserService } from './FileParserService';
import { ErrorHandler } from './ErrorHandler';
import { loggingService } from './LoggingService';

export class ProcessFileCommand {
  constructor(
    private file: File,
    private fileId: string,
    private parserService: FileParserService,
    private readFile: (file: File) => Promise<string>,
    private setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>,
    private errorHandler: ErrorHandler = new ErrorHandler(),
  ) {}

  async execute(): Promise<void> {
    loggingService.logInfo(`Processing file: ${this.file.name}`);
    try {
      const content = await this.readFile(this.file);
      if (!content || content.trim().length === 0) {
        throw new Error("Le fichier est vide ou n'a pas pu être lu.");
      }
      const summaries = this.parserService.parse(content);
      this.setProcessedFiles((prev) =>
        prev.map((f) =>
          f.id === this.fileId
            ? { ...f, status: 'success', summaries, originalContent: content }
            : f,
        ),
      );
      loggingService.logInfo(`Processed ${this.file.name} successfully`);
    } catch (error) {
      const message = this.errorHandler.handle(error);
      this.setProcessedFiles((prev) =>
        prev.map((f) =>
          f.id === this.fileId ? { ...f, status: 'error', error: message } : f,
        ),
      );
      loggingService.logError(`Failed processing ${this.file.name}: ${message}`);
    }
  }
}
