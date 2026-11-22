/**
 * Almacenamiento local en memoria para archivos e imágenes de la DEMO.
 * Reemplaza por completo a Firebase Storage y Supabase Storage sin red ni persistencia.
 */

const objectUrlsByPath = new Map<string, string>();
const staticSvgCache = new Map<string, string>();

function buildLocalPlaceholderSvg(title: string, subtitle: string, bg: string, fg: string): string {
  const key = `${title}|${subtitle}|${bg}|${fg}`;
  const cached = staticSvgCache.get(key);
  if (cached) return cached;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
  <rect width="800" height="480" rx="20" fill="${bg}"/>
  <rect x="28" y="28" width="744" height="424" rx="14" fill="none" stroke="${fg}" stroke-opacity="0.22" stroke-width="2"/>
  <text x="400" y="220" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" fill="${fg}">${title}</text>
  <text x="400" y="266" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="${fg}" fill-opacity="0.78">${subtitle}</text>
</svg>`;
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  staticSvgCache.set(key, dataUri);
  return dataUri;
}

export function createDemoFileUrl(path: string, file: File): string {
  const previous = objectUrlsByPath.get(path);
  if (previous && previous.startsWith('blob:')) {
    URL.revokeObjectURL(previous);
  }
  const url = URL.createObjectURL(file);
  objectUrlsByPath.set(path, url);
  return url;
}

export function resolveDemoFileUrl(pathOrUrl: string | undefined | null): string | null {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('blob:') || pathOrUrl.startsWith('data:') || pathOrUrl.startsWith('/')) {
    return pathOrUrl;
  }
  const stored = objectUrlsByPath.get(pathOrUrl);
  if (stored) return stored;

  if (pathOrUrl.includes('padel')) {
    return buildLocalPlaceholderSvg('Pista de Pádel', 'Zona común · Comunidad Demo NeighNet', '#0f766e', '#ecfeff');
  }
  if (pathOrUrl.includes('piscina')) {
    return buildLocalPlaceholderSvg('Piscina Comunitaria', 'Zona común · Comunidad Demo NeighNet', '#0369a1', '#e0f2fe');
  }
  if (pathOrUrl.includes('sala')) {
    return buildLocalPlaceholderSvg('Sala Social', 'Zona común · Comunidad Demo NeighNet', '#4338ca', '#eef2ff');
  }
  if (pathOrUrl.includes('doc') || pathOrUrl.endsWith('.pdf')) {
    return buildLocalPlaceholderSvg('Documento de Muestra', 'Vista previa generada en memoria (DEMO)', '#1e293b', '#f8fafc');
  }

  return buildLocalPlaceholderSvg('Archivo Demo NeighNet', 'Recurso local en memoria', '#334155', '#f1f5f9');
}

export function removeDemoFiles(paths: string[]): void {
  for (const path of paths) {
    const url = objectUrlsByPath.get(path);
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    objectUrlsByPath.delete(path);
  }
}

export interface DemoUploadTaskSnapshot {
  ref: { fullPath: string };
  bytesTransferred: number;
  totalBytes: number;
}

export function uploadDemoFileResumable(
  path: string,
  file: File,
  onProgress?: (snapshot: DemoUploadTaskSnapshot) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): void {
  try {
    createDemoFileUrl(path, file);
    const snapshot: DemoUploadTaskSnapshot = {
      ref: { fullPath: path },
      bytesTransferred: file.size || 100,
      totalBytes: file.size || 100,
    };
    setTimeout(() => {
      onProgress?.(snapshot);
      onComplete?.();
    }, 30);
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error('Error al simular subida local'));
  }
}

export async function getDemoDownloadURL(refOrPath: { fullPath: string } | string): Promise<string> {
  const path = typeof refOrPath === 'string' ? refOrPath : refOrPath.fullPath;
  return resolveDemoFileUrl(path) || '';
}
