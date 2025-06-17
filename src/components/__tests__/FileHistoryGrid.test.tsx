import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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
    expect(
      screen.getByText("Aucun fichier dans l'historique.")
    ).toBeTruthy();
  });

  it('downloads and removes file from history', () => {
    const file = createFile('a');
    const service = createMockService([file]);
    const parser = new FileParserService();
    const downloadSpy = vi.spyOn(parser, 'download').mockImplementation(() => {});

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
});
