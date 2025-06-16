import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { MobileMenu } from './MobileMenu';
import type { NavItem } from './Navigation';
import { DEFAULT_NAV_ITEMS } from './defaultNavItems';

interface HeaderProps {
  className?: string;
  githubUrl?: string;
  downloadUrl?: string;
  items?: NavItem[];
}

export const Header: React.FC<HeaderProps> = ({
  className = '',
  githubUrl = 'https://github.com/Fr3doo/Postman_Runner_File_Processor',
  downloadUrl = '#',
  items = DEFAULT_NAV_ITEMS,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const actions = { githubUrl, downloadUrl };

  return (
    <header className={`
      sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200
      shadow-sm transition-all duration-200 ${className}
    `}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Logo />

          {/* Navigation - Hidden on mobile */}
          <Navigation items={items} className="hidden md:flex flex-1 justify-center mx-8" />

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
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
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          items={items}
          actions={actions}
        />
      </div>
    </header>
  );
};

export default Header;
