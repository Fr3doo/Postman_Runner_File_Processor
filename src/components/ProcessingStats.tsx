import React from 'react';
import { ProcessingStats } from '../types';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

interface ProcessingStatsProps {
  stats: ProcessingStats;
  onClearResults: () => void;
}

export const ProcessingStatsComponent: React.FC<ProcessingStatsProps> = ({ 
  stats, 
  onClearResults 
}) => {
  if (stats.total === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Processing Summary</h3>
          <button
            onClick={onClearResults}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            Clear Results
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="text-gray-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.processed}</div>
            <div className="text-sm text-blue-600">Processed</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
            <div className="text-sm text-green-600">Successful</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="text-red-600" size={24} />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
        </div>
        
        {stats.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round((stats.processed / stats.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(stats.processed / stats.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};