import { describe, it, expect } from 'vitest';
import { parseFileContent } from '../fileParser';

const validContent = `Header\n----------\nNombre de fichier(s) restant(s) : 5\nnumeroT\u00E9l\u00E9d\u00E9marche : AUTO-TEST123\nNom de projet : TRA - CODE - Example Project - v1.0\nNumero dossier : D123ABC\nDate de d\u00E9pot : 2024-05-01\n----------\nFooter`;

describe('parseFileContent', () => {
  it('parses valid file content', () => {
    const data = parseFileContent(validContent, 'sample.txt');
    expect(data).toEqual({
      nombre_fichiers_restants: 5,
      numero_teledemarche: 'TEST123',
      nom_projet: 'TRA - CODE - Example Project - v1.0',
      numero_dossier: '123ABC',
      date_depot: '2024-05-01',
    });
  });

  it('throws when required fields are missing', () => {
    const invalidContent = `\n----------\nNombre de fichier(s) restant(s) : 1\n----------`;
    expect(() => parseFileContent(invalidContent, 'sample.txt')).toThrow();
  });
});
