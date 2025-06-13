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

  it('supports multiple strategies', () => {
    const stratA = () => ['a'];
    const stratB = () => ['b'];
    ParserFactory.register('a', stratA);
    ParserFactory.register('b', stratB);
    expect(ParserFactory.getStrategy('a')).toBe(stratA);
    expect(ParserFactory.getStrategy('b')).toBe(stratB);
    expect(ParserFactory.getStrategy('other')).toBe(defaultParseStrategy);
  });
});
