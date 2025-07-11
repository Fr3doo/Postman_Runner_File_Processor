import React from 'react';
import { Home, FileText, FolderOpen, Settings, HelpCircle } from 'lucide-react';
import type { NavItem } from './Navigation';

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: React.createElement(Home, { size: 18 }),
    href: '#',
  },
  {
    id: 'files',
    label: 'Fichiers',
    icon: React.createElement(FileText, { size: 18 }),
    href: '#',
  },
  {
    id: 'local',
    label: 'Locaux',
    icon: React.createElement(FolderOpen, { size: 18 }),
    href: '#',
  },
  {
    id: 'settings',
    label: 'Param\u00e8tres',
    icon: React.createElement(Settings, { size: 18 }),
    href: '#',
  },
  {
    id: 'help',
    label: 'Aide',
    icon: React.createElement(HelpCircle, { size: 18 }),
    href: '#',
  },
];
