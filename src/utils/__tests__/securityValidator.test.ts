import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateAndSanitizeContent, rateLimiter } from '../securityValidator';

describe('validateAndSanitizeContent', () => {
  it('flags empty content', () => {
    const result = validateAndSanitizeContent('', 'empty.txt');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('File is empty.');
  });

  it('sanitizes dangerous scripts', () => {
    const content = 'hello <script>alert(1)</script> world';
    const result = validateAndSanitizeContent(content, 'a.txt');
    expect(result.isValid).toBe(true);
    expect(result.sanitizedContent).not.toContain('<script>');
  });
});

describe('RateLimiter', () => {
  afterEach(() => {
    (rateLimiter as any).requests = [];
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
