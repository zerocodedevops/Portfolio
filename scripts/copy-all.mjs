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
