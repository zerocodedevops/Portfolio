import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'zerodelay'), { recursive: true });
await mkdir(path.join(output, 'reformas'), { recursive: true });
await cp(path.join(root, 'apps/portfolio/dist'), output, { recursive: true });
await cp(path.join(root, 'apps/zerodelay/dist'), path.join(output, 'zerodelay'), { recursive: true });
await cp(path.join(root, 'apps/zero-chaos/build/client'), path.join(output, 'reformas'), { recursive: true });

// Copiar apps estáticas de apps/ a dist/proyectos/
await mkdir(path.join(output, 'proyectos'), { recursive: true });
await mkdir(path.join(output, 'proyectos/neighnet'), { recursive: true });
await cp(path.join(root, 'apps/NeghNetZ/dist'), path.join(output, 'proyectos/neighnet'), { recursive: true });
await cp(path.join(root, 'apps/zeroplague'), path.join(output, 'proyectos/zeroplague'), { recursive: true });
await cp(path.join(root, 'apps/zeroatelier'), path.join(output, 'proyectos/zeroatelier'), { recursive: true });
await cp(path.join(root, 'apps/zerorisk'), path.join(output, 'proyectos/zerorisk'), { recursive: true });
// Compatibilidad con URLs directas previas
await cp(path.join(root, 'apps/zeroatelier/index.html'), path.join(output, 'proyectos/zeroatelier.html'));
await cp(path.join(root, 'apps/zerorisk/index.html'), path.join(output, 'proyectos/zerorisk.html'));
