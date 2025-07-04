import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo, Navigation, UserActions, MobileMenu } from './header';
import type { NavItem } from './header';
import { DEFAULT_NAV_ITEMS } from './header/defaultNavItems';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  items?: NavItem[];
  githubUrl: string;
  downloadUrl: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  items = DEFAULT_NAV_ITEMS,
  githubUrl,
  downloadUrl,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur bg-gradient-to-r from-purple-600/70 via-pink-500/60 to-red-400/70 shadow-md drop-shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Logo />
        <Navigation items={items} className="hidden md:flex" />
        <div className="hidden md:flex">
          <UserActions githubUrl={githubUrl} downloadUrl={downloadUrl} />
        </div>
        <button
          className="md:hidden p-2 focus-visible:ring"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {(title || subtitle) && (
        <div className="text-center py-6 px-4">
          {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={items}
        actions={{ githubUrl, downloadUrl }}
      />
    </header>
  );
};

export default Header;
