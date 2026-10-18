import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [configArgument, htmlDirectoryArgument] = process.argv.slice(2);

if (!configArgument || !htmlDirectoryArgument) {
  console.error('Usage: node sync-csp-inline-script-hashes.mjs <firebase.json> <html-directory>');
  process.exit(1);
}

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(repositoryRoot, configArgument);
const htmlDirectory = resolve(repositoryRoot, htmlDirectoryArgument);

async function getHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return getHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  }));

  return nestedFiles.flat();
}

const htmlFiles = await getHtmlFiles(htmlDirectory);
const inlineScriptHashes = new Set();
const scriptTagPattern = /<script\b(?<attributes>[^>]*)>(?<body>[\s\S]*?)<\/script\s*>/gi;

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');

  for (const scriptTag of html.matchAll(scriptTagPattern)) {
    if (/\bsrc\s*=/i.test(scriptTag.groups.attributes)) continue;

    const body = scriptTag.groups.body;
    if (!body.trim()) continue;

    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    inlineScriptHashes.add(`'sha256-${digest}'`);
  }
}

if (htmlFiles.length === 0 || inlineScriptHashes.size === 0) {
  throw new Error(`No inline scripts found under ${htmlDirectory}; CSP was not changed.`);
}

const firebaseConfig = JSON.parse(await readFile(configPath, 'utf8'));
const hostingEntries = Array.isArray(firebaseConfig.hosting)
  ? firebaseConfig.hosting
  : [firebaseConfig.hosting];
let changed = false;

for (const hostingEntry of hostingEntries) {
  for (const headerRule of hostingEntry?.headers ?? []) {
    for (const header of headerRule.headers ?? []) {
      if (header.key?.toLowerCase() !== 'content-security-policy') continue;
      if (!/script-src\s+[^;]+/.test(header.value)) {
        throw new Error(`No script-src directive found in ${configPath}.`);
      }

      const updatedPolicy = header.value.replace(/script-src\s+([^;]+)/, (_directive, sources) => {
        const stableSources = sources
          .split(/\s+/)
          .filter((source) => source && !/^'sha256-[^']+'$/.test(source));
        return `script-src ${[...stableSources, ...inlineScriptHashes].join(' ')}`;
      });

      if (updatedPolicy !== header.value) {
        header.value = updatedPolicy;
        changed = true;
      }
    }
  }
}

if (!changed) {
  console.log(`${configPath}: CSP hashes already match ${htmlFiles.length} HTML files.`);
} else {
  await writeFile(configPath, `${JSON.stringify(firebaseConfig, null, 2)}\n`);
  console.log(`${configPath}: synced ${inlineScriptHashes.size} inline-script hashes from ${htmlFiles.length} HTML files.`);
}
