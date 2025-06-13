/* @vitest-environment node */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { build } from 'esbuild';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const rootDir = resolve(__dirname, '../../..');

let cwd: string;
let tempDir: string;

beforeAll(async () => {
  await fs.mkdir(resolve(rootDir, 'dist'), { recursive: true });
  await build({
    entryPoints: [resolve(rootDir, 'src/cli/convert.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: resolve(rootDir, 'dist/convert.js'),
    banner: { js: '#!/usr/bin/env node' },
  });
  const distPath = resolve(rootDir, 'dist/convert.js');
  let built = await fs.readFile(distPath, 'utf8');
  built = built.replace(/^#!\/usr\/bin\/env ts-node\n/, '');
  built = built.replace(
    /if \(import\.meta\.main\) {\n\s*start\(\);\n}/,
    'start();',
  );
  await fs.writeFile(distPath, built, 'utf8');
});

afterAll(async () => {
  await fs.rm(resolve(rootDir, 'dist'), { recursive: true, force: true });
});

beforeEach(async () => {
  cwd = process.cwd();
  tempDir = await fs.mkdtemp(join(tmpdir(), 'cli-integration-'));
  process.chdir(tempDir);
});

afterEach(async () => {
  process.chdir(cwd);
  await fs.rm(tempDir, { recursive: true, force: true });
});

describe('compiled CLI', () => {
  it('converts file using real process', async () => {
    const content = `Block one\n📂 Nombre de fichier(s) restant(s) : 1\n➡️ Le dossier au numeroTélédémarche: AUTO-A est déposé\n➡️ Nom de projet : TRA - X - One - v1\n➡️ Numero dossier : D1\n➡️ Date de dépot : 2024-01-01`;
    await fs.writeFile('input.txt', content, 'utf8');

    const { stdout, stderr } = await execFileAsync(
      'node',
      [resolve(rootDir, 'dist/convert.js'), 'input.txt'],
      { cwd: tempDir },
    );

    expect(stderr).toBe('');
    expect(stdout.trim()).toBe('Converted input.txt');

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
