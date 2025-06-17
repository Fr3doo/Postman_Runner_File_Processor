import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { LocalFileService } from '../LocalFileService';

let dir: string;
let service: LocalFileService;

beforeEach(async () => {
  dir = await fs.mkdtemp(join(tmpdir(), 'local-file-'));
  service = new LocalFileService(dir);
});

afterEach(async () => {
  await fs.rm(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});
// Add these test cases:

  it('handles invalid filenames in deleteFile', async () => {
    await expect(service.deleteFile('../invalid')).rejects.toThrow('Invalid filename');
    await expect(service.deleteFile('')).rejects.toThrow('Invalid filename');
  });

  it('throws error when deleting non-existent file', async () => {
    await expect(service.deleteFile('nonexistent.json')).rejects.toThrow();
  });

  it('handles directory read errors gracefully', async () => {
    const invalidService = new LocalFileService('/nonexistent/path');
    await expect(invalidService.listJSONFiles()).rejects.toThrow();
  });

  it('handles invalid filenames in downloadFile', async () => {
    await expect(service.downloadFile('../invalid')).rejects.toThrow('Invalid filename');
  });

  it('throws error when downloading non-existent file', async () => {
    await expect(service.downloadFile('nonexistent.json')).rejects.toThrow();
  });
});

