import { describe, it, expect } from 'vitest';
import { validateFile, validateFileList } from '../securityValidator';
import { ValidationError } from '../errors';
import { SECURITY_CONFIG } from '../../config/security';

const createMockFile = (
  name: string,
  size: number,
  type: string
): File => ({ name, size, type } as unknown as File);

describe('validateFile', () => {
  it('throws for invalid extension', () => {
    const file = createMockFile('bad.exe', 10, 'text/plain');
    expect(() => validateFile(file)).toThrow(ValidationError);
  });

  it('throws for excessive size', () => {
    const bigSize = SECURITY_CONFIG.MAX_FILE_SIZE + 1;
    const file = createMockFile('big.txt', bigSize, 'text/plain');
    expect(() => validateFile(file)).toThrow(ValidationError);
  });

  it('warns for invalid mime type', () => {
    const file = createMockFile('test.txt', 10, 'application/pdf');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('accepts valid file', () => {
    const file = createMockFile('good.txt', 10, 'text/plain');
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('validateFileList', () => {
  it('throws when file count exceeds limit', () => {
    const files = Array.from({ length: SECURITY_CONFIG.MAX_FILES_COUNT + 1 }).map(
      (_, i) => createMockFile(`f${i}.txt`, 10, 'text/plain')
    );
    expect(() => validateFileList(files)).toThrow(ValidationError);
  });

  it('throws when total size exceeds limit', () => {
    const perFileSize = SECURITY_CONFIG.MAX_FILE_SIZE - 1;
    const fileCount = Math.floor(SECURITY_CONFIG.MAX_TOTAL_SIZE / perFileSize) + 1;
    const files = Array.from({ length: fileCount }).map((_, i) =>
      createMockFile(`f${i}.txt`, perFileSize, 'text/plain')
    );
    expect(() => validateFileList(files)).toThrow(ValidationError);
  });
});
