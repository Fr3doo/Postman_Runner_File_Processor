import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimiter } from '../securityValidator';
import { configService } from '../../services/ConfigService';
import { SECURITY_CONFIG } from '../../config/security';

beforeEach(() => {
  vi.spyOn(configService, 'security', 'get').mockReturnValue(SECURITY_CONFIG);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  (rateLimiter as unknown as { requests: number[] }).requests = [];
});

describe('rateLimiter.getTimeUntilReset branches', () => {
  it('returns 0 when there are no requests', () => {
    expect(rateLimiter.getTimeUntilReset()).toBe(0);
  });

  it('returns remaining window time for oldest request within window', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    (rateLimiter as unknown as { requests: number[] }).requests = [0];

    const remaining = rateLimiter.getTimeUntilReset();
    expect(remaining).toBe(configService.security.RATE_LIMIT_WINDOW - 1000);
  });

  it('returns 0 when oldest request is outside the window', () => {
    vi.useFakeTimers();
    const window = configService.security.RATE_LIMIT_WINDOW;
    vi.setSystemTime(window + 1000);
    (rateLimiter as unknown as { requests: number[] }).requests = [0];

    expect(rateLimiter.getTimeUntilReset()).toBe(0);
  });

  it('uses the oldest request when multiple are present', () => {
    vi.useFakeTimers();
    vi.setSystemTime(5000);
    (rateLimiter as unknown as { requests: number[] }).requests = [
      0, 2000, 3000,
    ];

    const remaining = rateLimiter.getTimeUntilReset();
    expect(remaining).toBe(configService.security.RATE_LIMIT_WINDOW - 5000);
  });
});
