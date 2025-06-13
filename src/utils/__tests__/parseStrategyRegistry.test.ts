import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerParseStrategy,
  getParseStrategy,
  clearParseStrategies,
} from '../parseStrategyRegistry';
import { defaultParseStrategy } from '../parseStrategies';

const dummyStrategy = () => [];

describe('parseStrategyRegistry', () => {
  beforeEach(() => {
    clearParseStrategies();
  });

  it('returns default strategy for unknown key', () => {
    const strat = getParseStrategy('unknown');
    expect(strat).toBe(defaultParseStrategy);
  });

  it('registers and retrieves a custom strategy', () => {
    registerParseStrategy('csv', dummyStrategy);
    const strat = getParseStrategy('csv');
    expect(strat).toBe(dummyStrategy);
  });

  it('clear removes custom strategies', () => {
    registerParseStrategy('csv', dummyStrategy);
    clearParseStrategies();
    const strat = getParseStrategy('csv');
    expect(strat).toBe(defaultParseStrategy);
  });
});
