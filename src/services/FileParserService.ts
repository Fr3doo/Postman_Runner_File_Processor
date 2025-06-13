import { FileData } from '../types';
import { generateJSONContent, downloadJSON } from '../utils/fileParser';
import { getParseStrategy } from '../utils/parseStrategyRegistry';

export class FileParserService {
  parse(content: string, strategyKey: string = 'default'): FileData[] {
    const strategy = getParseStrategy(strategyKey);
    return strategy(content);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
