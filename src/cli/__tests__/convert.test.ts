import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { mkdtemp, rm } from 'fs/promises';
import { convertFile } from '../convert';

const sample = `📂 Nombre de fichier(s) restant(s) : 0\n➡️ Le dossier au numeroTélédémarche: AUTO-TEST123 est déposé\n➡️ Nom de projet : TRA - CODE - Example Project - v1.0\n➡️ Numero dossier : D123ABC\n➡️ Date de dépot : 2024-05-01`;

describe('convertFile', () => {
  it('writes JSON output for a valid txt file', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'convert-test-'));
    const orig = process.cwd();
    try {
      process.chdir(dir);
      const txt = join(dir, 'input.txt');
      await fs.writeFile(txt, sample, 'utf8');
      await convertFile('input.txt');
      const jsonPath = join(dir, 'input.json');
      const json = await fs.readFile(jsonPath, 'utf8');
      const data = JSON.parse(json);
      expect(data).toEqual({
        nombre_fichiers_restants: 0,
        numero_teledemarche: 'TEST123',
        nom_projet: 'TRA - CODE - Example Project - v1.0',
        numero_dossier: '123ABC',
        date_depot: '2024-05-01',
      });
    } finally {
      process.chdir(orig);
      await rm(dir, { recursive: true, force: true });
    }
  });
});
