import { describe, it, expect } from 'vitest';
import { generateJSONContent, sanitizeFileData } from '../fileParser';
import type { FileData } from '../../types';

describe('generateJSONContent', () => {
  it('sanitizes fields with odd characters and lengths', () => {
    const data: FileData = {
      nombre_fichiers_restants: 10,
      numero_teledemarche: 'TE-LE-123!@#',
      nom_projet: 'A'.repeat(210),
      numero_dossier: 'D123-ABC*!',
      date_depot: '2024-05-01' + '!'.repeat(60),
    };

    const json = generateJSONContent(sanitizeFileData(data));
    const result = JSON.parse(json);

    expect(result).toEqual({
      nombre_fichiers_restants: 10,
      numero_teledemarche: 'TELE123',
      nom_projet: 'A'.repeat(200),
      numero_dossier: 'D123ABC',
      date_depot: ('2024-05-01' + '!'.repeat(60)).substring(0, 50),
    });
  });
});
