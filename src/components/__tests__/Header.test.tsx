import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '../Header';

const commonProps = {
  githubUrl: 'https://example.com/repo',
  downloadUrl: 'https://example.com/archive.zip',
  items: [
    { label: 'Home', href: '#home' },
    { label: 'Docs', href: '#docs' },
  ],
};

describe('Header', () => {
  it('renders title, subtitle and navigation items', () => {
    render(<Header title="Title" subtitle="Subtitle" {...commonProps} />);
    expect(screen.getByRole('heading', { name: 'Title', level: 1 })).toBeTruthy();
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(screen.getAllByText('Accueil').length).toBeGreaterThan(0);
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
});
