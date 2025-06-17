import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalFileService } from '../LocalFileService';

type FileRecord = Record<string, string>;

class MockFileHandle {
  name: string;
  private content: string;
  kind = 'file' as const;
  constructor(name: string, content: string) {
    this.name = name;
    this.content = content;
  }
  async getFile() {
    return {
      text: async () => this.content,
    } as File;
  }
}

class MockDirectoryHandle {
  private files: Map<string, MockFileHandle>;
  constructor(entries: FileRecord) {
    this.files = new Map(
      Object.entries(entries).map(([name, c]) => [name, new MockFileHandle(name, c)]),
    );
  }
  async *values() {
    for (const f of this.files.values()) {
      yield f;
    }
  }
  async getFileHandle(name: string) {
    const f = this.files.get(name);
    if (!f) throw new Error('not found');
    return f;
  }
  async removeEntry(name: string) {
    this.files.delete(name);
  }
}

let service: LocalFileService;
let directory: MockDirectoryHandle;

beforeEach(() => {
  service = new LocalFileService();
  (service as unknown as { isNode: () => boolean }).isNode = () => false;
  directory = new MockDirectoryHandle({ 'd.json': '{"a":1}' });
  (globalThis as unknown as { showDirectoryPicker: () => Promise<MockDirectoryHandle> }).showDirectoryPicker = vi.fn(async () => directory);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LocalFileService browser API', () => {
  it('requests access and lists files', async () => {
    const handle = await service.requestDirectoryAccess();
    expect(handle).toBe(directory);
    const list = await service.listJSONFiles();
    expect(list).toEqual(['d.json']);
    expect(globalThis.showDirectoryPicker).toHaveBeenCalled();
  });

  it('downloads and deletes files', async () => {
    await service.requestDirectoryAccess();

    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');
    Object.defineProperty(URL, 'createObjectURL', { writable: true, value: () => 'blob:url' });
    const createSpy = vi.spyOn(URL, 'createObjectURL');
    Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: vi.fn() });
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const data = await service.downloadFile('d.json');
    expect(data).toBe('{"a":1}');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    await service.deleteFile('d.json');
    const filesAfter = await service.listJSONFiles();
    expect(filesAfter).toEqual([]);

    createElementSpy.mockRestore();
    createSpy.mockRestore();
  });
});
