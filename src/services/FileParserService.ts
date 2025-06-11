import { FileData } from '../types';
import { parseFileContent, generateJSONContent, downloadJSON } from '../utils/fileParser';

export class FileParserService {
  parse(content: string, filename: string): FileData {
    return parseFileContent(content, filename);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
