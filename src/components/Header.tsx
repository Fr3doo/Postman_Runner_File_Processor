import React from 'react';
import { FileText, Zap } from 'lucide-react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon = <FileText className="text-white" size={32} />,
  rightIcon = <Zap className="text-white" size={32} />,
}) => {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-blue-600 rounded-full">{leftIcon}</div>
        <div className="p-3 bg-purple-600 rounded-full">{rightIcon}</div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      {subtitle && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
      )}
    </header>
  );
};

export default Header;
