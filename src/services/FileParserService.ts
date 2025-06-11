import { FileData } from '../types';
import { parseFileContent, generateJSONContent, downloadJSON } from '../utils/fileParser';

export class FileParserService {
  parse(content: string): FileData {
    return parseFileContent(content);
  }

  toJSON(data: FileData): string {
    return generateJSONContent(data);
  }

  download(data: FileData, filename: string): void {
    downloadJSON(data, filename);
  }
}
