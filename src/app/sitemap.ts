import type { MetadataRoute } from 'next';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';
import { services } from '@/data/services';

const BASE_URL = 'https://trustpatrick.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage
  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Find contractors page
  entries.push({
    url: `${BASE_URL}/find-contractors`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  const regions = getAllRegions();

  for (const region of regions) {
    const rc = region.region_code.toLowerCase();
    const cities = getCitiesInRegion(region.region_code);

    // Region page: /ak
    entries.push({
      url: `${BASE_URL}/${rc}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    for (const city of cities) {
      const citySlug = slugify(city.city_name);

      // City page: /ak/juneau
      entries.push({
        url: `${BASE_URL}/${rc}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });

      for (const service of services) {
        // Service landing page: /ak/juneau/asphalt-paving-companies
        entries.push({
          url: `${BASE_URL}/${rc}/${citySlug}/${service.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9, // Highest priority — these are the money pages
        });
      }
    }
  }

  return entries;
}
