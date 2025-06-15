import { readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { JSDOM } from 'jsdom';
import mermaid from 'mermaid';

async function generate(pathToMmd: string) {
  const code = await readFile(pathToMmd, 'utf-8');
  const { window } = new JSDOM('');
  (globalThis as unknown as { window: Window; document: Document }).window = window;
  (globalThis as unknown as { window: Window; document: Document }).document = window.document;
  mermaid.initialize({ startOnLoad: false });
  const { svg } = await mermaid.render('diagram', code);
  const fileName = `${basename(pathToMmd, '.mmd')}.svg`;
  const dest = join('docs', 'reference', fileName);
  await writeFile(dest, svg, 'utf-8');
  console.log(`Diagram generated: ${dest}`);
}

const input = process.argv[2];
if (!input) {
  console.error('Usage: ts-node scripts/gen-diagrams.ts <diagram.mmd>');
  process.exit(1);
}

generate(input).catch((err) => {
  console.error(err);
  process.exit(1);
});

