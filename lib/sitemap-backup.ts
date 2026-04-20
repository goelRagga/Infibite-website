import fs from 'fs';
import path from 'path';
import { MetadataRoute } from 'next';

/**
 * Parses the backup sitemap XML and returns MetadataRoute.Sitemap format.
 * Used as fallback when dynamic sitemap generation or API fails.
 */
export function getBackupSitemap(): MetadataRoute.Sitemap {
  try {
    const backupPath = path.join(process.cwd(), 'public', 'sitemap-prod.xml');
    const xmlContent = fs.readFileSync(backupPath, 'utf-8');

    const urlRegex =
      /<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]*)<\/lastmod>[\s\S]*?<changefreq>([^<]*)<\/changefreq>[\s\S]*?<priority>([^<]*)<\/priority>[\s\S]*?<\/url>/g;

    const backupSitemap: MetadataRoute.Sitemap = [];
    let match;

    while ((match = urlRegex.exec(xmlContent)) !== null) {
      backupSitemap.push({
        url: match[1],
        lastModified: match[2] || undefined,
        changeFrequency: (match[3] as 'daily') || 'daily',
        priority: parseFloat(match[4]) || 0.9,
      });
    }

    return backupSitemap;
  } catch (err) {
    console.error('Failed to load backup sitemap:', err);
    return [];
  }
}
