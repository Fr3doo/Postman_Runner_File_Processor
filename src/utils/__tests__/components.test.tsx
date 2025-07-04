import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../../components/FileUpload';
import { ResultCard } from '../../components/ResultCard';
import { ResultsGrid } from '../../components/ResultsGrid';
import { ProcessingStatsComponent } from '../../components/ProcessingStats';
import { SummaryDetails } from '../../components/SummaryDetails';
import { FileValidationService } from '../../services/FileValidationService';
import { ValidationError } from '../errors';

// Mock notifications hook used by FileUpload and App
vi.mock('../../components/NotificationContext', () => ({
  useNotifications: () => ({
    warnings: [],
    addWarning: vi.fn(),
    clearWarnings: vi.fn(),
  }),
  NotificationProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const createFile = (name: string) =>
  new File(['dummy'], name, { type: 'text/plain' });

const createFileList = (files: File[]): FileList => {
  return {
    length: files.length,
    item: (i: number) => files[i],
    ...files,
  } as unknown as FileList;
};

describe('FileUpload', () => {
  it('triggers onFilesSelected on drop', () => {
    const handler = vi.fn();
    const file = createFile('test.txt');
    const fileList = createFileList([file]);
    render(<FileUpload onFilesSelected={handler} isProcessing={false} />);
    const dropZone = screen.getByText(/Téléverser des fichiers Postman Runner/i)
      .parentElement!.parentElement! as HTMLElement;
    fireEvent.drop(dropZone, { dataTransfer: { files: fileList } });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('triggers onFilesSelected from input', () => {
    const handler = vi.fn();
    const file = createFile('test.txt');
    const fileList = createFileList([file]);
    render(<FileUpload onFilesSelected={handler} isProcessing={false} />);
    const input = screen.getByLabelText(
      /choisir des fichiers/i,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: fileList } });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('displays validation errors when validation fails', () => {
    const handler = vi.fn();
    const file = createFile('bad.exe');
    const fileList = createFileList([file]);
    vi.spyOn(
      FileValidationService.prototype,
      'validateFiles',
    ).mockImplementation(() => {
      throw new ValidationError('Invalid extension');
    });
    render(<FileUpload onFilesSelected={handler} isProcessing={false} />);
    const input = screen.getByLabelText(
      /choisir des fichiers/i,
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: fileList } });
    expect(handler).not.toHaveBeenCalled();
    expect(screen.getByText(/Invalid extension/)).toBeTruthy();
    vi.restoreAllMocks();
  });

  it('toggles drag state on drag events', () => {
    const handler = vi.fn();
    render(<FileUpload onFilesSelected={handler} isProcessing={false} />);
    const dropZone = screen
      .getByText(/Téléverser des fichiers Postman Runner/i)
      .parentElement!.parentElement!.parentElement! as HTMLElement;

    expect(dropZone.className).not.toContain('border-blue-500');
    expect(screen.queryByText(/Déposez les fichiers ici/i)).toBeNull();

    fireEvent.dragEnter(dropZone);
    expect(dropZone.className).toContain('border-blue-500');
    expect(screen.getByText(/Déposez les fichiers ici/i)).toBeTruthy();

    fireEvent.dragLeave(dropZone);
    expect(dropZone.className).not.toContain('border-blue-500');
    expect(screen.queryByText(/Déposez les fichiers ici/i)).toBeNull();

    fireEvent.dragOver(dropZone);
    expect(dropZone.className).not.toContain('border-blue-500');
  });
});

describe('SummaryDetails', () => {
  const summary = {
    nombre_fichiers_restants: 2,
    numero_teledemarche: 'TD',
    nom_projet: 'Proj',
    numero_dossier: 'D1',
    date_depot: '2024-01-01',
  };

  it('renders fields and triggers download', () => {
    const onDownload = vi.fn();
    render(
      <SummaryDetails
        summary={summary}
        onDownload={onDownload}
        downloadLabel="DL"
      />,
    );

    expect(screen.getByText('Proj')).toBeTruthy();
    expect(screen.getByText('AUTO-TD')).toBeTruthy();

    fireEvent.click(screen.getByText('DL'));
    expect(onDownload).toHaveBeenCalled();
  });
});

describe('ResultCard', () => {
  const base = {
    nombre_fichiers_restants: 1,
    numero_teledemarche: 'T',
    nom_projet: 'Project',
    numero_dossier: 'D',
    date_depot: '2024-01-01',
  };

  it('displays summary details for success status', () => {
    const summary1 = { ...base };
    const summary2 = {
      ...base,
      nom_projet: 'Project 2',
      numero_teledemarche: 'X',
      numero_dossier: 'Z',
      date_depot: '2024-02-01',
    };
    render(
      <ResultCard
        file={{
          id: '1',
          filename: 'file.txt',
          status: 'success',
          summaries: [summary1, summary2],
        }}
      />,
    );

    expect(screen.getByText('file.txt')).toBeTruthy();
    expect(screen.getByText('✅ Réussi')).toBeTruthy();
    expect(screen.getAllByText(/Télécharger le JSON/)).toHaveLength(2);
    expect(screen.getByText('Project')).toBeTruthy();
    expect(screen.getByText('Project 2')).toBeTruthy();
    expect(screen.getByText('AUTO-X')).toBeTruthy();
    expect(screen.getByText('DZ')).toBeTruthy();
    expect(screen.getByText('2024-02-01')).toBeTruthy();
  });

  it('shows error message', () => {
    render(
      <ResultCard
        file={{ id: '2', filename: 'bad.txt', status: 'error', error: 'oops' }}
      />,
    );
    expect(screen.getByText('⛔️ Erreur')).toBeTruthy();
    expect(screen.getByText(/Erreur de traitement/)).toBeTruthy();
    expect(screen.getByText('oops')).toBeTruthy();
    expect(screen.queryByText(/Télécharger le JSON/)).toBeNull();
  });

  it('indicates processing state', () => {
    render(
      <ResultCard
        file={{ id: '3', filename: 'proc.txt', status: 'processing' }}
      />,
    );
    expect(screen.getByText('🔄 Traitement')).toBeTruthy();
    expect(screen.getByText(/Traitement du fichier/)).toBeTruthy();
    expect(screen.queryByText(/Télécharger le JSON/)).toBeNull();
    expect(screen.queryByText(/Erreur de traitement/)).toBeNull();
  });

  it('renders no icon or badge for unknown status', () => {
    const { container } = render(
      <ResultCard
        file={{
          id: '4',
          filename: 'weird.txt',
          status: 'weird' as unknown as ProcessedFile['status'],
        }}
      />,
    );

    expect(container.querySelector('svg')).toBeNull();
    expect(screen.queryByText('✅ Réussi')).toBeNull();
    expect(screen.queryByText('⛔️ Erreur')).toBeNull();
    expect(screen.queryByText('🔄 Traitement')).toBeNull();
  });
});

describe('ResultsGrid', () => {
  it('renders nothing when empty', () => {
    const { container } = render(<ResultsGrid files={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a card for each file', () => {
    const files = [
      { id: '1', filename: 'a.txt', status: 'processing' },
      { id: '2', filename: 'b.txt', status: 'processing' },
    ];
    render(<ResultsGrid files={files} />);
    expect(screen.getByText('a.txt')).toBeTruthy();
    expect(screen.getByText('b.txt')).toBeTruthy();
  });
});

describe('ProcessingStatsComponent', () => {
  it('renders nothing when no stats', () => {
    const { container } = render(
      <ProcessingStatsComponent
        stats={{ total: 0, processed: 0, successful: 0, failed: 0 }}
        onClearResults={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays stats and handles clearing', () => {
    const onClear = vi.fn();
    render(
      <ProcessingStatsComponent
        stats={{ total: 2, processed: 1, successful: 1, failed: 1 }}
        onClearResults={onClear}
      />,
    );
    expect(screen.getByText('Résumé du traitement')).toBeTruthy();
    fireEvent.click(screen.getByText(/Effacer les résultats/));
    expect(onClear).toHaveBeenCalled();
  });
});

const processFiles = vi.fn();
const clearResults = vi.fn();
vi.mock('../../hooks/useFileProcessor', () => ({
  useFileProcessor: () => ({
    processedFiles: [],
    isProcessing: false,
    processFiles,
    clearResults,
    getStats: () => ({ total: 0, processed: 0, successful: 0, failed: 0 }),
  }),
}));

describe('App integration', () => {
  it('wires FileUpload to hook', async () => {
    const { default: App } = await import('../../App');
    render(<App />);
    const input = screen.getByLabelText(
      /choisir des fichiers/i,
    ) as HTMLInputElement;
    const file = createFile('test.txt');
    const fileList = createFileList([file]);
    fireEvent.change(input, { target: { files: fileList } });
    expect(processFiles).toHaveBeenCalled();
  });
});
