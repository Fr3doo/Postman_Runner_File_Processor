import { describe, it, expect } from 'vitest';
import {
  extractFileCount,
  extractTeledemarche,
  extractProjectName,
  extractDossierNumber,
  extractDateDepot,
} from '../parseStrategies';
import { ParsingError } from '../errors';

describe('extractFileCount', () => {
  it('parses a valid count', () => {
    const line = '📂 Nombre de fichier(s) restant(s) : 2';
    expect(extractFileCount(line)).toBe(2);
  });

  it('returns undefined for unrelated line', () => {
    expect(extractFileCount('foo')).toBeUndefined();
  });

  it('returns undefined for negative count', () => {
    const line = '📂 Nombre de fichier(s) restant(s) : -1';
    expect(extractFileCount(line)).toBeUndefined();
  });

  it('throws when count exceeds limit', () => {
    const line = '📂 Nombre de fichier(s) restant(s) : 1000000';
    expect(() => extractFileCount(line)).toThrow(ParsingError);
  });
});

describe('extractTeledemarche', () => {
  it('parses a valid number', () => {
    const line = '➡️ Le dossier au numeroTélédémarche: AUTO-CKK3-FQ- est déposé';
    expect(extractTeledemarche(line)).toBe('CKK3-FQ-');
  });

  it('returns undefined for unrelated line', () => {
    expect(extractTeledemarche('foo')).toBeUndefined();
  });

  it('ignores trailing invalid characters', () => {
    const line = '➡️ numeroTélédémarche: AUTO-INV!';
    expect(extractTeledemarche(line)).toBe('INV');
  });
});

describe('extractProjectName', () => {
  it('parses a full project line', () => {
    const line = '➡️ Nom de projet : TRA - CODE - My Project - v1.0';
    expect(extractProjectName(line)).toBe('TRA - CODE - My Project - v1.0');
  });

  it('sanitizes project name', () => {
    const line = '➡️ Nom de projet : TRA - CODE - Name<> - v1';
    expect(extractProjectName(line)).toBe('TRA - CODE - Name__ - v1');
  });

  it('throws for invalid code', () => {
    const line = '➡️ Nom de projet : TRA - bad - Example - v1';
    expect(() => extractProjectName(line)).toThrow(ParsingError);
  });

  it('uses fallback parsing when format is unexpected', () => {
    const line = '➡️ Nom de projet : Prefix TRA - CODE - Example - v1';
    expect(extractProjectName(line)).toBe('Prefix TRA - CODE - Example - v1');
  });

  it('throws for invalid code with missing version', () => {
    const line = '➡️ Nom de projet : TRA - bad - Example';
    expect(() => extractProjectName(line)).toThrow(ParsingError);
  });
});

describe('extractDossierNumber', () => {
  it('parses valid dossier number', () => {
    const line = '➡️ Numero dossier : D123ABC';
    expect(extractDossierNumber(line)).toBe('123ABC');
  });

  it('returns undefined for unrelated line', () => {
    expect(extractDossierNumber('foo')).toBeUndefined();
  });

  it('ignores trailing invalid characters', () => {
    const line = '➡️ Numero dossier : D123*';
    expect(extractDossierNumber(line)).toBe('123');
  });
});

describe('extractDateDepot', () => {
  it('parses valid date', () => {
    const line = '➡️ Date de dépot : 2025-06-11T12:00:00';
    expect(extractDateDepot(line)).toBe('2025-06-11T12:00:00');
  });

  it('returns undefined for unrelated line', () => {
    expect(extractDateDepot('bar')).toBeUndefined();
  });

  it('throws for invalid format', () => {
    const line = '➡️ Date de dépot : n/a';
    expect(() => extractDateDepot(line)).toThrow(ParsingError);
  });

  it('throws for excessively long date strings', () => {
    const longDate = '1'.repeat(60);
    const line = `➡️ Date de dépot : ${longDate}`;
    expect(() => extractDateDepot(line)).toThrow(ParsingError);
  });
});
