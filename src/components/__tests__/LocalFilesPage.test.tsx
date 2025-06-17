import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocalFilesPage } from '../pages/LocalFilesPage';
import type { LocalFileServiceClass } from '../../services/LocalFileService';

const createService = (initial: string[]): LocalFileServiceClass => {
  let files = [...initial];
  return {
    listJSONFiles: vi.fn(async () => [...files]),
    deleteFile: vi.fn(async (name: string) => {
      files = files.filter((f) => f !== name);
    }),
    downloadFile: vi.fn(async () => ''),
  } as LocalFileServiceClass;
};

describe('LocalFilesPage', () => {
  it('lists files and handles download and delete', async () => {
    const service = createService(['a.json']);
    render(<LocalFilesPage service={service} />);

    await waitFor(() => {
      expect(screen.getByText('a.json')).toBeTruthy();
    });

    fireEvent.click(screen.getByTitle('download'));
    expect(service.downloadFile).toHaveBeenCalledWith('a.json');

    fireEvent.click(screen.getByTitle('delete'));
    expect(service.deleteFile).toHaveBeenCalledWith('a.json');

    await waitFor(() => {
      expect(screen.queryByText('a.json')).toBeNull();
    });
  });

  it('shows empty message when no files', async () => {
    const service = createService([]);
    render(<LocalFilesPage service={service} />);
    await waitFor(() => {
      expect(screen.getByText(/Aucun fichier/)).toBeTruthy();
    });
  });
});
