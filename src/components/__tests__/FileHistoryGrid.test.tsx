import React from 'react';
import {
  render,
  fireEvent,
  screen,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileHistoryProvider } from '../FileHistoryContext';
import { FileHistoryGrid } from '../FileHistoryGrid';
import type { FileData, ProcessedFile } from '../../types';
import type { IFileHistoryService } from '../../services/FileHistoryService';
import { FileParserService } from '../../services/FileParserService';

const createFile = (id: string): ProcessedFile => ({
  id,
  filename: `${id}.txt`,
  status: 'success',
  summaries: [
    {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'TD',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-01-01',
    } as FileData,
  ],
});

const createMockService = (initial: ProcessedFile[]): IFileHistoryService => {
  let history = [...initial];
  let listeners: ((h: ProcessedFile[]) => void)[] = [];
  const notify = () => listeners.forEach((l) => l([...history]));
  return {
    addFile: vi.fn((f: ProcessedFile) => {
      history.unshift(f);
      notify();
    }),
    getHistory: () => [...history],
    removeFile: vi.fn((id: string) => {
      history = history.filter((f) => f.id !== id);
      notify();
    }),
    clearHistory: vi.fn(() => {
      history = [];
      notify();
    }),
    load: vi.fn(() => {
      notify();
    }),
    save: vi.fn(),
    subscribe: (listener: (h: ProcessedFile[]) => void) => {
      listeners.push(listener);
      listener([...history]);
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
  };
};

describe('FileHistoryGrid', () => {
  it('renders info message when history is empty', () => {
    const service = createMockService([]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    render(<FileHistoryGrid />, { wrapper });
    expect(screen.getByText("Aucun fichier dans l'historique.")).toBeTruthy();
  });

  it('shows empty state when service initially has no items', () => {
    const service = createMockService([]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );

    render(<FileHistoryGrid />, { wrapper });

    expect(screen.getByText("Aucun fichier dans l'historique.")).toBeTruthy();
    expect((service.load as vi.Mock).mock.calls.length).toBe(1);
  });

  it('downloads and removes file from history', () => {
    const file = createFile('a');
    const service = createMockService([file]);
    const parser = new FileParserService();
    const downloadSpy = vi
      .spyOn(parser, 'download')
      .mockImplementation(() => {});

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );

    render(<FileHistoryGrid parser={parser} />, { wrapper });

    fireEvent.click(screen.getByText(/Télécharger à nouveau/));
    expect(downloadSpy).toHaveBeenCalledWith(file.summaries![0], 'a-1');

    fireEvent.click(screen.getByText('Supprimer'));
    expect(service.removeFile).toHaveBeenCalledWith('a');
  });

  it('clears history', () => {
    const service = createMockService([createFile('x')]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    render(<FileHistoryGrid />, { wrapper });
    fireEvent.click(screen.getByText("Effacer l'historique"));
    expect(service.clearHistory).toHaveBeenCalled();
  });

  it("displays error icon, badge and message when file status is 'error'", () => {
    const file: ProcessedFile = {
      id: 'err',
      filename: 'err.txt',
      status: 'error',
      error: 'boom',
    };
    const service = createMockService([file]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    const { container } = render(<FileHistoryGrid />, { wrapper });

    expect(screen.getByText('⛔️ Erreur')).toBeTruthy();
    expect(container.querySelector('svg.text-red-500')).toBeTruthy();
    expect(screen.getByText('Erreur de traitement')).toBeTruthy();
    expect(screen.getByText('boom')).toBeTruthy();
  });

  it("displays processing icon and badge when file status is 'processing'", () => {
    const file: ProcessedFile = {
      id: 'proc',
      filename: 'proc.txt',
      status: 'processing',
    };
    const service = createMockService([file]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    const { container } = render(<FileHistoryGrid />, { wrapper });

    expect(screen.getByText('🔄 Traitement')).toBeTruthy();
    expect(container.querySelector('svg.text-blue-500')).toBeTruthy();
  });

  it('updates grid when history changes via the service', async () => {
    const service = createMockService([]);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    render(<FileHistoryGrid />, { wrapper });
    expect(screen.getByText("Aucun fichier dans l'historique.")).toBeTruthy();

    act(() => {
      service.addFile(createFile('new'));
    });

    await waitFor(() => {
      expect(screen.getByText('new.txt')).toBeTruthy();
    });
    expect(screen.queryByText("Aucun fichier dans l'historique.")).toBeNull();
  });

  it('filters history by filename', () => {
    const files = [createFile('alpha'), createFile('beta')];
    const service = createMockService(files);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
    );
    render(<FileHistoryGrid />, { wrapper });

    expect(screen.getByText('alpha.txt')).toBeTruthy();
    expect(screen.getByText('beta.txt')).toBeTruthy();

    const input = screen.getByPlaceholderText('Filtrer par nom') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'alp' } });

    expect(screen.getByText('alpha.txt')).toBeTruthy();
    expect(screen.queryByText('beta.txt')).toBeNull();
  });

it('downloads all selected files', () => {
  const files = [createFile('a'), createFile('b')];
  const service = createMockService(files);
  const parser = new FileParserService();
  const spy = vi.spyOn(parser, 'download').mockImplementation(() => {});
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <FileHistoryProvider service={service}>{children}</FileHistoryProvider>
  );

  render(<FileHistoryGrid parser={parser} />, { wrapper });

  const checkboxes = screen.getAllByRole('checkbox');
  const dlButton = screen.getByText('Télécharger la sélection') as HTMLButtonElement;
  
  // Initially disabled
  expect(dlButton.disabled).toBe(true);

  // Select files
  fireEvent.click(checkboxes[0]);
  fireEvent.click(checkboxes[1]);

  // Should be enabled after selection
  expect(dlButton.disabled).toBe(false);
  fireEvent.click(dlButton);

  // Verify downloads were called
  expect(spy).toHaveBeenCalledWith(files[0].summaries![0], 'a-1');
  expect(spy).toHaveBeenCalledWith(files[1].summaries![0], 'b-1');
  expect(spy).toHaveBeenCalledTimes(2);
});
});
