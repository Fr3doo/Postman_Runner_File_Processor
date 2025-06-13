export class FileReaderService {
  readFileWithTimeout(file: File, timeout: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(
          new Error(
            'D\u00e9lai de lecture d\u00e9pass\u00e9. Le fichier est peut-\u00eatre corrompu ou trop volumineux.',
          ),
        );
      }, timeout);

      reader.onload = () => {
        clearTimeout(timeoutId);
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Impossible de lire le fichier en texte.'));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(
          new Error('Impossible de lire le fichier. Il est peut-\u00eatre corrompu.'),
        );
      };

      reader.onabort = () => {
        clearTimeout(timeoutId);
        reject(new Error('La lecture du fichier a \u00e9t\u00e9 annul\u00e9e.'));
      };

      try {
        reader.readAsText(file, 'utf-8');
      } catch {
        clearTimeout(timeoutId);
        reject(new Error('Impossible de d\u00e9marrer la lecture du fichier.'));
      }
    });
  }
}
