import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileReaderService } from '../../services/FileReaderService';
import { FileReadError, FileReadTimeoutError } from '../errors';

const createFile = (text: string): File => new File([text], 'f.txt', { type: 'text/plain' });

describe('FileReaderService', () => {
  let original: typeof FileReader;

  beforeEach(() => {
    original = global.FileReader;
  });

  afterEach(() => {
    global.FileReader = original;
    vi.useRealTimers();
  });

  it('reads file content', async () => {
    class MockReader {
      result: string | ArrayBuffer | null = null;
      onload: ((ev: ProgressEvent<FileReader>) => void) | null = null;
      readAsText() {
        this.result = 'ok';
        if (this.onload) this.onload(new ProgressEvent('load'));
      }
      abort() {}
    }
    // @ts-expect-error overriding DOM FileReader
    global.FileReader = MockReader;
    const service = new FileReaderService();
    const result = await service.readFileWithTimeout(createFile('ok'), 1000);
    expect(result).toBe('ok');
  });

  it('rejects on error', async () => {
    class MockReader {
      onerror: ((ev: ProgressEvent<FileReader>) => void) | null = null;
      readAsText() {
        if (this.onerror) this.onerror(new ProgressEvent('error'));
      }
      abort() {}
    }
    // @ts-expect-error overriding DOM FileReader
    global.FileReader = MockReader;
    const service = new FileReaderService();
    await expect(
      service.readFileWithTimeout(createFile('bad'), 1000),
    ).rejects.toBeInstanceOf(FileReadError);
  });

  it('rejects on timeout', async () => {
    vi.useFakeTimers();
    class MockReader {
      abort = vi.fn();
      readAsText() {}
    }
    // @ts-expect-error overriding DOM FileReader
    global.FileReader = MockReader;
    const service = new FileReaderService();
    const promise = service.readFileWithTimeout(createFile('slow'), 100);
    const assertion = expect(promise).rejects.toBeInstanceOf(FileReadTimeoutError);
    await vi.runAllTimersAsync();
    await assertion;
  });
});
