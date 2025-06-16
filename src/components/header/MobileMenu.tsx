import React, { useState } from 'react';
import { Menu, X, Home, FileText, Settings, HelpCircle } from 'lucide-react';

interface MobileMenuProps {
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: <Home size={20} />, active: true },
    { id: 'files', label: 'Fichiers', icon: <FileText size={20} /> },
    { id: 'settings', label: 'Paramètres', icon: <Settings size={20} /> },
    { id: 'help', label: 'Aide', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className={`md:hidden ${className}`}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50
          rounded-lg transition-colors duration-200
        "
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="
            absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl
            border border-gray-200 z-50 overflow-hidden
          ">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Navigation</h3>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 text-sm font-medium
                    ${
                      item.active
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};
