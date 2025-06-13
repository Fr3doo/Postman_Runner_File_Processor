#!/usr/bin/env ts-node
import { promises as fs } from 'fs';
import { basename, extname, resolve } from 'path';
import { parseAllSummaryBlocks, generateJSONContent } from '../utils/fileParser';
import { validateAndSanitizeContent } from '../utils/securityValidator';

async function convertFile(filePath: string): Promise<void> {
  const absPath = resolve(process.cwd(), filePath);
  const content = await fs.readFile(absPath, 'utf8');
  const { sanitizedContent } = validateAndSanitizeContent(content);
  const summaries = parseAllSummaryBlocks(sanitizedContent || content);
  const base = basename(filePath, extname(filePath));

  await Promise.all(
    summaries.map((summary, idx) => {
      const json = generateJSONContent(summary);
      const suffix = summaries.length === 1 ? '' : `-${idx + 1}`;
      const outPath = resolve(process.cwd(), `${base}${suffix}.json`);
      return fs.writeFile(outPath, json, 'utf8');
    }),
  );
}

async function main(): Promise<void> {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: ts-node src/cli/convert.ts <files...>');
    process.exit(1);
  }

  for (const file of files) {
    try {
      await convertFile(file);
      console.log(`Converted ${file}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error processing ${file}: ${message}`);
    }
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
});
