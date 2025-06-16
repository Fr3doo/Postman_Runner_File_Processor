import React from 'react';
import { X, Home, FileText, Settings, HelpCircle } from 'lucide-react';
import type { NavItem } from './Navigation';
import { UserActions } from './UserActions';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  className?: string;
  actions: {
    githubUrl: string;
    downloadUrl: string;
  };
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  onClose,
  items,
  actions,
  className = '',
}) => {
  const menuItems = items.length
    ? items
    : [
        { id: 'home', label: 'Accueil', icon: <Home size={20} />, active: true },
        { id: 'files', label: 'Fichiers', icon: <FileText size={20} /> },
        { id: 'settings', label: 'Param\u00e8tres', icon: <Settings size={20} /> },
        { id: 'help', label: 'Aide', icon: <HelpCircle size={20} /> },
      ];

  return (
    <div className={`md:hidden ${className}`}>
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <div
            role="dialog"
            aria-hidden={open ? 'false' : 'true'}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Navigation</h3>
              <button aria-label="Close menu" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <UserActions {...actions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
