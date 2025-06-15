import { useState, useCallback } from 'react';
import { ProcessedFile, ProcessingStats } from '../types';
import { FileParserService } from '../services/FileParserService';
import { FileValidationService } from '../services/FileValidationService';
import { FileProcessor } from '../services/FileProcessor';
import { FileReaderService } from '../services/FileReaderService';
import { ErrorHandler } from '../services/ErrorHandler';
import { loggingService } from '../services/LoggingService';

export const useFileProcessor = (
  processor: FileProcessor = new FileProcessor(
    new FileParserService(),
    new FileValidationService(),
    new FileReaderService(),
    undefined,
    new ErrorHandler(),
    loggingService,
  ),
) => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(
    async (files: FileList) => {
      await processor.processFiles(files, setProcessedFiles, setIsProcessing);
    },
    [processor, setProcessedFiles, setIsProcessing],
  );

  const clearResults = useCallback(() => {
    setProcessedFiles([]);
  }, [setProcessedFiles]);

  const getStats = useCallback((): ProcessingStats => {
    return {
      total: processedFiles.length,
      processed: processedFiles.filter((f) => f.status !== 'processing').length,
      successful: processedFiles.filter((f) => f.status === 'success').length,
      failed: processedFiles.filter((f) => f.status === 'error').length,
    };
  }, [processedFiles]);

  return {
    processedFiles,
    isProcessing,
    processFiles,
    clearResults,
    getStats,
  };
};
