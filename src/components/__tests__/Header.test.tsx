import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';

const commonProps = {
  githubUrl: 'https://example.com/repo',
  downloadUrl: 'https://example.com/archive.zip',
  items: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'docs', label: 'Docs', href: '#docs' },
  ],
};

describe('Header', () => {
  it('renders title, subtitle and navigation items', () => {
    render(<Header title="Title" subtitle="Subtitle" {...commonProps} />);
    expect(screen.getByRole('heading', { name: 'Title', level: 1 })).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Home' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Docs' })).toBeTruthy();
  });

  it('opens and closes mobile menu', async () => {
    render(<Header {...commonProps} />);
    const btn = screen.getByLabelText('Open menu');
    fireEvent.click(btn);
    expect(await screen.findByText('Navigation')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Close menu'));
    await waitFor(() => {
      expect(screen.queryByText('Navigation')).toBeNull();
    });
  });

  it('renders default navigation links in both desktop and mobile menus', async () => {
    render(<Header githubUrl="https://example.com/repo" downloadUrl="https://example.com/archive.zip" />);

    // Desktop navigation contains default links
    expect(screen.getAllByRole('link', { name: 'Accueil' })).toHaveLength(1);

    // Open mobile menu and expect the same default link to appear there as well
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(await screen.findByText('Navigation')).toBeTruthy();
    const accueilLinks = await screen.findAllByRole('link', { name: 'Accueil' });
    expect(accueilLinks).toHaveLength(2);
  });
});
