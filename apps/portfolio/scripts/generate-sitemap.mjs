import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN ---
const DOMAIN = 'https://zerocode-devops.com';
const PUBLIC_DIR = 'public';
const ARTICLES_FILE = 'src/data/articles.ts';
const OUTPUT_FILE = 'public/sitemap.xml';

// Emular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function generateSitemap() {
  console.log('🚀 Iniciando generación de sitemap.xml...');

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/desarrollo-web-pymes-madrid', priority: '0.9', changefreq: 'weekly' },
    { url: '/disenador-web-freelance-madrid', priority: '0.8', changefreq: 'weekly' },
    { url: '/precios-paginas-web', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio', priority: '0.7', changefreq: 'weekly' },
    { url: '/tech', priority: '0.7', changefreq: 'weekly' },
  ];

  // 1. Extraer los IDs de los artículos usando Regex (para evitar problemas de tipos/importación en el script)
  const articlesPath = path.join(projectRoot, ARTICLES_FILE);
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8');
  
  // Buscamos patrones como "id: 4," en el array de artículos
  const idRegex = /id:\s*(\d+),/g;
  const articleIds = [];
  let match;
  while ((match = idRegex.exec(articlesContent)) !== null) {
    articleIds.push(match[1]);
  }

  // Eliminar duplicados si los hay y mapear a rutas
  const dynamicRoutes = [...new Set(articleIds)].map(id => ({
    url: `/blog/${id}`,
    priority: '0.6',
    changefreq: 'monthly'
  }));

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // 2. Construir el XML
  const today = new Date().toISOString().split('T')[0];
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // 3. Escribir el archivo
  const outputPath = path.join(projectRoot, OUTPUT_FILE);
  fs.writeFileSync(outputPath, sitemapXml);

  console.log(`✅ Sitemap generado con éxito en: ${OUTPUT_FILE}`);
  console.log(`📊 Total de URLs indexadas: ${allRoutes.length}`);
}

try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generando el sitemap:', error);
  process.exit(1);
}
