import { describe, it, expect } from 'vitest';
import { parseFileContent } from '../fileParser';
import { ParsingError } from '../errors';

const validContent = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-YWSEVNW5 est déposé\n➡️ Nom de projet : TRA - DICPE - Test Fred - v5\n➡️ Numero dossier : D001726159\n➡️ Date de dépot : 2025-06-11T12:00:00\n-----------------------------------------------------------------\nFooter`;

const buildContent = (date: string): string =>
  `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 5\n➡️ Le dossier au numeroTélédémarche: AUTO-TEST123 est déposé\n➡️ Nom de projet : TRA - CODE - Example Project - v1.0\n➡️ Numero dossier : D123ABC\n➡️ Date de dépot : ${date}\n-----------------------------------------------------------------\nFooter`;

describe('parseFileContent', () => {
  it('parses valid file content with new format', () => {
    const data = parseFileContent(validContent);
    expect(data).toEqual({
      nombre_fichiers_restants: 0,
      numero_teledemarche: 'YWSEVNW5',
      nom_projet: 'TRA - DICPE - Test Fred - v5',
      numero_dossier: '001726159',
      date_depot: '2025-06-11T12:00:00',
    });
  });

  it('throws when required fields are missing', () => {
    const invalidContent = `\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 1\n-----------------------------------------------------------------`;
    expect(() => parseFileContent(invalidContent)).toThrow(ParsingError);
  });

  it('parses alternate date formats', () => {
    const data = parseFileContent(buildContent('01/05/2024'));
    expect(data.date_depot).toBe('01/05/2024');
  });

  it('parses ISO date format', () => {
    const data = parseFileContent(buildContent('2025-06-11T12:00:00'));
    expect(data.date_depot).toBe('2025-06-11T12:00:00');
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
    const invalid = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 5\n➡️ Le dossier au numeroTélédémarche: AUTO-TEST123 est déposé\n➡️ Nom de projet : TRA - badCode - Example Project - v1.0\n➡️ Numero dossier : D123ABC\n➡️ Date de dépot : 2024-05-01\n-----------------------------------------------------------------\nFooter`;
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
    const invalid = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : -1\n➡️ Le dossier au numeroTélédémarche: AUTO-TEST123 est déposé\n➡️ Nom de projet : TRA - CODE - Example Project - v1.0\n➡️ Numero dossier : D123ABC\n➡️ Date de dépot : 2024-05-01\n-----------------------------------------------------------------\nFooter`;
    const fn = () => parseFileContent(invalid);
    expect(fn).toThrow(ParsingError);
    expect(fn).toThrow('Missing required fields: nombre_fichiers_restants');
  });

  it('handles single digit version numbers', () => {
    const content = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-YWSEVNW5 est déposé\n➡️ Nom de projet : TRA - DICPE - Test Fred - v5\n➡️ Numero dossier : D001726159\n➡️ Date de dépot : 2025-06-11T12:00:00\n-----------------------------------------------------------------\nFooter`;
    const data = parseFileContent(content);
    expect(data.nom_projet).toBe('TRA - DICPE - Test Fred - v5');
  });

  it('handles numeric dossier numbers with leading zeros', () => {
    const content = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-YWSEVNW5 est déposé\n➡️ Nom de projet : TRA - DICPE - Test Fred - v5\n➡️ Numero dossier : D001726159\n➡️ Date de dépot : 2025-06-11T12:00:00\n-----------------------------------------------------------------\nFooter`;
    const data = parseFileContent(content);
    expect(data.numero_dossier).toBe('001726159');
  });
});