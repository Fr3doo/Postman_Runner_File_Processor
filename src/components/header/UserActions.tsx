import React from 'react';
import { Github, Download, ExternalLink } from 'lucide-react';

interface UserActionsProps {
  /** GitHub repository URL */
  githubUrl: string;
  /** URL to download the application */
  downloadUrl: string;
  className?: string;
}

export const UserActions: React.FC<UserActionsProps> = ({
  githubUrl,
  downloadUrl,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* GitHub Link */}
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900
          hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm font-medium
        "
        title="Voir sur GitHub"
      >
        <Github size={18} />
        <span className="hidden sm:inline">GitHub</span>
        <ExternalLink size={14} className="opacity-60" />
      </a>

      {/* Download Button */}
      <a
        href={downloadUrl}
        download
        className="
          flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600
          text-white rounded-lg hover:from-blue-700 hover:to-purple-700
          transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
          text-sm font-medium
        "
        title="Télécharger l'application"
      >
        <Download size={18} />
        <span className="hidden sm:inline">Télécharger</span>
      </a>
    </div>
  );
};
