import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { localFileService, LocalFileServiceClass } from '../../services/LocalFileService';
import { Card } from '../ui/Card';

interface LocalFilesPageProps {
  service?: LocalFileServiceClass;
}

export const LocalFilesPage: React.FC<LocalFilesPageProps> = ({ service = localFileService }) => {
  const [files, setFiles] = React.useState<string[]>([]);

  const loadFiles = React.useCallback(async () => {
    try {
      const list = await service.listJSONFiles();
      setFiles(list);
    } catch (err) {
      console.error(err);
    }
  }, [service]);

  React.useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleDownload = async (filename: string) => {
    await service.downloadFile(filename);
  };

  const handleDelete = async (filename: string) => {
    await service.deleteFile(filename);
    await loadFiles();
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fichiers locaux</h1>
      {files.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Aucun fichier dans le dossier.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card key={file} className="flex items-center justify-between">
              <span className="truncate" data-testid="filename">{file}</span>
              <div className="flex space-x-2">
                <button
                  title="download"
                  onClick={() => handleDownload(file)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download size={16} />
                </button>
                <button
                  title="delete"
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default LocalFilesPage;
