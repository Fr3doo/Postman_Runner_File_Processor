import React from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsGrid } from './components/ResultsGrid';
import { ProcessingStatsComponent } from './components/ProcessingStats';
import { NotificationProvider } from './components/NotificationContext';
import { useFileProcessor } from './hooks/useFileProcessor';
import { Header } from './components/Header';
import { FileText } from 'lucide-react';
import { t } from './i18n';

function App() {
  const { processedFiles, isProcessing, processFiles, clearResults, getStats } =
    useFileProcessor();

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header title={t('appTitle')} subtitle={t('appSubtitle')} />

          {/* File Upload Section */}
          <FileUpload
            onFilesSelected={processFiles}
            isProcessing={isProcessing}
          />

          {/* Processing Stats */}
          <ProcessingStatsComponent
            stats={getStats()}
            onClearResults={clearResults}
          />

          {/* Results Grid */}
          <ResultsGrid files={processedFiles} />

          {/* Empty State */}
          {processedFiles.length === 0 && !isProcessing && (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-500 text-lg">{t('emptyState')}</p>
            </div>
          )}
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;
