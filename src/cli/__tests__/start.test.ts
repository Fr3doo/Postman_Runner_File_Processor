import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as convert from '../convert';

let exitSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  exitSpy = vi
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);
});

afterEach(() => {
  exitSpy.mockRestore();
  vi.restoreAllMocks();
});

describe('start', () => {
  it('invokes main with provided runner', async () => {
    const runner = vi.fn().mockResolvedValue(undefined);
    await convert.main(['a'], runner);
    expect(runner).toHaveBeenCalledWith(['a']);
  });

  it('logs error and exits on failure', async () => {
    const err = new Error('boom');
    const failingMain = vi.fn().mockRejectedValue(err);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await convert.start([], failingMain);
    expect(errorSpy).toHaveBeenCalledWith('boom');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
