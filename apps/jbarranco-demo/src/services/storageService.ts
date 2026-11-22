import { DEMO_PDF_DISABLED_MESSAGE } from "../demo/demoConstants";
import { listDemoStoredFiles, removeDemoStoredFile } from "../demo/demoStorage";

export interface StorageDocument {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
  category: string;
  uploadDate: Date;
  createdAt?: Date | string;
}

export const uploadDocument = async (
  _file: File,
  _category: string,
  _clientId: string | null = null,
): Promise<StorageDocument> => {
  throw new Error(DEMO_PDF_DISABLED_MESSAGE);
};

export const getSignedDocumentUrl = async (_path: string): Promise<string> => {
  return "";
};

export const deleteDocument = async (path: string): Promise<void> => {
  removeDemoStoredFile(path);
};

export const listDocumentsByCategory = async (
  category: string,
  clientId: string | null = null,
): Promise<StorageDocument[]> => {
  const prefix = clientId ? `${category}/${clientId}` : category;
  const files = listDemoStoredFiles(prefix);
  return files.map((file) => ({
    name: file.name,
    path: file.path,
    url: "",
    size: file.size,
    type: file.mimetype,
    category: file.category,
    uploadDate: new Date(file.created_at),
    createdAt: new Date(file.created_at),
  }));
};
