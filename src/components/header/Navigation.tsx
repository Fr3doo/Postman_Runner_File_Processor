import React from 'react';

export interface NavItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className = '' }) => (
  <nav className={`flex space-x-6 ${className}`}>
    {items.map((item) => (
      <a
        key={item.href}
        href={item.href}
        className={`text-sm transition-colors duration-300 ${
          item.current ? 'font-semibold underline' : 'text-gray-600 hover:text-gray-900'
        }`}
        aria-current={item.current ? 'page' : undefined}
      >
        {item.label}
      </a>
    ))}
  </nav>
);

export default Navigation;
