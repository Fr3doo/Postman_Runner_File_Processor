import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loggingService } from '../../services/LoggingService';

describe('loggingService.exportLogs', () => {
  beforeEach(() => {
    loggingService.clear();
  });

  it('returns JSON and triggers DOM methods', () => {
    loggingService.logInfo('hello');

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation(
        () => ({ click: vi.fn() }) as unknown as HTMLAnchorElement,
      );

    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: () => 'blob:url',
    });
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => 'blob:url');

    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: vi.fn(),
    });
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    const result = loggingService.exportLogs();

    const anchor = createElementSpy.mock.results[0].value as HTMLAnchorElement;

    expect(result).toMatch(/hello/);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    expect(anchor.click).toHaveBeenCalled();

    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    vi.restoreAllMocks();
  });
});
