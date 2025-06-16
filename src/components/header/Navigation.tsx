import React from 'react';
import { Home, FileText, Settings, HelpCircle } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  active?: boolean;
}

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Accueil',
      icon: <Home size={18} />,
      href: '#',
      active: true,
    },
    {
      id: 'files',
      label: 'Fichiers',
      icon: <FileText size={18} />,
      href: '#',
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: <Settings size={18} />,
      href: '#',
    },
    {
      id: 'help',
      label: 'Aide',
      icon: <HelpCircle size={18} />,
      href: '#',
    },
  ];

  return (
    <nav className={`hidden md:flex items-center space-x-1 ${className}`}>
      {navigationItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200 ease-in-out
            ${
              item.active
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
};
