import { FileData } from '../types';
import { generateJSONContent, downloadJSON } from '../utils/fileParser';
import { ParserFactory } from '../utils/parserFactory';

export class FileParserService {
  parse(content: string, format: string = 'default'): FileData[] {
    const strategy = ParserFactory.getStrategy(format);
    return strategy(content);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
