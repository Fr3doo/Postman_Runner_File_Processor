import { FileData } from '../types';
import {
  generateJSONContent,
  downloadJSON,
  sanitizeFileData,
} from '../utils/fileParser';
import { getParseStrategy } from '../utils/parseStrategyRegistry';

export class FileParserService {
  parse(content: string, strategyKey: string = 'default'): FileData[] {
    const strategy = getParseStrategy(strategyKey);
    return strategy(content);
  }

  toJSON(data: FileData): string {
    const sanitized = sanitizeFileData(data);
    return generateJSONContent(sanitized);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(sanitizeFileData(data), filename);
  }
}
