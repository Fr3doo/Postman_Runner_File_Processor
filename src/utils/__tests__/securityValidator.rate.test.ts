import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateRateLimit, rateLimiter } from '../securityValidator';
import { RateLimitError } from '../errors';
import { SECURITY_CONFIG } from '../../config/security';

describe('validateRateLimit', () => {
  afterEach(() => {
    (rateLimiter as unknown as { requests: number[] }).requests = [];
    vi.useRealTimers();
  });

  it('enforces max files per window and resets after window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    for (let i = 0; i < SECURITY_CONFIG.RATE_LIMIT_MAX_FILES; i++) {
      expect(validateRateLimit().isValid).toBe(true);
    }

    expect(() => validateRateLimit()).toThrow(RateLimitError);

    vi.setSystemTime(SECURITY_CONFIG.RATE_LIMIT_WINDOW + 1);

    expect(validateRateLimit().isValid).toBe(true);
  });
});
