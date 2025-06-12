import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateAndSanitizeContent, rateLimiter } from '../securityValidator';
import { ValidationError } from '../errors';

describe('validateAndSanitizeContent', () => {
  it('flags empty content', () => {
    expect(() => validateAndSanitizeContent('')).toThrow(ValidationError);
  });

  it('sanitizes dangerous scripts', () => {
    const content = 'hello <script>alert(1)</script> world';
    const result = validateAndSanitizeContent(content);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedContent).not.toContain('<script>');
  });

  it('throws when sanitization removes most content', () => {
    const bigScript = `<script>${'malicious'.repeat(100)}</script>`;
    const iframe = '<iframe src="javascript:alert(2)"></iframe>';
    const content = `${bigScript}${iframe} onload=alert(1)`;
    const fn = () => validateAndSanitizeContent(content);
    expect(fn).toThrow(ValidationError);
    expect(fn).toThrow('File content was heavily modified during sanitization.');
  });

  it('returns identical content when no issues found', () => {
    const content = 'just some safe text';
    const result = validateAndSanitizeContent(content);
    expect(result.isValid).toBe(true);
    expect(result.sanitizedContent).toBe(content);
  });
});

describe('RateLimiter', () => {
  afterEach(() => {
    (rateLimiter as unknown as { requests: number[] }).requests = [];
    vi.useRealTimers();
  });

  it('limits calls within window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    for (let i = 0; i < 100; i++) {
      expect(rateLimiter.isAllowed()).toBe(true);
    }
    expect(rateLimiter.isAllowed()).toBe(false);

    // advance time past window
    vi.setSystemTime(60000);
    expect(rateLimiter.isAllowed()).toBe(true);
  });
});
