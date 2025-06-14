import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { validateFile, validateFileList } from '../securityValidator';
import { ValidationError } from '../errors';
import { configService } from '../../services/ConfigService';
import { SECURITY_CONFIG } from '../../config/security';

beforeEach(() => {
  vi.spyOn(configService, 'security', 'get').mockReturnValue(SECURITY_CONFIG);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const createMockFile = (name: string, size: number, type: string): File =>
  ({ name, size, type }) as unknown as File;

describe('validateFile', () => {
  it('throws for invalid extension', () => {
    const file = createMockFile('bad.exe', 10, 'text/plain');
    expect(() => validateFile(file)).toThrow(ValidationError);
  });

  it('throws for excessive size', () => {
    const bigSize = configService.security.MAX_FILE_SIZE + 1;
    const file = createMockFile('big.txt', bigSize, 'text/plain');
    expect(() => validateFile(file)).toThrow(ValidationError);
  });

  it('warns for invalid mime type', () => {
    const file = createMockFile('test.txt', 10, 'application/pdf');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('accepts file without mime type', () => {
    const file = createMockFile('safe.txt', 10, '');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it('accepts valid file', () => {
    const file = createMockFile('good.txt', 10, 'text/plain');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects suspicious file names', () => {
    const names = ['../evil.txt', 'bad<name>.txt', '.hidden.txt', 'con'];
    for (const name of names) {
      const file = createMockFile(name, 10, 'text/plain');
      expect(() => validateFile(file)).toThrow(/motifs suspects/);
    }
  });
});

describe('validateFileList', () => {
  it('throws when file count exceeds limit', () => {
    const files = Array.from({
      length: configService.security.MAX_FILES_COUNT + 1,
    }).map((_, i) => createMockFile(`f${i}.txt`, 10, 'text/plain'));
    expect(() => validateFileList(files)).toThrow(ValidationError);
  });

  it('throws when total size exceeds limit', () => {
    const perFileSize = configService.security.MAX_FILE_SIZE - 1;
    const fileCount =
      Math.floor(configService.security.MAX_TOTAL_SIZE / perFileSize) + 1;
    const files = Array.from({ length: fileCount }).map((_, i) =>
      createMockFile(`f${i}.txt`, perFileSize, 'text/plain'),
    );
    expect(() => validateFileList(files)).toThrow(ValidationError);
  });

  it('throws when any file in list is invalid', () => {
    const files = [
      createMockFile('good.txt', 10, 'text/plain'),
      createMockFile('../bad.txt', 10, 'text/plain'),
    ];
    expect(() => validateFileList(files)).toThrow(ValidationError);
  });

  it('accepts a list of valid files', () => {
    const files = [
      createMockFile('a.txt', 10, 'text/plain'),
      createMockFile('b.txt', 20, 'text/plain'),
    ];
    const result = validateFileList(files);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
