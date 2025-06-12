import { describe, it, expect } from 'vitest';
import { parseAllSummaryBlocks } from '../fileParser';

describe('parseAllSummaryBlocks', () => {
  it('parses multiple summary blocks', () => {
    const content = `Block one\n📂 Nombre de fichier(s) restant(s) : 1\n➡️ Le dossier au numeroTélédémarche: AUTO-A est déposé\n➡️ Nom de projet : TRA - X - One - v1\n➡️ Numero dossier : D1\n➡️ Date de dépot : 2024-01-01\n---\nBlock two\n📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-B est déposé\n➡️ Nom de projet : TRA - Y - Two - v2\n➡️ Numero dossier : D2\n➡️ Date de dépot : 2024-02-02`;
    const result = parseAllSummaryBlocks(content);
    expect(result.length).toBe(2);
    expect(result[0].numero_teledemarche).toBe('A');
    expect(result[1].numero_teledemarche).toBe('B');
  });
});
