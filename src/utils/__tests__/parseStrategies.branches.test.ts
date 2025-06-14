import { describe, it, expect, vi, afterEach } from 'vitest';
import { ParsingError } from '../errors';
import {
  defaultParseStrategy,
  extractTeledemarche,
  extractProjectName,
  extractDossierNumber,
} from '../parseStrategies';
import * as validator from '../securityValidator';

const summary = [
  '📂 Nombre de fichier(s) restant(s) : 1',
  'numeroTélédémarche: AUTO-TEST',
  '➡️ Nom de projet : TRA - CODE - Example - v1',
  '➡️ Numero dossier : D123',
  '➡️ Date de dépot : 2024-06-11',
].join('\n');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('defaultParseStrategy branches', () => {
  it('uses sanitized content when provided', () => {
    vi.spyOn(validator, 'validateAndSanitizeContent').mockReturnValue({
      sanitizedContent: summary,
    });
    const result = defaultParseStrategy('ignored');
    expect(result).toEqual([
      {
        nombre_fichiers_restants: 1,
        numero_teledemarche: 'TEST',
        nom_projet: 'TRA - CODE - Example - v1',
        numero_dossier: '123',
        date_depot: '2024-06-11',
      },
    ]);
  });

  it('parses when sanitizer returns no content', () => {
    vi.spyOn(validator, 'validateAndSanitizeContent').mockReturnValue({});
    const result = defaultParseStrategy(summary);
    expect(result[0].numero_teledemarche).toBe('TEST');
  });

  it('wraps unknown errors from helpers', () => {
    vi.spyOn(validator, 'validateAndSanitizeContent').mockReturnValue({
      sanitizedContent: summary,
    });
    const originalParseInt = global.parseInt;
    // @ts-expect-error -- override global parseInt for test
    global.parseInt = () => {
      throw 'boom';
    };
    try {
      expect(() => defaultParseStrategy('ignored')).toThrow(
        /Error parsing file content: Unknown parsing error/,
      );
    } finally {
      global.parseInt = originalParseInt;
    }
  });
});

describe('additional helper branches', () => {
  it('extractTeledemarche throws for invalid value', () => {
    const originalMatch = String.prototype.match;
    String.prototype.match = function (pattern: RegExp) {
      if (pattern.source === 'AUTO-([A-Z0-9-]+)') {
        return ['AUTO-***', '***'] as unknown as RegExpMatchArray;
      }
      return originalMatch.call(this, pattern);
    };
    try {
      expect(() =>
        extractTeledemarche('➡️ numeroTélédémarche: AUTO-***'),
      ).toThrow(ParsingError);
    } finally {
      String.prototype.match = originalMatch;
    }
  });

  it('extractTeledemarche returns undefined without AUTO prefix', () => {
    const line = '➡️ numeroTélédémarche: TEST';
    expect(extractTeledemarche(line)).toBeUndefined();
  });

  it('extractProjectName throws when sanitized name empty', () => {
    const originalTrim = String.prototype.trim;
    String.prototype.trim = function () {
      if (this === '__') return '';
      // @ts-expect-error -- call original with dynamic this
      return originalTrim.call(this);
    };
    try {
      const line = '➡️ Nom de projet : TRA - CODE - <> - v1';
      expect(() => extractProjectName(line)).toThrow(ParsingError);
    } finally {
      String.prototype.trim = originalTrim;
    }
  });

  it('extractProjectName throws for invalid version', () => {
    const line = '➡️ Nom de projet : TRA - CODE - Example - v1..1';
    expect(() => extractProjectName(line)).toThrow(ParsingError);
  });

  it('extractProjectName returns undefined when no project found', () => {
    const line = '➡️ Nom de projet : Example only';
    expect(extractProjectName(line)).toBeUndefined();
  });

  it('extractProjectName returns undefined without colon', () => {
    const line = '➡️ Nom de projet missing';
    expect(extractProjectName(line)).toBeUndefined();
  });

  it('extractDossierNumber throws for invalid match result', () => {
    const originalMatch = String.prototype.match;
    String.prototype.match = function () {
      return ['D!@#', '!@#'] as unknown as RegExpMatchArray;
    };
    try {
      expect(() => extractDossierNumber('➡️ Numero dossier : D!@#')).toThrow(
        ParsingError,
      );
    } finally {
      String.prototype.match = originalMatch;
    }
  });

  it('extractDossierNumber returns undefined when no match', () => {
    const line = '➡️ Numero dossier : ';
    expect(extractDossierNumber(line)).toBeUndefined();
  });
});
