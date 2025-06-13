#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import { basename, extname, resolve } from 'path';
import {
  parseAllSummaryBlocks,
  generateJSONContent,
  sanitizeFileData,
} from '../utils/fileParser';
import { validateAndSanitizeContent } from '../utils/securityValidator';

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

  await Promise.all(
    summaries.map((summary, idx) => {
      const sanitized = sanitizeFileData(summary);
      const json = generateJSONContent(sanitized);
      const suffix = summaries.length === 1 ? '' : `-${idx + 1}`;
      const outPath = resolve(process.cwd(), `${base}${suffix}.json`);
      return fs.writeFile(outPath, json, 'utf8');
    }),
  );
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

if (import.meta.main) {
  start();
}
