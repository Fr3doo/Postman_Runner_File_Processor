import { describe, it, expect, beforeEach } from 'vitest';
import { ParserFactory } from '../parserFactory';
import { defaultParseStrategy } from '../parseStrategies';

const dummyStrategy = () => [];

describe('ParserFactory', () => {
  beforeEach(() => {
    ParserFactory.clear();
  });

  it('returns default strategy for unknown format', () => {
    const strat = ParserFactory.getStrategy('unknown');
    expect(strat).toBe(defaultParseStrategy);
  });

  it('register and retrieve custom strategy', () => {
    ParserFactory.register('csv', dummyStrategy);
    const strat = ParserFactory.getStrategy('csv');
    expect(strat).toBe(dummyStrategy);
  });
});
