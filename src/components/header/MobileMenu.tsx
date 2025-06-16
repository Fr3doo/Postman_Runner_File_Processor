import React from 'react';
import { X } from 'lucide-react';
import { DEFAULT_NAV_ITEMS } from './defaultNavItems';
import type { NavItem } from './Navigation';
import { UserActions } from './UserActions';

interface MobileMenuProps {
  /** Whether the menu is visible */
  open: boolean;
  /** Close handler triggered on backdrop or button click */
  onClose: () => void;
  /** Navigation items to display */
  items: NavItem[];
  /** URLs for user actions */
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
}) => {
  const menuItems = items.length ? items : DEFAULT_NAV_ITEMS;

  return (
    <div className="md:hidden">
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <div
            role="dialog"
            aria-hidden={open ? 'false' : 'true'}
            aria-modal="true"
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Navigation</h3>
              <button aria-label="Close menu" onClick={onClose} className="flex items-center space-x-2">
                <span className="sr-only">Close menu</span>
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
                  onClick={(e) => {
                    if (item.href === '#') e.preventDefault();
                    item.onClick?.();
                    onClose();
                  }}
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
