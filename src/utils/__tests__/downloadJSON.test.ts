import { describe, it, expect, vi } from 'vitest';
import { downloadJSON } from '../fileParser';
import type { FileData } from '../../types';

describe('downloadJSON', () => {
  it('creates sanitized download link and removes it after click', () => {
    const data: FileData = {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'T123',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-05-01',
    };

    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: () => 'blob:url',
    });
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => 'blob:url');
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn(),
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadJSON(data, 'un*safe<name>.txt');

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(anchor);
    expect(removeChildSpy).toHaveBeenCalledWith(anchor);
    expect(document.body.contains(anchor)).toBe(false);
    expect(anchor.download).toBe('un_safe_name_.json');

    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('throws when Blob construction fails', () => {
    const data: FileData = {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'T123',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-05-01',
    };

    const originalBlob = global.Blob;
    class FailingBlob {
      constructor() {
        throw new Error('blob fail');
      }
    }
    // @ts-expect-error override constructor for test
    global.Blob = FailingBlob as unknown as typeof Blob;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => downloadJSON(data, 'f.txt')).toThrow(
      'Failed to download JSON file. Please try again.',
    );
    errorSpy.mockRestore();
    global.Blob = originalBlob;
  });

  it('throws when createElement fails', () => {
    const data: FileData = {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'T123',
      nom_projet: 'Project',
      numero_dossier: 'D1',
      date_depot: '2024-05-01',
    };

    const originalCreate = document.createElement;
    document.createElement = vi.fn(() => {
      throw new Error('dom fail');
    }) as unknown as typeof document.createElement;

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => downloadJSON(data, 'f.txt')).toThrow(
      'Failed to download JSON file. Please try again.',
    );
    errorSpy.mockRestore();
    document.createElement = originalCreate;
  });
});
