import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../FileUpload';
import { NotificationProvider } from '../NotificationContext';
import { FileValidationService } from '../../services/FileValidationService';
import type { INotificationService, WarningListener } from '../../services/NotificationService';

const createFile = (name: string): File => new File(['dummy'], name, { type: 'text/plain' });

const createFileList = (files: File[]): FileList => {
  return {
    length: files.length,
    item: (i: number) => files[i],
    ...files,
  } as unknown as FileList;
};

const createMockService = (): INotificationService => {
  let warnings: string[] = [];
  let listeners: WarningListener[] = [];
  return {
    addWarning(w: string) {
      warnings.push(w);
      listeners.forEach((l) => l([...warnings]));
    },
    clearWarnings() {
      warnings = [];
      listeners.forEach((l) => l([...warnings]));
    },
    getWarnings() {
      return [...warnings];
    },
    subscribe(listener: WarningListener) {
      listeners.push(listener);
      listener([...warnings]);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
};

describe('FileUpload handleFilesSelected catch', () => {
  it('displays error message when validation throws', () => {
    const service = createMockService();
    const onFilesSelected = vi.fn();
    const fileList = createFileList([createFile('err.txt')]);

    vi.spyOn(FileValidationService.prototype, 'validateFiles').mockImplementation(() => {
      throw new Error('boom');
    });

    render(
      <NotificationProvider service={service}>
        <FileUpload onFilesSelected={onFilesSelected} isProcessing={false} />
      </NotificationProvider>,
    );

    const input = screen.getByLabelText(/choisir des fichiers/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: fileList } });

    expect(onFilesSelected).not.toHaveBeenCalled();
    expect(screen.getByText(/boom/)).toBeTruthy();

    vi.restoreAllMocks();
  });
});
