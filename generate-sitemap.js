import axios from 'axios';
import fs from 'fs';

const API_BASE_URL = 'https://www.sankavollerei.com/anime';
const SITE_URL = 'https://pokenime.izzprjct.eu.org';

async function generateSitemap() {
  console.log('⏳ Sedang mengambil data anime dari API...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/unlimited`);
    const directory = response.data.data.list;
    
    let urls = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/ongoing', priority: '0.9', changefreq: 'daily' },
      { path: '/completed', priority: '0.8', changefreq: 'weekly' },
      { path: '/schedule', priority: '0.8', changefreq: 'daily' },
      { path: '/directory', priority: '0.7', changefreq: 'weekly' },
      { path: '/genres', priority: '0.6', changefreq: 'monthly' },
    ];

    // Tambahkan ribuan URL anime dari direktori
    directory.forEach(group => {
      group.animeList.forEach(anime => {
        urls.push({
          path: `/anime/${anime.animeId}`,
          priority: '0.6',
          changefreq: 'weekly'
        });
      });
    });

    console.log(`✅ Berhasil mengambil ${urls.length} URL.`);

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${SITE_URL}${url.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync('public/sitemap.xml', sitemapXml);
    console.log('🚀 File public/sitemap.xml berhasil diperbarui!');
  } catch (error) {
    console.error('❌ Gagal men-generate sitemap:', error.message);
  }
}

generateSitemap();
