import { describe, it, expect, beforeEach } from 'vitest';
import { loggingService } from '../../services/LoggingService';

describe('loggingService', () => {
  beforeEach(() => {
    loggingService.clear();
  });

  it('stores info logs', () => {
    loggingService.logInfo('hello');
    const logs = loggingService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toBe('hello');
    expect(logs[0].timestamp).toBeInstanceOf(Date);
  });

  it('stores error logs', () => {
    loggingService.logError('fail');
    const logs = loggingService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].message).toBe('fail');
  });
});
