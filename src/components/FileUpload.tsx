import React, { useCallback, useState, useMemo, useRef } from 'react';
import { Upload, FileText, AlertCircle, Info, Shield } from 'lucide-react';
import { FileValidationService } from '../services/FileValidationService';
import { configService } from '../services/ConfigService';
import { formatFileSize } from '../utils/format';
import { useNotifications } from './NotificationContext';
import { Card } from './ui/Card';
import { t } from '../i18n';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { warnings, addWarning, clearWarnings } = useNotifications();
  const validationService = useMemo(() => new FileValidationService(), []);
  
  // Utiliser une ref pour éviter les re-renders pendant le drag
  const dragCounterRef = useRef(0);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Incrémenter le compteur pour gérer les événements multiples
      dragCounterRef.current++;
      
      // Ne changer l'état que si on n'est pas déjà en mode drag
      if (dragCounterRef.current === 1) {
        setIsDragOver(true);
      }
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Décrémenter le compteur
      dragCounterRef.current--;
      
      // Ne changer l'état que quand on quitte vraiment la zone
      if (dragCounterRef.current === 0) {
        setIsDragOver(false);
      }
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Assurer que l'effet visuel est activé
      if (!isDragOver && dragCounterRef.current > 0) {
        setIsDragOver(true);
      }
    },
    [isDragOver],
  );

  const handleFilesSelected = useCallback(
    (files: FileList) => {
      // Clear previous validation messages
      setValidationErrors([]);
      clearWarnings();

      try {
        // Validate files
        const validation = validationService.validateFiles(files);

        if (!validation.isValid) {
          setValidationErrors(validation.errors);
          validation.warnings.forEach(addWarning);
          return;
        }

        if (validation.warnings.length > 0) {
          validation.warnings.forEach(addWarning);
        }

        // Files are valid, proceed with processing
        onFilesSelected(files);
      } catch (error) {
        if (error instanceof Error) {
          setValidationErrors([error.message]);
        } else {
          setValidationErrors(['An unknown error occurred during validation.']);
        }
      }
    },
    [
      onFilesSelected,
      validationService,
      setValidationErrors,
      addWarning,
      clearWarnings,
    ],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Réinitialiser complètement l'état de drag
      dragCounterRef.current = 0;
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFilesSelected(files);
      }
    },
    [handleFilesSelected],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFilesSelected(files);
      }
      // Reset input value to allow re-selecting same files
      e.target.value = '';
    },
    [handleFilesSelected],
  );

  // Gérer le cas où l'utilisateur quitte la fenêtre pendant le drag
  const handleWindowDragLeave = useCallback((e: DragEvent) => {
    // Si on quitte complètement la fenêtre, réinitialiser
    if (!e.relatedTarget) {
      dragCounterRef.current = 0;
      setIsDragOver(false);
    }
  }, []);

  // Ajouter/supprimer l'écouteur global
  React.useEffect(() => {
    window.addEventListener('dragleave', handleWindowDragLeave);
    return () => {
      window.removeEventListener('dragleave', handleWindowDragLeave);
    };
  }, [handleWindowDragLeave]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <Card
        ref={dropZoneRef}
        className={`
          relative border-2 border-dashed text-center transition-all duration-200 ease-in-out
          ${
            isDragOver
              ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4 p-8">
          <div
            className={`
            p-4 rounded-full transition-all duration-200 ease-in-out
            ${
              isDragOver 
                ? 'bg-blue-500 text-white shadow-lg transform scale-110' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
          >
            <Upload size={32} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('uploadTitle')}
            </h3>
            <p className="text-gray-600 mb-4">{t('uploadSubtitle')}</p>
          </div>

          <div className="flex items-center space-x-4">
            <label
              className="
              bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
              cursor-pointer transition-all duration-200 font-medium
              flex items-center space-x-2 hover:shadow-lg transform hover:scale-105
            "
            >
              <FileText size={20} />
              <span>{t('chooseFiles')}</span>
              <input
                type="file"
                multiple
                accept=".txt"
                onChange={handleFileInput}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>

          {/* Security Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">
                {t('securityLimits')}
              </span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                •
                {t('maxFilesCount', {
                  count: configService.security.MAX_FILES_COUNT,
                })}
              </div>
              <div>
                •
                {t('maxFileSize', {
                  size: formatFileSize(configService.security.MAX_FILE_SIZE),
                })}
              </div>
              <div>
                •
                {t('maxTotalSize', {
                  size: formatFileSize(configService.security.MAX_TOTAL_SIZE),
                })}
              </div>
              <div>• {t('onlyTxtSupported')}</div>
            </div>
          </div>

          {/* Overlay de drag amélioré */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-xl border-2 border-blue-500 border-dashed">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Upload className="text-white" size={24} />
                  </div>
                  <div className="text-blue-600 font-semibold text-lg text-center">
                    {t('dropFilesHere')}
                  </div>
                  <div className="text-blue-500 text-sm text-center">
                    Relâchez pour traiter vos fichiers
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="text-red-500" size={16} />
            <span className="text-sm font-medium text-red-800">
              {t('validationErrorsTitle')}
            </span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Warnings */}
      {warnings.length > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-fadeIn">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="text-yellow-600" size={16} />
            <span className="text-sm font-medium text-yellow-800">
              {t('warningsTitle')}
            </span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};