#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import { basename, extname, resolve, dirname } from 'path';
import {
  parseAllSummaryBlocks,
  generateJSONContent,
  sanitizeFileData,
} from '../utils/fileParser';
import { validateAndSanitizeContent } from '../utils/securityValidator';

interface IndexEntry {
  path: string;
  timestamp: string;
  recordCount: number;
}

async function appendIndex(filePath: string, recordCount: number): Promise<void> {
  const dir = dirname(filePath);
  const indexPath = resolve(dir, 'convert-index.json');
  const entry: IndexEntry = {
    path: filePath,
    timestamp: new Date().toISOString(),
    recordCount,
  };

  try {
    const data = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(data) as IndexEntry[];
    index.push(entry);
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.writeFile(indexPath, JSON.stringify([entry], null, 2), 'utf8');
    } else {
      throw err;
    }
  }
}

async function convertFile(filePath: string): Promise<number> {
  const absPath = resolve(process.cwd(), filePath);
  const content = await fs.readFile(absPath, 'utf8');
  const { sanitizedContent } = validateAndSanitizeContent(content);
  const summaries = parseAllSummaryBlocks(sanitizedContent || content);
  if (summaries.length === 0) {
    console.warn(`No summary blocks found in ${filePath}`);
    return 0;
  }
  const base = basename(filePath, extname(filePath));

  for (const [idx, summary] of summaries.entries()) {
    const sanitized = sanitizeFileData(summary);
    const json = generateJSONContent(sanitized);
    const suffix = summaries.length === 1 ? '' : `-${idx + 1}`;
    const outPath = resolve(process.cwd(), `${base}${suffix}.json`);
    await fs.writeFile(outPath, json, 'utf8');
    await appendIndex(outPath, 1);
  }
  return summaries.length;
}

export async function run(files: string[]): Promise<void> {
  if (files.length === 0) {
    console.error('Usage: ts-node src/cli/convert.ts <files...>');
    process.exitCode = 1;
    return;
  }

  for (const file of files) {
    try {
      const count = await convertFile(file);
      if (count > 0) {
        console.log(`Converted ${file}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error processing ${file}: ${message}`);
    }
  }
}

export async function main(
  args: string[] = process.argv.slice(2),
  runner: typeof run = run,
): Promise<void> {
  await runner(args);
}

export async function start(
  args: string[] = process.argv.slice(2),
  mainFn: typeof main = main,
): Promise<void> {
  try {
    await mainFn(args);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  }
}

/* c8 ignore next */
if (import.meta.main) {
  start();
}
