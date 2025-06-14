import { describe, it, expect } from 'vitest';
import { parseSummaryLines } from '../parseStrategies';

const summaryLines = [
  '📂 Nombre de fichier(s) restant(s) : 1',
  'numeroTélédémarche: AUTO-TEST',
  '➡️ Nom de projet : TRA - CODE - Example - v1',
  '➡️ Numero dossier : D123',
  '➡️ Date de dépot : 2024-06-11',
];

describe('parseSummaryLines error mapping', () => {
  it('maps primitive throws from extractFileCount', () => {
    const helpers = {
      extractFileCount: () => {
        throw 'boom';
      },
    };
    expect(() => parseSummaryLines(summaryLines, helpers)).toThrow(
      /Error parsing file content: Unknown parsing error/
    );
  });
});
