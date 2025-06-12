import { describe, it, expect } from 'vitest';
import { parseFileContent } from '../fileParser';
import { ParsingError } from '../errors';

// Real file content from the user's file
const realFileContent = `'-----------------------------------------------------------------'
'🚀 [DEBUT TEST] : GET_TOKEN_DILA'
'   📌 Application en cours : DILA'
'   ✅ Token authToken_dila encore valide. Expire dans 42 min et 38 sec.'
'   ⏭️ Skip Request : La requête GetToken n'a PAS été exécutée (token encore valide).'
'✅ [FIN TEST] : GET_TOKEN_DILA'
'-----------------------------------------------------------------'
'📂 Nombre de fichier(s) restant(s) : 0'
'➡️ Le dossier au numeroTélédémarche: AUTO-YWSEVNW5 est déposé'
'➡️ Nom de projet : TRA - DICPE - Test Fred - v5'
'➡️ Numero dossier : D001726159'
'➡️ Date de dépot : 2025-06-11T12:00:00'
'-----------------------------------------------------------------'`;

const buildContent = (date: string): string =>
  `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 5\n➡️ Le dossier au numeroTélédémarche: AUTO-TEST123 est déposé\n➡️ Nom de projet : TRA - CODE - Example Project - v1.0\n➡️ Numero dossier : D123ABC\n➡️ Date de dépot : ${date}\n-----------------------------------------------------------------\nFooter`;

describe('parseFileContent', () => {
  it('parses real file content from user', () => {
    const data = parseFileContent(realFileContent);
    expect(data).toEqual({
      nombre_fichiers_restants: 0,
      numero_teledemarche: 'YWSEVNW5',
      nom_projet: 'TRA - DICPE - Test Fred - v5',
      numero_dossier: '001726159',
      date_depot: '2025-06-11T12:00:00',
    });
  });

  it('handles files with multiple summary blocks by using the last one', () => {
    const multipleBlocksContent = `
    First block:
    📂 Nombre de fichier(s) restant(s) : 5
    ➡️ Le dossier au numeroTélédémarche: AUTO-FIRST123 est déposé
    ➡️ Nom de projet : TRA - FIRST - Old Project - v1
    ➡️ Numero dossier : D111111
    ➡️ Date de dépot : 2024-01-01T10:00:00
    
    Some other content...
    
    Final block (this should be used):
    📂 Nombre de fichier(s) restant(s) : 0
    ➡️ Le dossier au numeroTélédémarche: AUTO-FINAL456 est déposé
    ➡️ Nom de projet : TRA - FINAL - New Project - v2
    ➡️ Numero dossier : D222222
    ➡️ Date de dépot : 2024-12-31T23:59:59
    `;

    const data = parseFileContent(multipleBlocksContent);
    expect(data).toEqual({
      nombre_fichiers_restants: 0,
      numero_teledemarche: 'FINAL456',
      nom_projet: 'TRA - FINAL - New Project - v2',
      numero_dossier: '222222',
      date_depot: '2024-12-31T23:59:59',
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
    expect(fn).toThrow(
      'Error parsing file content: Invalid project code format.',
    );
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

  it('handles télédémarche numbers with hyphens', () => {
    const content = `Header\n-----------------------------------------------------------------\n📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-CKK3-FQ- est déposé\n➡️ Nom de projet : TRA - DICPE - Test Fred - v4\n➡️ Numero dossier : D001726158\n➡️ Date de dépot : 2025-06-11T12:00:00\n-----------------------------------------------------------------\nFooter`;
    const data = parseFileContent(content);
    expect(data.numero_teledemarche).toBe('CKK3-FQ-');
  });
});
