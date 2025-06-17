import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';
import { DEFAULT_NAV_ITEMS } from '../header/defaultNavItems';

const Wrapper: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'home' | 'files' | 'local'>('home');
  const items = DEFAULT_NAV_ITEMS.map((item) => ({
    ...item,
    active: currentView === item.id,
    onClick: () => setCurrentView(item.id as 'home' | 'files' | 'local'),
  }));
  return (
    <Header
      githubUrl="https://example.com/repo"
      downloadUrl="https://example.com/archive.zip"
      items={items}
    />
  );
};

describe('Header navigation', () => {
  it('updates active nav item on click', () => {
    render(<Wrapper />);
    const homeLink = screen.getByRole('link', { name: 'Accueil' });
    const filesLink = screen.getByRole('link', { name: 'Fichiers' });

    expect(homeLink.className).toContain('bg-blue-50');
    expect(filesLink.className).not.toContain('bg-blue-50');

    fireEvent.click(filesLink);

    expect(filesLink.className).toContain('bg-blue-50');
    expect(homeLink.className).not.toContain('bg-blue-50');
  });
});
