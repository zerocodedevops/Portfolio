import { createDemoFileUrl, removeDemoFiles, resolveDemoFileUrl } from '../demo/demoStorage';

// Reuse the configured community image bucket; community paths stay separate
// from incident paths inside it (userId/community-postId/...).
const COMMUNITY_IMAGES_BUCKET = 'incidencias';
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

export async function uploadCommunityImages(files: File[], userId: string, postId: string) {
  validateImages(files);
  const uploadedPaths: string[] = [];
  for (const file of files) {
    const path = `${userId}/comunidad-${postId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    createDemoFileUrl(path, file);
    uploadedPaths.push(path);
  }
  return uploadedPaths;
}

export async function getCommunityImageUrl(path: string) {
  return resolveDemoFileUrl(path) || '';
}

export async function removeCommunityImages(paths: string[]) {
  if (!paths.length) return;
  removeDemoFiles(paths);
}
