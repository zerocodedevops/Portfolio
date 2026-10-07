import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DOMAIN = 'https://zerocode-devops.com';
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, '..');
const distDirectory = path.join(appDirectory, 'dist');
const templatePath = path.join(distDirectory, 'index.html');

const staticPages = [
  {
    path: '/aviso-legal',
    title: 'Aviso legal | ZeroCode DevOps',
    description: 'Datos del titular, condiciones de uso y responsabilidad del sitio de ZeroCode DevOps.',
  },
  {
    path: '/politica-de-privacidad',
    title: 'Política de privacidad | ZeroCode DevOps',
    description: 'Información sobre el tratamiento de datos personales al contactar con ZeroCode DevOps.',
  },
  {
    path: '/politica-de-cookies',
    title: 'Política de cookies | ZeroCode DevOps',
    description: 'Cookies, almacenamiento local y preferencias de medición de ZeroCode DevOps.',
  },
  {
    path: '/precios-paginas-web',
    title: 'Precio de diseño web desde 400 € más IVA | ZeroCode',
    description: 'Qué incluye la web de una página de ZeroCode desde 400 € más IVA: Inicio y Contacto, WhatsApp, adaptación móvil, dominio, hosting por un año y SSL.',
  },
  {
    path: '/casos-de-exito/reformas-zerochaos',
    title: 'Web para ZeroChaos, demo de reformas | ZeroCode',
    description: 'Explora el proyecto ZeroChaos, una demo web para servicios de reformas creada por ZeroCode.',
  },
  {
    path: '/casos-de-exito/mudanzas-zerodelay',
    title: 'Web para ZeroDelay, demo de mudanzas | ZeroCode',
    description: 'Explora el proyecto ZeroDelay, una demo web para servicios de mudanzas creada por ZeroCode.',
  },
];

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceMeta(html, attribute, name, content) {
  const expression = new RegExp(`<meta\\s+${attribute}="${name}"[\\s\\S]*?/>`);
  const normalizedContent = content.replace(/\s+/g, ' ').trim();
  const tag = `<meta ${attribute}="${name}" content="${escapeHtml(normalizedContent)}" />`;

  if (expression.test(html)) return html.replace(expression, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function createRouteHtml(template, page) {
  const canonicalUrl = `${DOMAIN}${page.path}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.description);
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.description);

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  if (/<link\s+rel="canonical"[^>]*\/>/.test(html)) {
    html = html.replace(/<link\s+rel="canonical"[^>]*\/>/, canonicalTag);
  } else {
    html = html.replace('</head>', `    ${canonicalTag}\n  </head>`);
  }

  return html;
}

function generateRouteMetadata() {
  if (!fs.existsSync(templatePath)) {
    throw new Error('Production index.html not found. Run vite build first.');
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  // Only emit metadata for routes that remain publicly accessible. Legacy
  // articles and service URLs are redirected by Firebase and must not be
  // recreated as stale, indexable pages during the build.
  const pages = staticPages;

  for (const page of pages) {
    const outputDirectory = path.join(distDirectory, page.path.replace(/^\/+/, ''));
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(outputDirectory, 'index.html'),
      createRouteHtml(template, page),
    );
  }

  console.log(`✅ Route metadata generated for ${pages.length + 1} pages.`);
}

try {
  generateRouteMetadata();
} catch (error) {
  console.error('❌ Error generating route metadata:', error);
  process.exit(1);
}
