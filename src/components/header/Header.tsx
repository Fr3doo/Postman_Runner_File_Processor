import React from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  className?: string;
  githubUrl?: string;
  downloadUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  className = '',
  githubUrl = 'https://github.com/Fr3doo/Postman_Runner_File_Processor',
  downloadUrl = '#',
}) => {
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
          <Navigation className="flex-1 justify-center mx-8" />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <UserActions {...actions} />
            <MobileMenu actions={actions} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
