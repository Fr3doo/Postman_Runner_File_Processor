import React from 'react';
import { ProcessedFile, FileData } from '../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { downloadJSON } from '../utils/fileParser';
import { Card } from './ui/Card';
import { SummaryDetails } from './SummaryDetails';
import { t } from '../i18n';

interface ResultCardProps {
  file: ProcessedFile;
}

export const ResultCard: React.FC<ResultCardProps> = ({ file }) => {
  const handleDownload = (summary: FileData, idx: number) => {
    downloadJSON(summary, `${file.filename.replace(/\.txt$/i, '')}-${idx + 1}`);
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <XCircle className="text-red-500" size={20} />;
      case 'processing':
        return <Clock className="text-blue-500 animate-pulse" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
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
    <Card className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {file.filename}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      {file.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <XCircle className="text-red-500" size={16} />
            <p className="text-sm font-medium text-red-800">
              {t('processingError')}
            </p>
          </div>
          <p className="text-sm text-red-700 mt-1">{file.error}</p>
        </div>
      )}

      {file.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-500 animate-pulse" size={16} />
            <p className="text-sm font-medium text-blue-800">
              {t('fileProcessing')}
            </p>
          </div>
        </div>
      )}

      {file.status === 'success' && file.summaries && (
        <div className="space-y-8">
          {file.summaries.map((summary, idx) => (
            <SummaryDetails
              key={idx}
              summary={summary}
              downloadLabel={t('downloadJson')}
              onDownload={() => handleDownload(summary, idx)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};
