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
    expect(anchor.download).toBe('un_safe_name_.json');
    expect(document.body.contains(anchor)).toBe(false);

    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
