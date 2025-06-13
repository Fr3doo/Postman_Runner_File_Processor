import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { main } from '../convert';

let cwd: string;
let tempDir: string;

beforeEach(async () => {
  cwd = process.cwd();
  tempDir = await fs.mkdtemp(join(tmpdir(), 'cli-test-'));
  process.chdir(tempDir);
  process.exitCode = undefined;
});

afterEach(async () => {
  process.chdir(cwd);
  await fs.rm(tempDir, { recursive: true, force: true });
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe('main', () => {
  it('processes existing file and logs success', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const content = `Block one\n📂 Nombre de fichier(s) restant(s) : 1\n➡️ Le dossier au numeroTélédémarche: AUTO-A est déposé\n➡️ Nom de projet : TRA - X - One - v1\n➡️ Numero dossier : D1\n➡️ Date de dépot : 2024-01-01`;
    await fs.writeFile('input.txt', content, 'utf8');

    await main(['input.txt']);

    expect(logSpy).toHaveBeenCalledWith('Converted input.txt');
    const out = await fs.readFile('input.json', 'utf8');
    expect(JSON.parse(out)).toEqual({
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'A',
      nom_projet: 'TRA - X - One - v1',
      numero_dossier: '1',
      date_depot: '2024-01-01',
    });
  });
});
