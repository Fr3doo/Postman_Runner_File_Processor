import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Title');
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
  });

  it('opens and closes mobile menu', () => {
    render(<Header {...commonProps} />);
    const btn = screen.getByLabelText('Open menu');
    fireEvent.click(btn);
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-hidden')).toBe('false');
    fireEvent.click(screen.getByLabelText('Close menu'));
    expect(dialog.getAttribute('aria-hidden')).toBe('true');
  });
});
