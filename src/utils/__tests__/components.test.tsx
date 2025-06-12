import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from '../../components/FileUpload';
import { ResultCard } from '../../components/ResultCard';
import { ResultsGrid } from '../../components/ResultsGrid';
import { ProcessingStatsComponent } from '../../components/ProcessingStats';

// Mock notifications hook used by FileUpload and App
vi.mock('../../components/NotificationContext', () => ({
  useNotifications: () => ({
    warnings: [],
    addWarning: vi.fn(),
    clearWarnings: vi.fn(),
  }),
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const createFile = (name: string) => new File(['dummy'], name, { type: 'text/plain' });

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
    const dropZone = screen.getByText(/Upload Postman Runner Files/i).parentElement!.parentElement! as HTMLElement;
    fireEvent.drop(dropZone, { dataTransfer: { files: fileList } });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('triggers onFilesSelected from input', () => {
    const handler = vi.fn();
    const file = createFile('test.txt');
    const fileList = createFileList([file]);
    render(<FileUpload onFilesSelected={handler} isProcessing={false} />);
    const input = screen.getByLabelText(/choose files/i) as HTMLInputElement;
    fireEvent.change(input, { target: { files: fileList } });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('ResultCard', () => {
  const data = {
    nombre_fichiers_restants: 1,
    numero_teledemarche: 'T',
    nom_projet: 'Project',
    numero_dossier: 'D',
    date_depot: '2024-01-01',
  };

  it('displays success information', () => {
    render(<ResultCard file={{ id: '1', filename: 'file.txt', status: 'success', data }} />);
    expect(screen.getByText('file.txt')).toBeTruthy();
    expect(screen.getByText(/Download JSON/)).toBeTruthy();
    expect(screen.getByText('Project')).toBeTruthy();
  });

  it('shows error message', () => {
    render(<ResultCard file={{ id: '2', filename: 'bad.txt', status: 'error', error: 'oops' }} />);
    expect(screen.getByText(/Processing Error/)).toBeTruthy();
    expect(screen.getByText('oops')).toBeTruthy();
  });

  it('indicates processing state', () => {
    render(<ResultCard file={{ id: '3', filename: 'proc.txt', status: 'processing' }} />);
    expect(screen.getByText(/Processing file/)).toBeTruthy();
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
      <ProcessingStatsComponent stats={{ total: 0, processed: 0, successful: 0, failed: 0 }} onClearResults={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('displays stats and handles clearing', () => {
    const onClear = vi.fn();
    render(
      <ProcessingStatsComponent
        stats={{ total: 2, processed: 1, successful: 1, failed: 1 }}
        onClearResults={onClear}
      />
    );
    expect(screen.getByText('Processing Summary')).toBeTruthy();
    fireEvent.click(screen.getByText(/Clear Results/));
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
    const input = screen.getByLabelText(/choose files/i) as HTMLInputElement;
    const file = createFile('test.txt');
    const fileList = createFileList([file]);
    fireEvent.change(input, { target: { files: fileList } });
    expect(processFiles).toHaveBeenCalled();
  });
});
