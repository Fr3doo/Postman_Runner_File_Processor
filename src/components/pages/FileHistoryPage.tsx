import React from 'react';
import { FileHistoryProvider, useFileHistory } from '../FileHistoryContext';
import { FileHistoryGrid } from '../FileHistoryGrid';
import { ProcessingStatsComponent } from '../ProcessingStats';
import type { ProcessingStats } from '../../types';

const HistoryContent: React.FC = () => {
  const { history, clearHistory } = useFileHistory();

  const stats: ProcessingStats = React.useMemo(
    () => ({
      total: history.length,
      processed: history.length,
      successful: history.filter((f) => f.status === 'success').length,
      failed: history.filter((f) => f.status === 'error').length,
    }),
    [history],
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <ProcessingStatsComponent stats={stats} onClearResults={clearHistory} />
      <FileHistoryGrid />
    </main>
  );
};

export const FileHistoryPage: React.FC = () => (
  <FileHistoryProvider>
    <HistoryContent />
  </FileHistoryProvider>
);

export default FileHistoryPage;
