import { describe, it, expect } from 'vitest';
import { ConfigService } from '../ConfigService';
import { SECURITY_CONFIG } from '../../config/security';

// ensure environment isolation
const originalEnv = { ...process.env };

afterEach(() => {
  process.env = originalEnv;
});

describe('ConfigService env overrides', () => {
  it('returns overridden concurrency, timeout and security settings', () => {
    process.env.VITE_CONCURRENCY_LIMIT = '10';
    process.env.VITE_FILE_READ_TIMEOUT = '5000';
    process.env.VITE_MAX_FILE_SIZE = '1024';
    process.env.VITE_MAX_TOTAL_SIZE = '2048';
    process.env.VITE_MAX_FILES_COUNT = '3';
    process.env.VITE_MAX_LINE_LENGTH = '80';
    process.env.VITE_MAX_LINES_COUNT = '200';
    process.env.VITE_ALLOWED_FILE_EXTENSIONS = '.txt,.log';
    process.env.VITE_ALLOWED_MIME_TYPES = 'text/plain,text/log';
    process.env.VITE_RATE_LIMIT_WINDOW = '60';
    process.env.VITE_RATE_LIMIT_MAX_FILES = '5';

    const svc = new ConfigService(process.env);
    expect(svc.concurrencyLimit).toBe(10);
    expect(svc.fileReadTimeout).toBe(5000);
    expect(svc.security).toEqual({
      MAX_FILE_SIZE: 1024,
      MAX_TOTAL_SIZE: 2048,
      MAX_FILES_COUNT: 3,
      MAX_LINE_LENGTH: 80,
      MAX_LINES_COUNT: 200,
      ALLOWED_FILE_EXTENSIONS: ['.txt', '.log'],
      ALLOWED_MIME_TYPES: ['text/plain', 'text/log'],
      DANGEROUS_PATTERNS: SECURITY_CONFIG.DANGEROUS_PATTERNS,
      RATE_LIMIT_WINDOW: 60,
      RATE_LIMIT_MAX_FILES: 5,
    });
  });
});
