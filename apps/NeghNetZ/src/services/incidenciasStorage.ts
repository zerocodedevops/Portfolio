import { createDemoFileUrl, removeDemoFiles, resolveDemoFileUrl } from '../demo/demoStorage';

const MAX_IMAGE_COUNT = 3;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/heic']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'heic']);

function safeFileName(name: string) {
  return name.normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'imagen';
}

function validateImages(files: File[]) {
  if (files.length > MAX_IMAGE_COUNT) throw new Error('Puedes adjuntar un máximo de 3 imágenes.');
  for (const file of files) {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_IMAGE_EXTENSIONS.has(extension) || (file.type && !ALLOWED_IMAGE_TYPES.has(file.type))) {
      throw new Error(`${file.name} no es una imagen PNG, JPG o HEIC compatible.`);
    }
    if (file.size > MAX_IMAGE_SIZE) throw new Error(`${file.name} supera el límite de 10 MB.`);
  }
}

export async function uploadIncidentImages(files: File[], userId: string, incidentId: string) {
  validateImages(files);
  const uploadedPaths: string[] = [];
  for (const file of files) {
    const path = `${userId}/${incidentId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    createDemoFileUrl(path, file);
    uploadedPaths.push(path);
  }
  return uploadedPaths;
}

export async function removeIncidentImages(paths: string[]) {
  if (!paths.length) return;
  removeDemoFiles(paths);
}

export async function getIncidentImageSignedUrl(pathOrUrl: string, _expiresInSeconds = 3600): Promise<string> {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return resolveDemoFileUrl(pathOrUrl) || '';
}

export async function getIncidentImagesSignedUrls(pathsOrUrls: string[], expiresInSeconds = 3600): Promise<string[]> {
  return Promise.all(pathsOrUrls.map((item) => getIncidentImageSignedUrl(item, expiresInSeconds)));
}
