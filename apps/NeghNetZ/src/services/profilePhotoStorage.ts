import { createDemoFileUrl, removeDemoFiles, resolveDemoFileUrl } from '../demo/demoStorage';

const PROFILE_PHOTO_PREFIX = 'demo-profile:';
const PROFILE_PHOTO_MAX_SIZE = 5 * 1024 * 1024;
const PROFILE_PHOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

export function isProfilePhotoReference(value: string) {
  return value.startsWith(PROFILE_PHOTO_PREFIX);
}

function pathFromReference(reference: string) {
  return reference.slice(PROFILE_PHOTO_PREFIX.length);
}

export async function resolveProfilePhotoUrl(reference: string) {
  if (!isProfilePhotoReference(reference)) return reference;
  return resolveDemoFileUrl(pathFromReference(reference)) || '';
}

export async function uploadProfilePhoto(file: File, userId: string) {
  const extension = PROFILE_PHOTO_TYPES[file.type];
  if (!extension) throw new Error('Elige una imagen JPG, PNG o WebP.');
  if (file.size > PROFILE_PHOTO_MAX_SIZE) throw new Error('La imagen debe pesar menos de 5 MB.');

  const path = `${userId}/profile/${crypto.randomUUID()}.${extension}`;
  createDemoFileUrl(path, file);

  return `${PROFILE_PHOTO_PREFIX}${path}`;
}

export async function removeProfilePhoto(reference: string) {
  if (!isProfilePhotoReference(reference)) return;
  removeDemoFiles([pathFromReference(reference)]);
}
