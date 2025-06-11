import { useState, useCallback } from 'react';
import { ProcessedFile, ProcessingStats } from '../types';
import { FileParserService } from '../services/FileParserService';
import { FileValidationService } from '../services/FileValidationService';

export const useFileProcessor = (
  parserService: FileParserService = new FileParserService(),
  validationService: FileValidationService = new FileValidationService()
) => {
  const CONCURRENCY_LIMIT = 5;
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = useCallback(async (files: FileList) => {
    // Validate rate limiting first
    const rateLimitValidation = validationService.validateRateLimit();
    if (!rateLimitValidation.isValid) {
      // Show rate limit error
      const errorFile: ProcessedFile = {
        id: crypto.randomUUID(),
        filename: 'Rate Limit Error',
        status: 'error',
        error: rateLimitValidation.errors.join(', '),
      };
      setProcessedFiles(prev => [errorFile, ...prev]);
      return;
    }

    // Validate files before processing
    const validation = validationService.validateFiles(files);
    if (!validation.isValid) {
      // Create error entries for validation failures
      const errorFile: ProcessedFile = {
        id: crypto.randomUUID(),
        filename: 'Validation Error',
        status: 'error',
        error: validation.errors.join(', '),
      };
      setProcessedFiles(prev => [errorFile, ...prev]);
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      console.warn('File validation warnings:', validation.warnings);
    }

    setIsProcessing(true);
    const fileArray = Array.from(files);

    // Initialize all files as processing
    const initialFiles: ProcessedFile[] = fileArray.map(file => ({
      id: crypto.randomUUID(),
      filename: file.name,
      status: 'processing',
    }));

    setProcessedFiles(prev => [...initialFiles, ...prev]);

    const tasks = fileArray.map((file, index) => async () => {
      const fileId = initialFiles[index].id;

      try {
        // Additional file validation
        if (!file.name.endsWith('.txt')) {
          throw new Error('Invalid file type. Only .txt files are supported.');
        }

        // Check file size again (defense in depth)
        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed: 10MB.`);
        }

        // Read file content with timeout
        const content = await readFileWithTimeout(file, 30000); // 30 second timeout

        if (!content || content.trim().length === 0) {
          throw new Error('File is empty or could not be read.');
        }

        // Parse with enhanced error handling
        const data = parserService.parse(content);

        setProcessedFiles(prev => prev.map(f =>
          f.id === fileId
            ? { ...f, status: 'success', data, originalContent: content }
            : f
        ));
      } catch (error) {
        let errorMessage = 'Unknown error occurred';

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }

        // Sanitize error message to prevent XSS
        errorMessage = errorMessage.replace(/[<>]/g, '').substring(0, 500);

        setProcessedFiles(prev => prev.map(f =>
          f.id === fileId
            ? { ...f, status: 'error', error: errorMessage }
            : f
        ));
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    });

    for (let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT) {
      const chunk = tasks.slice(i, i + CONCURRENCY_LIMIT).map(task => task());
      await Promise.allSettled(chunk);
    }

    setIsProcessing(false);
  }, []);

  const clearResults = useCallback(() => {
    setProcessedFiles([]);
  }, []);

  const getStats = useCallback((): ProcessingStats => {
    return {
      total: processedFiles.length,
      processed: processedFiles.filter(f => f.status !== 'processing').length,
      successful: processedFiles.filter(f => f.status === 'success').length,
      failed: processedFiles.filter(f => f.status === 'error').length,
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

/**
 * Reads file content with timeout to prevent hanging
 */
const readFileWithTimeout = (file: File, timeout: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    const timeoutId = setTimeout(() => {
      reader.abort();
      reject(new Error('File reading timeout. File may be corrupted or too large.'));
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
};