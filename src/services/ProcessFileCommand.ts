import { Dispatch, SetStateAction } from 'react';
import type { ProcessedFile } from '../types';
import { FileParserService } from './FileParserService';
import { ErrorHandler } from './ErrorHandler';
import {
  loggingService as defaultLoggingService,
  type ILoggingService,
} from './LoggingService';
import {
  fileHistoryService as defaultFileHistoryService,
  type IFileHistoryService,
} from './FileHistoryService';

export class ProcessFileCommand {
  constructor(
    private file: File,
    private fileId: string,
    private parserService: FileParserService,
    private readFile: (file: File) => Promise<string>,
    private setProcessedFiles: Dispatch<SetStateAction<ProcessedFile[]>>,
    private errorHandler: ErrorHandler = new ErrorHandler(),
    private loggingService: ILoggingService = defaultLoggingService,
    private fileHistoryService: IFileHistoryService = defaultFileHistoryService,
  ) {}

  async execute(): Promise<void> {
    this.loggingService.logInfo(`Processing file: ${this.file.name}`);
    try {
      const content = await this.readFile(this.file);
      if (!content || content.trim().length === 0) {
        throw new Error("Le fichier est vide ou n'a pas pu être lu.");
      }
      const summaries = this.parserService.parse(content);
      let finalFile: ProcessedFile | undefined;
      this.setProcessedFiles((prev) =>
        prev.map((f) => {
          if (f.id === this.fileId) {
            finalFile = {
              ...f,
              status: 'success',
              summaries,
              originalContent: content,
            };
            return finalFile;
          }
          return f;
        }),
      );
      if (finalFile) {
        this.fileHistoryService.addFile(finalFile);
        this.fileHistoryService.save();
      }
      this.loggingService.logInfo(`Processed ${this.file.name} successfully`);
    } catch (error) {
      const message = this.errorHandler.handle(error);
      let finalFile: ProcessedFile | undefined;
      this.setProcessedFiles((prev) =>
        prev.map((f) => {
          if (f.id === this.fileId) {
            finalFile = { ...f, status: 'error', error: message };
            return finalFile;
          }
          return f;
        }),
      );
      if (finalFile) {
        this.fileHistoryService.addFile(finalFile);
        this.fileHistoryService.save();
      }
      this.loggingService.logError(
        `Failed processing ${this.file.name}: ${message}`,
      );
    }
  }
}
