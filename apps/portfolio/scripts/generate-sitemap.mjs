import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const DOMAIN = 'https://zerocode-devops.com';
const OUTPUT_FILE = 'public/sitemap.xml';

// Emular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function generateSitemap() {
  console.log('🚀 Iniciando generación de sitemap.xml...');

  const staticRoutes = [
    { url: '/' },
    { url: '/precios-paginas-web' },
    { url: '/aviso-legal' },
    { url: '/politica-de-privacidad' },
    { url: '/politica-de-cookies' },
    { url: '/casos-de-exito/reformas-zerochaos' },
    { url: '/casos-de-exito/mudanzas-zerodelay' },
    { url: '/proyectos/zerovanity' },
    { url: '/proyectos/zero-breakdown' },
    { url: '/proyectos/zero-breakdown/fontaneria' },
    { url: '/proyectos/zero-breakdown/electricidad' },
    { url: '/proyectos/zero-breakdown/climatizacion' },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
  </url>`).join('\n')}
</urlset>`;

  // 3. Escribir el archivo
  const outputPath = path.join(projectRoot, OUTPUT_FILE);
  fs.writeFileSync(outputPath, sitemapXml);

  console.log(`✅ Sitemap generado con éxito en: ${OUTPUT_FILE}`);
  console.log(`📊 Total de URLs indexadas: ${staticRoutes.length}`);
}

try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generando el sitemap:', error);
  process.exit(1);
}
