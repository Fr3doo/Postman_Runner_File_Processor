import React from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ResultsGrid } from './components/ResultsGrid';
import { ProcessingStatsComponent } from './components/ProcessingStats';
import { NotificationProvider } from './components/NotificationContext';
import { useFileProcessor } from './hooks/useFileProcessor';
import { FileText, Zap } from 'lucide-react';
import { t } from './i18n';

function App() {
  const { processedFiles, isProcessing, processFiles, clearResults, getStats } =
    useFileProcessor();

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                <FileText className="text-white" size={40} />
              </div>
              <div className="p-4 bg-purple-600 rounded-2xl shadow-lg">
                <Zap className="text-white" size={40} />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {t('appTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {t('appSubtitle')}
            </p>
          </div>

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
            <div className="text-center py-20">
              <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <FileText className="text-gray-400" size={40} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Prêt à commencer
              </h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                {t('emptyState')}
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600">
              <p className="text-sm">
                © 2024 Postman Runner File Processor. Tous droits réservés.
              </p>
              <p className="text-xs mt-2 opacity-75">
                Développé avec ❤️ pour simplifier le traitement de vos fichiers Postman Runner
              </p>
            </div>
          </div>
        </footer>
      </div>
    </NotificationProvider>
  );
}

export default App;