import React from 'react';
import { CheckCircle, XCircle, Clock, Download, FileText, Calendar, Hash, FolderOpen, Trash2 } from 'lucide-react';
import { useFileHistory } from './FileHistoryContext';
import { FileParserService } from '../services/FileParserService';
import type { FileData, ProcessedFile } from '../types';
import { Card } from './ui/Card';
import { t } from '../i18n';

interface FileHistoryGridProps {
  parser?: FileParserService;
}

export const FileHistoryGrid: React.FC<FileHistoryGridProps> = ({ parser = new FileParserService() }) => {
  const { history, removeFile, clearHistory } = useFileHistory();

  if (history.length === 0) return null;

  const handleDownload = (file: ProcessedFile, summary: FileData, idx: number) => {
    parser.download(summary, `${file.filename.replace(/\.txt$/i, '')}-${idx + 1}`);
  };

  const getStatusIcon = (file: ProcessedFile) => {
    switch (file.status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'processing':
        return <Clock className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (file: ProcessedFile) => {
    switch (file.status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {t('statusSuccess')}
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {t('statusError')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {t('statusProcessing')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={clearHistory}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
        >
          {t('clearHistory')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((file) => (
          <Card key={file.id} className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(file)}
                <h3 className="text-lg font-semibold text-gray-800 truncate">{file.filename}</h3>
              </div>
              {getStatusBadge(file)}
            </div>

            {file.status === 'error' && file.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <XCircle className="text-red-500" size={16} />
                  <p className="text-sm font-medium text-red-800">{t('processingError')}</p>
                </div>
                <p className="text-sm text-red-700 mt-1">{file.error}</p>
              </div>
            )}

            {file.status === 'success' && file.summaries && (
              <div className="space-y-8">
                {file.summaries.map((summary, idx) => (
                  <div
                    key={idx}
                    className="space-y-4 pt-4 border-t first:border-none first:pt-0"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{t('remainingFiles')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{summary.nombre_fichiers_restants}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hash className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{t('teledemarche')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">AUTO-{summary.numero_teledemarche}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <FolderOpen className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{t('projectName')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{summary.nom_projet}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Hash className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{t('folderNumber')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">D{summary.numero_dossier}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="text-gray-600" size={16} />
                          <span className="text-sm font-medium text-gray-700">{t('depositDate')}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{summary.date_depot}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleDownload(file, summary, idx)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Download size={16} />
                        <span>{t('downloadJson')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => removeFile(file.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Trash2 size={16} />
                <span>{t('removeFile')}</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileHistoryGrid;
