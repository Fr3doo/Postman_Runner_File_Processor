import React from 'react';
import { ProcessedFile } from '../types';
import { ResultCard } from './ResultCard';

interface ResultsGridProps {
  files: ProcessedFile[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <ResultCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};