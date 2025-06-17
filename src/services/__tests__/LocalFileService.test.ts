import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { LocalFileService } from '../LocalFileService';

let dir: string;
// Add this test case:

describe('Constructor validation', () => {
  it('throws error for invalid directory parameter', () => {
    expect(() => new LocalFileService('')).toThrow('Invalid directory path');
    expect(() => new LocalFileService(null as any)).toThrow('Invalid directory path');
  });
});
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

