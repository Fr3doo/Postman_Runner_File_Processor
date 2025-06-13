import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { run } from '../convert';
import * as parser from '../../utils/fileParser';
import * as security from '../../utils/securityValidator';

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

describe('run', () => {
  it('sets exit code when no files provided', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await run([]);
    expect(process.exitCode).toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'Usage: ts-node src/cli/convert.ts <files...>',
    );
  });

  it('creates JSON file in working directory', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const sanitizeSpy = vi
      .spyOn(parser, 'sanitizeFileData')
      .mockImplementation((d) => d);

    const content = `Block one\n📂 Nombre de fichier(s) restant(s) : 1\n➡️ Le dossier au numeroTélédémarche: AUTO-A est déposé\n➡️ Nom de projet : TRA - X - One - v1\n➡️ Numero dossier : D1\n➡️ Date de dépot : 2024-01-01`;
    await fs.writeFile('input.txt', content, 'utf8');

    await run(['input.txt']);

    expect(sanitizeSpy).toHaveBeenCalled();

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

  it('creates multiple JSON files when multiple summaries found', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const sanitizeSpy = vi
      .spyOn(parser, 'sanitizeFileData')
      .mockImplementation((d) => d);
    const parseSpy = vi.spyOn(parser, 'parseAllSummaryBlocks').mockReturnValue([
      {
        nombre_fichiers_restants: 1,
        numero_teledemarche: 'A',
        nom_projet: 'P1',
        numero_dossier: '1',
        date_depot: '2024-01-01',
      },
      {
        nombre_fichiers_restants: 2,
        numero_teledemarche: 'B',
        nom_projet: 'P2',
        numero_dossier: '2',
        date_depot: '2024-02-02',
      },
    ]);

    await fs.writeFile('multi.txt', 'dummy', 'utf8');

    await run(['multi.txt']);

    expect(sanitizeSpy).toHaveBeenCalled();

    expect(parseSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Converted multi.txt');
    const files = await fs.readdir('.');
    expect(files).toContain('multi-1.json');
    expect(files).toContain('multi-2.json');
  });

  it('creates JSON files for each provided input', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const sanitizeSpy = vi
      .spyOn(parser, 'sanitizeFileData')
      .mockImplementation((d) => d);

    const content = `Block one\n📂 Nombre de fichier(s) restant(s) : 1\n➡️ Le dossier au numeroTélédémarche: AUTO-A est déposé\n➡️ Nom de projet : TRA - X - One - v1\n➡️ Numero dossier : D1\n➡️ Date de dépot : 2024-01-01`;
    await fs.writeFile('first.txt', content, 'utf8');
    await fs.writeFile('second.txt', content, 'utf8');

    await run(['first.txt', 'second.txt']);

    expect(sanitizeSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Converted first.txt');
    expect(logSpy).toHaveBeenCalledWith('Converted second.txt');

    const out1 = await fs.readFile('first.json', 'utf8');
    const out2 = await fs.readFile('second.json', 'utf8');
    const expected = {
      nombre_fichiers_restants: 1,
      numero_teledemarche: 'A',
      nom_projet: 'TRA - X - One - v1',
      numero_dossier: '1',
      date_depot: '2024-01-01',
    };
    expect(JSON.parse(out1)).toEqual(expected);
    expect(JSON.parse(out2)).toEqual(expected);
  });

  it('logs error when readFile fails', async () => {
    vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('fail'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await run(['input.txt']);

    expect(errorSpy).toHaveBeenCalledWith('Error processing input.txt: fail');
    expect(logSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it('logs error when validation fails and no files created', async () => {
    const error = new Error('invalid');
    vi.spyOn(security, 'validateAndSanitizeContent').mockImplementation(() => {
      throw error;
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await fs.writeFile('input.txt', 'dummy', 'utf8');

    await run(['input.txt']);

    expect(errorSpy).toHaveBeenCalledWith(
      'Error processing input.txt: invalid',
    );
    expect(logSpy).not.toHaveBeenCalled();
    const files = await fs.readdir('.');
    expect(files).not.toContain('input.json');
  });

  it('warns when no summary blocks found', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(parser, 'parseAllSummaryBlocks').mockReturnValue([]);

    await fs.writeFile('input.txt', 'dummy', 'utf8');

    await run(['input.txt']);

    expect(warnSpy).toHaveBeenCalledWith(
      'No summary blocks found in input.txt',
    );
    expect(logSpy).not.toHaveBeenCalled();
    const files = await fs.readdir('.');
    expect(files).not.toContain('input.json');
  });
});
