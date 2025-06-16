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
  it('renders title, subtitle and custom navigation items in both menus', async () => {
    render(<Header title="Title" subtitle="Subtitle" {...commonProps} />);

    // Title and subtitle
    expect(screen.getByRole('heading', { name: 'Title', level: 1 })).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();

    // Custom navigation in desktop menu
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Docs' })).toHaveLength(1);

    // Custom navigation should appear in mobile menu as well
    fireEvent.click(screen.getByLabelText('Open menu'));
    await screen.findByRole('dialog');
    expect(screen.getAllByRole('link', { name: 'Home' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: 'Docs' })).toHaveLength(2);
  });

  it('opens and closes mobile menu', async () => {
    render(<Header {...commonProps} />);

    fireEvent.click(screen.getByLabelText('Open menu'));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('uses provided URLs for user actions', async () => {
    render(<Header {...commonProps} />);

    // Desktop actions
    const [githubLink, downloadLink] = [
      screen.getByRole('link', { name: 'GitHub' }),
      screen.getByRole('link', { name: 'Télécharger' }),
    ];
    expect(githubLink.getAttribute('href')).toBe(commonProps.githubUrl);
    expect(downloadLink.getAttribute('href')).toBe(commonProps.downloadUrl);

    // Mobile actions should use the same URLs
    fireEvent.click(screen.getByLabelText('Open menu'));
    const githubLinks = await screen.findAllByRole('link', { name: 'GitHub' });
    const downloadLinks = await screen.findAllByRole('link', { name: 'Télécharger' });
    expect(githubLinks[1].getAttribute('href')).toBe(commonProps.githubUrl);
    expect(downloadLinks[1].getAttribute('href')).toBe(commonProps.downloadUrl);
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
