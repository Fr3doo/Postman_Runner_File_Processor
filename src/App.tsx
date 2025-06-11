import React from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsGrid } from './components/ResultsGrid';
import { ProcessingStatsComponent } from './components/ProcessingStats';
import { useFileProcessor } from './hooks/useFileProcessor';
import { FileText, Zap } from 'lucide-react';

function App() {
  const { 
    processedFiles, 
    isProcessing, 
    processFiles, 
    clearResults, 
    getStats 
  } = useFileProcessor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <FileText className="text-white" size={32} />
            </div>
            <div className="p-3 bg-purple-600 rounded-full">
              <Zap className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Postman Runner File Processor
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload and process your Postman Runner .txt files to extract structured data 
            and generate downloadable JSON files with comprehensive error handling.
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
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-500 text-lg">
              No files processed yet. Upload some .txt files to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;