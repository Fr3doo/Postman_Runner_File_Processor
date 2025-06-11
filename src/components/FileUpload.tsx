import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, Shield, Info } from 'lucide-react';
import { FileValidationService } from '../services/FileValidationService';
import { SECURITY_CONFIG } from '../config/security';
import { formatFileSize } from '../utils/format';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const validationService = new FileValidationService();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter <= 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelected(files);
    }
    // Reset input value to allow re-selecting same files
    e.target.value = '';
  }, []);

  const handleFilesSelected = useCallback((files: FileList) => {
    // Clear previous validation messages
    setValidationErrors([]);
    setValidationWarnings([]);

    // Validate files
    const validation = validationService.validateFiles(files);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setValidationWarnings(validation.warnings);
      return;
    }

    if (validation.warnings.length > 0) {
      setValidationWarnings(validation.warnings);
    }

    // Files are valid, proceed with processing
    onFilesSelected(files);
  }, [onFilesSelected]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragOver ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
          `}>
            <Upload size={32} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Upload Postman Runner Files
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your .txt files here, or click to browse
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="
              bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg
              cursor-pointer transition-colors duration-200 font-medium
              flex items-center space-x-2
            ">
              <FileText size={20} />
              <span>Choose Files</span>
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
              <span className="text-sm font-medium text-blue-800">Security Limits</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• Maximum {SECURITY_CONFIG.MAX_FILES_COUNT} files per upload</div>
              <div>• Maximum {formatFileSize(SECURITY_CONFIG.MAX_FILE_SIZE)} per file</div>
              <div>• Maximum {formatFileSize(SECURITY_CONFIG.MAX_TOTAL_SIZE)} total size</div>
              <div>• Only .txt files from Postman Runner are supported</div>
            </div>
          </div>
          
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center">
              <div className="text-blue-600 font-semibold text-lg">
                Drop files here to process
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="text-red-500" size={16} />
            <span className="text-sm font-medium text-red-800">Validation Errors</span>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="text-yellow-600" size={16} />
            <span className="text-sm font-medium text-yellow-800">Warnings</span>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validationWarnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};