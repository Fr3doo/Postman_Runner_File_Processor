import { FileData } from '../types';
import { parseFileContent, parseAllSummaryBlocks, generateJSONContent, downloadJSON } from '../utils/fileParser';

export class FileParserService {
  parse(content: string): FileData {
    return parseFileContent(content);
  }

  parseAll(content: string): FileData[] {
    return parseAllSummaryBlocks(content);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
