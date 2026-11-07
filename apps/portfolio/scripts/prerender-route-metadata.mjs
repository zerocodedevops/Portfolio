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
    title: 'Presupuesto de diseño web y demo | ZeroCode',
    description: 'Pide una propuesta visual previa en 48h sin compromiso. Nos adaptamos al presupuesto de tu negocio.',
  },
  {
    path: '/proyectos/zerovanity',
    title: 'Demo web para peluquería y estética | ZeroVanity | ZeroCode',
    description: 'Explora ZeroVanity, una demo interactiva para peluquería y estética. Recorrido de reserva simulado, sin base de datos ni almacenamiento de información.',
  },
  {
    path: '/proyectos/zero-breakdown',
    title: 'Zero Breakdown · Fontanería, electricidad y climatización',
    description: 'Elige una especialidad y explora servicios de fontanería, electricidad y climatización para casa y negocio.',
  },
  {
    path: '/proyectos/zero-breakdown/fontaneria',
    title: 'Fontanería para casa y negocio | Zero Breakdown',
    description: 'Servicios de fontanería: fugas y tuberías, grifos y sanitarios, desagües, baños, cocinas y agua caliente.',
  },
  {
    path: '/proyectos/zero-breakdown/electricidad',
    title: 'Electricidad para viviendas y negocios | Zero Breakdown',
    description: 'Instalaciones eléctricas, cuadros, reformas, iluminación, enchufes y revisión de averías.',
  },
  {
    path: '/proyectos/zero-breakdown/climatizacion',
    title: 'Climatización para casa y negocio | Zero Breakdown',
    description: 'Aire acondicionado, calefacción, bombas de calor, ventilación y mantenimiento de equipos.',
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
