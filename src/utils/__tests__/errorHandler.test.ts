import { describe, it, expect } from 'vitest';
import { ErrorHandler } from '../../services/ErrorHandler';
import { ParsingError } from '../errors';

describe('ErrorHandler', () => {
  const handler = new ErrorHandler();

  it('returns message from known error', () => {
    const msg = handler.handle(new ParsingError('bad'));
    expect(msg).toBe('bad');
  });

  it('sanitises and truncates message', () => {
    const long = '<script>attack</script>' + 'a'.repeat(600);
    const msg = handler.handle(new Error(long));
    expect(msg.includes('<')).toBe(false);
    expect(msg.length).toBe(500);
  });

  it('falls back to generic message', () => {
    const msg = handler.handle({} as unknown as Error);
    expect(msg).toMatch(/erreur inconnue/i);
  });

  it('handles string error input', () => {
    const msg = handler.handle('oops');
    expect(msg).toBe('oops');
  });
});
