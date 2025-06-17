import React from 'react';
import { CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import { useFileHistory } from './FileHistoryContext';
import { FileParserService } from '../services/FileParserService';
import type { FileData, ProcessedFile } from '../types';
import { Card } from './ui/Card';
import { SummaryDetails } from './SummaryDetails';
import { formatFileSize } from '../utils/format';
import { t } from '../i18n';

interface FileHistoryGridProps {
  parser?: FileParserService;
}

export const FileHistoryGrid: React.FC<FileHistoryGridProps> = ({ parser = new FileParserService() }) => {
  const { history, removeFile, clearHistory } = useFileHistory();
  const [filter, setFilter] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filteredHistory = React.useMemo(() => {
    if (!filter.trim()) return history;
    return history.filter((f) =>
      f.filename.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [history, filter]);

const toggleSelect = (id: string) => {
  setSelected((prev) => {
    const next = new Set(prev);
    if (prev.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  });
};
  const handleDownloadSelected = () => {
const handleDownloadSelected = () => {
  const promises = filteredHistory
    .filter((file) => selected.has(file.id) && file.status === 'success' && file.summaries)
    .flatMap((file) => 
      file.summaries!.map((summary, idx) => {
        try {
          return parser.download(
            summary,
            `${file.filename.replace(/\.txt$/i, '')}-${idx + 1}`,
          );
        } catch (error) {
          console.error(`Failed to download ${file.filename}:`, error);
          return null;
        }
      })
    )
    .filter(Boolean);
};

  if (history.length === 0)
    return (
      <div className="text-center py-10 text-gray-500">{t('historyEmpty')}</div>
    );

  const handleDownload = (file: ProcessedFile, summary: FileData, idx: number) => {
    parser.download(summary, `${file.filename.replace(/\.txt$/i, '')}-${idx + 1}`);
  };

const handleRemove = (id: string) => {
  removeFile(id);
  setSelected((prev) => {
    if (!prev.has(id)) return prev;
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
};
  const handleClear = () => {
    clearHistory();
    setSelected(new Set());
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('historyTitle')}
        </h2>
        <div className="space-x-4">
          <button
            onClick={handleDownloadSelected}
            disabled={selected.size === 0}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors disabled:text-gray-400"
          >
            {t('downloadSelected')}
          </button>
          <button
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            {t('clearHistory')}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={t('filterPlaceholder')}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      {filteredHistory.length === 0 ? (
        <div className="text-center py-10 text-gray-500">{t('historyEmpty')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((file) => (
            <Card key={file.id} className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  aria-label={t('selectFile')}
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selected.has(file.id)}
                  onChange={() => toggleSelect(file.id)}
                />
                {getStatusIcon(file)}
                <h3 className="text-lg font-semibold text-gray-800 truncate">{file.filename}</h3>
              </div>
              {getStatusBadge(file)}
            </div>

            {(file.size || file.processedAt || file.recordCount || file.durationMs) && (
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                {file.size !== undefined && (
                  <div>
                    <span className="font-medium">{t('fileSize')}:</span> {formatFileSize(file.size)}
                  </div>
                )}
                {file.recordCount !== undefined && (
                  <div>
                    <span className="font-medium">{t('recordCount')}:</span> {file.recordCount}
                  </div>
                )}
                {file.durationMs !== undefined && (
                  <div>
                    <span className="font-medium">{t('durationMs')}:</span> {file.durationMs} ms
                  </div>
                )}
                {file.processedAt !== undefined && (
                  <div>
                    <span className="font-medium">{t('processedAt')}:</span> {new Date(file.processedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}

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
                  <SummaryDetails
                    key={idx}
                    summary={summary}
                    downloadLabel={t('downloadAgain')}
                    onDownload={() => handleDownload(file, summary, idx)}
                  />
                ))}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => handleRemove(file.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Trash2 size={16} />
                <span>{t('removeFile')}</span>
              </button>
            </div>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileHistoryGrid;
