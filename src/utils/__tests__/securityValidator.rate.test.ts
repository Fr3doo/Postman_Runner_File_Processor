import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateRateLimit, rateLimiter } from '../securityValidator';
import { RateLimitError } from '../errors';
import { configService } from '../../services/ConfigService';

describe('validateRateLimit', () => {
  afterEach(() => {
    (rateLimiter as unknown as { requests: number[] }).requests = [];
    vi.useRealTimers();
  });

  it('enforces max files per window and resets after window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);

    for (let i = 0; i < configService.security.RATE_LIMIT_MAX_FILES; i++) {
      expect(validateRateLimit().isValid).toBe(true);
    }

    expect(() => validateRateLimit()).toThrow(RateLimitError);

    vi.setSystemTime(configService.security.RATE_LIMIT_WINDOW + 1);

    expect(validateRateLimit().isValid).toBe(true);
  });

  it('getTimeUntilReset returns 0 without requests', () => {
    expect(rateLimiter.getTimeUntilReset()).toBe(0);
  });

  it('getTimeUntilReset reports remaining time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    validateRateLimit();
    vi.setSystemTime(500);
    expect(rateLimiter.getTimeUntilReset()).toBeGreaterThan(0);
  });
});
