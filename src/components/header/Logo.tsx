import React from 'react';
import { FileText } from 'lucide-react';

export const Logo: React.FC = () => (
  <a href="#" className="flex items-center space-x-2 focus-visible:outline-none">
    <FileText className="w-6 h-6 text-blue-600" />
    <span className="font-bold text-gray-900">PRFP</span>
  </a>
);

export default Logo;
