import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileText } from 'lucide-react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders title and subtitle with default icons', () => {
    render(<Header title="Title" subtitle="Subtitle" />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Title');
    expect(screen.getByText('Subtitle')).toBeTruthy();
    expect(document.querySelectorAll('svg').length).toBe(2);
  });

  it('renders custom icons', () => {
    render(
      <Header
        title="Title"
        subtitle="Sub"
        leftIcon={<FileText data-testid="left" />}
        rightIcon={<FileText data-testid="right" />}
      />,
    );
    expect(screen.getByTestId('left')).toBeTruthy();
    expect(screen.getByTestId('right')).toBeTruthy();
  });
});
