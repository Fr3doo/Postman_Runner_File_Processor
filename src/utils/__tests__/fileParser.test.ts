import { describe, it, expect } from 'vitest';
import { parseFileContent } from '../fileParser';
import { ParsingError } from '../errors';

const validContent = `Header\n----------\nNombre de fichier(s) restant(s) : 5\nnumeroT\u00E9l\u00E9d\u00E9marche : AUTO-TEST123\nNom de projet : TRA - CODE - Example Project - v1.0\nNumero dossier : D123ABC\nDate de d\u00E9pot : 2024-05-01\n----------\nFooter`;

const buildContent = (date: string): string =>
  `Header\n----------\nNombre de fichier(s) restant(s) : 5\nnumeroT\u00E9l\u00E9d\u00E9marche : AUTO-TEST123\nNom de projet : TRA - CODE - Example Project - v1.0\nNumero dossier : D123ABC\nDate de d\u00E9pot : ${date}\n----------\nFooter`;

describe('parseFileContent', () => {
  it('parses valid file content', () => {
    const data = parseFileContent(validContent);
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
    expect(() => parseFileContent(invalidContent)).toThrow(ParsingError);
  });

  it('parses alternate date formats', () => {
    const data = parseFileContent(buildContent('01/05/2024'));
    expect(data.date_depot).toBe('01052024');
  });

  it('throws for empty date', () => {
    const invalid = buildContent('');
    expect(() => parseFileContent(invalid)).toThrow(ParsingError);
  });

  it('throws for date without digits', () => {
    const invalid = buildContent('n/a');
    expect(() => parseFileContent(invalid)).toThrow(ParsingError);
  });

  it('throws for excessively long date strings', () => {
    const longDate = '1'.repeat(60);
    const invalid = buildContent(longDate);
    expect(() => parseFileContent(invalid)).toThrow(ParsingError);
  });

  it('throws for invalid project code', () => {
    const invalid = `Header\n----------\nNombre de fichier(s) restant(s) : 5\nnumeroT\u00E9l\u00E9d\u00E9marche : AUTO-TEST123\nNom de projet : TRA - badCode - Example Project - v1.0\nNumero dossier : D123ABC\nDate de d\u00E9pot : 2024-05-01\n----------\nFooter`;
    const fn = () => parseFileContent(invalid);
    expect(fn).toThrow(ParsingError);
    expect(fn).toThrow('Error parsing file content: Invalid project code format.');
  });

  it('throws for unsupported date format', () => {
    const invalid = buildContent('<>');
    const fn = () => parseFileContent(invalid);
    expect(fn).toThrow(ParsingError);
    expect(fn).toThrow('Error parsing file content: Invalid date format.');
  });

  it('throws for negative remaining files count', () => {
    const invalid = `Header\n----------\nNombre de fichier(s) restant(s) : -1\nnumeroT\u00E9l\u00E9d\u00E9marche : AUTO-TEST123\nNom de projet : TRA - CODE - Example Project - v1.0\nNumero dossier : D123ABC\nDate de d\u00E9pot : 2024-05-01\n----------\nFooter`;
    const fn = () => parseFileContent(invalid);
    expect(fn).toThrow(ParsingError);
    expect(fn).toThrow('Missing required fields: nombre_fichiers_restants');
  });
});
