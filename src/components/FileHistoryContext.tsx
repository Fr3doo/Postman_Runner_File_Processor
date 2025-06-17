import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fileHistoryService,
  type IFileHistoryService,
} from '../services/FileHistoryService';
import type { ProcessedFile } from '../types';

/* eslint-disable react-refresh/only-export-components */

interface FileHistoryContextValue {
  history: ProcessedFile[];
  removeFile: (id: string) => void;
  clearHistory: () => void;
}

const FileHistoryContext = createContext<FileHistoryContextValue | undefined>(
  undefined,
);

export const FileHistoryProvider: React.FC<{
  children: React.ReactNode;
  service?: IFileHistoryService;
}> = ({ children, service = fileHistoryService }) => {
  const [history, setHistory] = useState<ProcessedFile[]>([]);

  useEffect(() => {
    service.load();
    const unsubscribe = service.subscribe(setHistory);
    return () => unsubscribe();
  }, [service]);

  const handleRemove = (id: string) => {
    service.removeFile(id);
  };

  const handleClear = () => {
    service.clearHistory();
  };

  return (
    <FileHistoryContext.Provider
      value={{ history, removeFile: handleRemove, clearHistory: handleClear }}
    >
      {children}
    </FileHistoryContext.Provider>
  );
};

export const useFileHistory = (): FileHistoryContextValue => {
  const context = useContext(FileHistoryContext);
  if (!context) {
    throw new Error('useFileHistory must be used within a FileHistoryProvider');
  }
  return context;
};
