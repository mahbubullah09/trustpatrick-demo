import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';

export const metadata: Metadata = {
  title: 'Cities — Sitemap | TrustPatrick',
};

export default function CitiesSitemap() {
  const allRegions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));

  const grouped = allRegions.map((r) => ({
    region: r,
    cities: getCitiesInRegion(r.region_code).sort((a, b) => a.city_name.localeCompare(b.city_name)),
  })).filter((g) => g.cities.length > 0);

  const totalCities = grouped.reduce((sum, g) => sum + g.cities.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-action">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">Cities</span>
      </nav>
      <h1 className="section-title mb-2">Cities</h1>
      <p className="text-brand-gray mb-10">{totalCities.toLocaleString()} cities across {allRegions.length} states</p>

      <div className="space-y-10">
        {grouped.map(({ region, cities }) => (
          <div key={region.region_code}>
            <div className="flex items-center gap-3 mb-4">
              <Link href={`/${region.region_code.toLowerCase()}`}
                className=" font-bold text-brand-navy hover:text-brand-action transition-colors text-lg">
                {region.region_name}
              </Link>
              <span className="text-xs text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                {cities.length} cities
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link key={c.city_name}
                  href={`/${region.region_code.toLowerCase()}/${slugify(c.city_name)}`}
                  className="text-sm text-brand-action hover:text-white hover:bg-brand-action border border-brand-action/30 bg-brand-light px-3 py-1.5 rounded-full transition-colors">
                  {c.city_name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
