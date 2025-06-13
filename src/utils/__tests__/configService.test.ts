import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FILE_READ_TIMEOUT } from '../../config/app';
import { SECURITY_CONFIG } from '../../config/security';
import { ConfigService } from '../../services/ConfigService';

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('configService environment overrides', () => {
  it('parses numeric and array values from env', async () => {
    process.env.VITE_CONCURRENCY_LIMIT = '8';
    process.env.VITE_FILE_READ_TIMEOUT = '123';
    process.env.VITE_MAX_FILES_COUNT = '3';
    process.env.VITE_ALLOWED_FILE_EXTENSIONS = '.txt, .log';
    const configService = new ConfigService(process.env);
    expect(configService.concurrencyLimit).toBe(8);
    expect(configService.fileReadTimeout).toBe(123);
    expect(configService.security.MAX_FILES_COUNT).toBe(3);
    expect(configService.security.ALLOWED_FILE_EXTENSIONS).toEqual([
      '.txt',
      '.log',
    ]);
  });

  it('falls back to defaults when env invalid or missing', async () => {
    process.env.VITE_FILE_READ_TIMEOUT = 'nope';
    process.env.VITE_MAX_LINES_COUNT = 'bad';
    delete process.env.VITE_ALLOWED_MIME_TYPES;
    const configService = new ConfigService(process.env);
    expect(configService.fileReadTimeout).toBe(FILE_READ_TIMEOUT);
    expect(configService.security.MAX_LINES_COUNT).toBe(
      SECURITY_CONFIG.MAX_LINES_COUNT,
    );
    expect(configService.security.ALLOWED_MIME_TYPES).toEqual(
      SECURITY_CONFIG.ALLOWED_MIME_TYPES,
    );
  });
});
