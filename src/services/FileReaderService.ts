import { FileReadError, FileReadTimeoutError } from '../utils/errors';

export class FileReaderService {
  readFileWithTimeout(file: File, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(
          new FileReadTimeoutError(
            'D\u00e9lai de lecture d\u00e9pass\u00e9. Le fichier est peut-\u00eatre corrompu ou trop volumineux.',
          ),
        );
      }, timeout);

      reader.onload = () => {
        clearTimeout(timeoutId);
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new FileReadError('Impossible de lire le fichier en texte.'));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(
          new FileReadError(
            'Impossible de lire le fichier. Il est peut-\u00eatre corrompu.',
          ),
        );
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(
          new FileReadError(
            'La lecture du fichier a \u00e9t\u00e9 annul\u00e9e.',
          ),
        );
      };

      try {
        reader.readAsText(file, 'utf-8');
      } catch {
        clearTimeout(timeoutId);
        reject(
          new FileReadError(
            'Impossible de d\u00e9marrer la lecture du fichier.',
          ),
        );
      }
    });
  }
}
