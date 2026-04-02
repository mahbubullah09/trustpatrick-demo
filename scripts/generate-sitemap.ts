/**
 * Generates public/sitemap.xml as a static file.
 *
 * Run: npm run sitemap
 *
 * lastModified dates are pulled from git history — so the date only
 * changes when you actually modify locations.ts or services.ts.
 * Safe to run on every deploy.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getAllRegions, getCitiesInRegion, slugify } from '../src/data/locations';
import { services } from '../src/data/services';
import { getAllCompanies } from '../src/data/companies';

const BASE_URL = 'https://trustpatrick.com';

function gitDate(filePath: string): string {
  try {
    const result = execSync(`git log -1 --format="%ci" ${filePath}`, {
      encoding: 'utf-8',
    }).trim();
    // result is like "2026-04-01 15:32:36 +0600" — take just the date part
    const date = result.split(' ')[0];
    // if file is untracked (not yet committed), git log returns empty
    return date || new Date().toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Dates only change when the actual source files change
const locationsDate = gitDate('src/data/locations.ts');
const servicesDate = gitDate('src/data/services.ts');
const companiesDate = gitDate('src/data/companies.json');

// For service pages, use whichever file was updated more recently
const servicePageDate =
  servicesDate > locationsDate ? servicesDate : locationsDate;

function urlEntry(
  loc: string,
  lastmod: string,
  priority: string,
  changefreq: string
): string {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const entries: string[] = [];

// Static pages
entries.push(urlEntry(BASE_URL, servicesDate, '1.0', 'weekly'));
entries.push(urlEntry(`${BASE_URL}/find-contractors`, servicesDate, '0.8', 'weekly'));

const regions = getAllRegions();

for (const region of regions) {
  const rc = region.region_code.toLowerCase();
  const cities = getCitiesInRegion(region.region_code);

  // Region page: /ak
  entries.push(urlEntry(`${BASE_URL}/${rc}`, locationsDate, '0.5', 'monthly'));

  for (const city of cities) {
    const citySlug = slugify(city.city_name);

    // City page: /ak/juneau
    entries.push(
      urlEntry(`${BASE_URL}/${rc}/${citySlug}`, locationsDate, '0.6', 'monthly')
    );

    for (const service of services) {
      // Money page: /ak/juneau/asphalt-paving-companies
      entries.push(
        urlEntry(
          `${BASE_URL}/${rc}/${citySlug}/${service.slug}`,
          servicePageDate,
          '0.8',
          'monthly'
        )
      );
    }
  }
}

// Company profile pages: /pros/bradley-asphalt
for (const company of getAllCompanies()) {
  entries.push(urlEntry(`${BASE_URL}/pros/${company.slug}`, companiesDate, '0.7', 'monthly'));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const outPath = path.join(process.cwd(), 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf-8');

console.log(`✓ Generated ${entries.length} URLs`);
console.log(`✓ locations.ts date : ${locationsDate}`);
console.log(`✓ services.ts date  : ${servicesDate}`);
console.log(`✓ companies.json date: ${companiesDate}`);
console.log(`✓ Saved → public/sitemap.xml`);
