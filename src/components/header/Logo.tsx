import React from 'react';
import { FileText, Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
          <FileText className="text-white" size={24} />
        </div>
        <div className="p-2 bg-purple-600 rounded-lg shadow-lg">
          <Zap className="text-white" size={24} />
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          PostmanRunner
        </h1>
        <span className="text-sm text-gray-600 font-medium">
          File Processor
        </span>
      </div>
    </div>
  );
};
