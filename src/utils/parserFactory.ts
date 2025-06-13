import { defaultParseStrategy, type ParseStrategy } from './parseStrategies';

export class ParserFactory {
  private static strategies: Record<string, ParseStrategy> = {
    default: defaultParseStrategy,
  };

  static getStrategy(format: string = 'default'): ParseStrategy {
    return ParserFactory.strategies[format] || defaultParseStrategy;
  }

  static register(format: string, strategy: ParseStrategy): void {
    ParserFactory.strategies[format] = strategy;
  }

  static clear(): void {
    ParserFactory.strategies = { default: defaultParseStrategy };
  }
}
