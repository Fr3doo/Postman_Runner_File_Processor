import { defaultParseStrategy, type ParseStrategy } from './parseStrategies';

const registry: Record<string, ParseStrategy> = {
  default: defaultParseStrategy,
};

export const registerParseStrategy = (
  key: string,
  strategy: ParseStrategy,
): void => {
  registry[key] = strategy;
};

export const getParseStrategy = (key: string = 'default'): ParseStrategy => {
  return registry[key] || defaultParseStrategy;
};

export const clearParseStrategies = (): void => {
  Object.keys(registry).forEach((k) => {
    if (k !== 'default') delete registry[k];
  });
};

export { registry as _strategyRegistry };
