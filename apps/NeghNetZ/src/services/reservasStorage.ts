import { createDemoFileUrl, removeDemoFiles, resolveDemoFileUrl } from '../demo/demoStorage';

const REFERENCE_PREFIX = 'demo-reserva:';
const MAX_SIZE = 8 * 1024 * 1024;
const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function pathFromReference(reference: string) {
  return reference.slice(REFERENCE_PREFIX.length);
}

export function isReservationPhotoReference(value: string) {
  return value.startsWith(REFERENCE_PREFIX);
}

export async function uploadReservationZonePhoto(file: File, uid: string, communityId: string, zoneId: string) {
  const extension = MIME_EXTENSIONS[file.type];
  if (!extension) throw new Error('La imagen debe ser JPG, PNG o WebP.');
  if (file.size > MAX_SIZE) throw new Error('La imagen debe pesar menos de 8 MB.');
  if (!uid || !communityId || !zoneId) throw new Error('Faltan datos de la comunidad para guardar la fotografía.');

  const path = `${uid}/reservas/zonas/${communityId}/${zoneId}/${crypto.randomUUID()}.${extension}`;
  createDemoFileUrl(path, file);
  return `${REFERENCE_PREFIX}${path}`;
}

export async function resolveReservationZonePhoto(reference: string) {
  if (!reference) return '';
  if (reference.startsWith('/') || reference.startsWith('blob:') || reference.startsWith('data:')) return reference;
  if (!isReservationPhotoReference(reference)) return resolveDemoFileUrl(reference) || reference;
  return resolveDemoFileUrl(pathFromReference(reference)) || '';
}

export async function removeReservationZonePhoto(reference: string) {
  if (!isReservationPhotoReference(reference)) return;
  removeDemoFiles([pathFromReference(reference)]);
}
