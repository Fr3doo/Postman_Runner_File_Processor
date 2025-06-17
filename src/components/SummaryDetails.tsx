import React from 'react';
import { FileData } from '../types';
import { FileText, Hash, FolderOpen, Calendar, Download } from 'lucide-react';
import { t } from '../i18n';

interface SummaryDetailsProps {
  summary: FileData;
  onDownload: () => void;
  downloadLabel: string;
}

export const SummaryDetails: React.FC<SummaryDetailsProps> = ({
  summary,
  onDownload,
  downloadLabel,
}) => (
  <div className="space-y-4 pt-4 border-t first:border-none first:pt-0">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="text-gray-600" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {t('remainingFiles')}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {summary.nombre_fichiers_restants}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Hash className="text-gray-600" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {t('teledemarche')}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          AUTO-{summary.numero_teledemarche}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
        <div className="flex items-center space-x-2 mb-2">
          <FolderOpen className="text-gray-600" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {t('projectName')}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {summary.nom_projet}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Hash className="text-gray-600" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {t('folderNumber')}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          D{summary.numero_dossier}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="text-gray-600" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {t('depositDate')}
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {summary.date_depot}
        </p>
      </div>
    </div>

    <div className="pt-4 border-t border-gray-200">
      <button
        onClick={onDownload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <Download size={16} />
        <span>{downloadLabel}</span>
      </button>
    </div>
  </div>
);

export default SummaryDetails;
