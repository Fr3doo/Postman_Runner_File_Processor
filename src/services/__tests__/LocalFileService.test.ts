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

describe('LocalFileService', () => {
  it('lists JSON files in directory', async () => {
    await fs.writeFile(join(dir, 'a.json'), '{}', 'utf8');
    await fs.writeFile(join(dir, 'b.txt'), 'x', 'utf8');
    const files = await service.listJSONFiles();
    expect(files).toContain('a.json');
    expect(files).not.toContain('b.txt');
  });

  it('deletes a file', async () => {
    const filePath = join(dir, 'del.json');
    await fs.writeFile(filePath, '{}', 'utf8');
    await service.deleteFile('del.json');
    await expect(fs.stat(filePath)).rejects.toThrow();
  });

  it('downloads a file and triggers DOM', async () => {
    await fs.writeFile(join(dir, 'd.json'), '{"a":1}', 'utf8');
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: () => 'blob:url',
    });
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => 'blob:url');
    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn(),
    });
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const content = await service.downloadFile('d.json');

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;

    expect(content).toBe('{"a":1}');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(anchor);
  // Add these security test cases:
  it('rejects invalid filenames in deleteFile', async () => {
    await expect(service.deleteFile('../invalid')).rejects.toThrow('Invalid filename');
    await expect(service.deleteFile('')).rejects.toThrow('Invalid filename');
    await expect(service.deleteFile('path/traversal')).rejects.toThrow('Invalid filename');
  });

  it('rejects invalid filenames in downloadFile', async () => {
    await expect(service.downloadFile('../invalid')).rejects.toThrow('Invalid filename');
    await expect(service.downloadFile('path\\traversal')).rejects.toThrow('Invalid filename');
  });
    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });
});

