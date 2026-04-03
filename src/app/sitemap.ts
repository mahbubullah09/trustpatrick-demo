import type { MetadataRoute } from 'next';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';
import { services } from '@/data/services';

const BASE_URL = 'https://trustpatrick.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages ─────────────────────────────────────────────
  const staticPages = ['', '/about', '/contact', '/services', '/privacy', '/terms'];
  for (const path of staticPages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: path === '' ? 1.0 : 0.6,
    });
  }

  const regions = getAllRegions();

  // ── State pages (/[region]) ───────────────────────────────────
  for (const r of regions) {
    entries.push({
      url: `${BASE_URL}/${r.region_code.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // ── City + service pages ──────────────────────────────────────
  for (const r of regions) {
    const regionSlug = r.region_code.toLowerCase();
    const cities = getCitiesInRegion(r.region_code);

    for (const c of cities) {
      const citySlug = slugify(c.city_name);

      // City page (/[region]/[city])
      entries.push({
        url: `${BASE_URL}/${regionSlug}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });

      // Service pages (/[region]/[city]/[service])
      for (const s of services) {
        entries.push({
          url: `${BASE_URL}/${regionSlug}/${citySlug}/${s.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
