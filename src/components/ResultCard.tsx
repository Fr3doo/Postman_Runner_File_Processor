import React from 'react';
import { ProcessedFile } from '../types';
import { CheckCircle, XCircle, Clock, Download, FileText, Calendar, Hash, FolderOpen } from 'lucide-react';
import { downloadJSON } from '../utils/fileParser';

interface ResultCardProps {
  file: ProcessedFile;
}

export const ResultCard: React.FC<ResultCardProps> = ({ file }) => {
  const handleDownload = () => {
    if (file.data) {
      downloadJSON(file.data, file.filename);
    }
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
            ✅ Success
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ⛔️ Error
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🔄 Processing
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
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
            <p className="text-sm font-medium text-red-800">Processing Error</p>
          </div>
          <p className="text-sm text-red-700 mt-1">{file.error}</p>
        </div>
      )}

      {file.status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-500 animate-pulse" size={16} />
            <p className="text-sm font-medium text-blue-800">Processing file...</p>
          </div>
        </div>
      )}

      {file.status === 'success' && file.data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Files Remaining</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {file.data.nombre_fichiers_restants}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Télédémarche</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                AUTO-{file.data.numero_teledemarche}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <FolderOpen className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Project Name</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {file.data.nom_projet}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Dossier Number</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                D{file.data.numero_dossier}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="text-gray-600" size={16} />
                <span className="text-sm font-medium text-gray-700">Deposit Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {file.data.date_depot}
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download size={16} />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};