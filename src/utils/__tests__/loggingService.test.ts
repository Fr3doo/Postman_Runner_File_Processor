import { describe, it, expect, beforeEach, vi } from 'vitest';
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

  it('clears logs', () => {
    loggingService.logInfo('a');
    expect(loggingService.getLogs().length).toBe(1);
    loggingService.clear();
    expect(loggingService.getLogs().length).toBe(0);
  });

  it('getLogs returns a copy', () => {
    loggingService.logInfo('a');
    const logs = loggingService.getLogs();
    logs.push({ level: 'info', message: 'b', timestamp: new Date() });
    expect(loggingService.getLogs().length).toBe(1);
  });

  it('saves and loads logs from localStorage', () => {
    loggingService.logInfo('persist');
    loggingService.save();
    loggingService.clear();
    expect(loggingService.getLogs().length).toBe(0);
    loggingService.load();
    const logs = loggingService.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe('persist');
  });

  it('exportLogs returns JSON string', () => {
    loggingService.logInfo('json');
    const data = loggingService.exportLogs();
    expect(data).toMatch(/json/);
  });

  it('handles localStorage errors gracefully', () => {
    const setSpy = vi
      .spyOn(window.localStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('fail');
      });
    const getSpy = vi
      .spyOn(window.localStorage, 'getItem')
      .mockImplementation(() => {
        throw new Error('fail');
      });

    expect(() => loggingService.save()).not.toThrow();
    expect(() => loggingService.load()).not.toThrow();

    setSpy.mockRestore();
    getSpy.mockRestore();
  });
});
