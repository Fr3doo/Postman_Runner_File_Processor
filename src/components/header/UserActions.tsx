import React from 'react';
import { Github, Download, ExternalLink } from 'lucide-react';

export interface UserActionsProps {
  githubUrl: string;
  downloadUrl: string;
}

export const UserActions: React.FC<UserActionsProps> = ({ githubUrl, downloadUrl }) => (
  <div className="flex items-center space-x-4">
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-1 text-sm hover:underline focus-visible:outline-none"
    >
      <Github className="w-4 h-4" />
      <ExternalLink className="w-3 h-3" />
    </a>
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-1 text-sm hover:underline focus-visible:outline-none"
    >
      <Download className="w-4 h-4" />
      <ExternalLink className="w-3 h-3" />
    </a>
  </div>
);

export default UserActions;
