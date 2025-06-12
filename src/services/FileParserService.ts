import { FileData } from '../types';
import { generateJSONContent, downloadJSON } from '../utils/fileParser';
import {
  defaultParseStrategy,
  type ParseStrategy,
} from '../utils/parseStrategies';

export class FileParserService {
  parse(
    content: string,
    strategy: ParseStrategy = defaultParseStrategy,
  ): FileData[] {
    return strategy(content);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
