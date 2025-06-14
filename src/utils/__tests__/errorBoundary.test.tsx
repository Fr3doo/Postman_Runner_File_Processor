import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import type { ErrorHandler } from '../../services/ErrorHandler';
import type { ILoggingService } from '../../services/LoggingService';

const Problem: React.FC = () => {
  throw new Error('<bad>');
};

describe('ErrorBoundary', () => {
  it('logs and displays sanitised error messages', () => {
    const handle = vi.fn(() => 'clean');
    const logging: ILoggingService = {
      logInfo: vi.fn(),
      logError: vi.fn(),
      getLogs: vi.fn(() => []),
      clear: vi.fn(),
      load: vi.fn(),
      save: vi.fn(),
      exportLogs: vi.fn(() => ''),
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary
        errorHandler={{ handle } as unknown as ErrorHandler}
        loggingService={logging}
      >
        <Problem />
      </ErrorBoundary>,
    );

    expect(handle).toHaveBeenCalled();
    expect(logging.logError).toHaveBeenCalledWith('clean');
    expect(screen.getByText('clean')).toBeTruthy();

    (console.error as unknown as vi.Mock).mockRestore();
  });

  it('renders fallback element when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>fallback ui</div>}>
        <Problem />
      </ErrorBoundary>,
    );

    expect(screen.getByText('fallback ui')).toBeTruthy();
    expect(
      screen.queryByText(/Une erreur est survenue\./i),
    ).toBeNull();

    (console.error as unknown as vi.Mock).mockRestore();
  });
});
