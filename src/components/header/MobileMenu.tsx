import React from 'react';
import { X } from 'lucide-react';
import type { NavItem } from './Navigation';
import UserActions, { UserActionsProps } from './UserActions';

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  actions: UserActionsProps;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, items, actions }) => (
  <div
    className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${
      open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
    }`}
    aria-hidden={!open}
    role="dialog"
  >
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
    <div className="relative bg-white rounded-lg shadow-lg mx-4 mt-20 p-6 space-y-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 focus-visible:outline-none"
        aria-label="Close menu"
      >
        <X className="w-5 h-5" />
      </button>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.current ? 'page' : undefined}
          className="block py-2 text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          {item.label}
        </a>
      ))}
      <UserActions {...actions} />
    </div>
  </div>
);

export default MobileMenu;
