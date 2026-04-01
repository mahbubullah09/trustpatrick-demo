import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';
import { services } from '@/data/services';

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return getAllRegions().map((r) => ({ region: r.region_code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const found = getAllRegions().find((r) => r.region_code.toLowerCase() === region);
  if (!found) return {};
  return {
    title: `${found.region_name} Sitemap — TrustPatrick`,
    description: `All cities and contractor service pages in ${found.region_name} on TrustPatrick.`,
    alternates: { canonical: `https://trustpatrick.com/sitemap-page/${region}` },
  };
}

export default async function StateSitemapPage({ params }: Props) {
  const { region } = await params;
  const allRegions = getAllRegions();
  const regionData = allRegions.find((r) => r.region_code.toLowerCase() === region);
  if (!regionData) notFound();

  const cities = getCitiesInRegion(regionData.region_code).sort((a, b) =>
    a.city_name.localeCompare(b.city_name)
  );

  // Group cities alphabetically
  const grouped = new Map<string, typeof cities>();
  for (const city of cities) {
    const letter = city.city_name[0].toUpperCase();
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter)!.push(city);
  }
  const groupedEntries = Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-brand-gray mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-blue">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-blue">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">{regionData.region_name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">{regionData.region_name} Sitemap</h1>
        <p className="text-brand-gray">
          {cities.length} {cities.length === 1 ? 'city' : 'cities'} &middot;&nbsp;
          {cities.length * services.length} service pages in {regionData.region_name}.
        </p>
      </div>

      {/* State page link */}
      <div className="bg-brand-light rounded-xl p-5 mb-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-brand-navy text-sm">
            {regionData.region_name} Contractor Directory
          </p>
          <p className="text-xs text-brand-gray mt-0.5">
            Browse all contractors and cities in {regionData.region_name}
          </p>
        </div>
        <Link
          href={`/${region}`}
          className="btn-primary text-sm shrink-0"
        >
          View {regionData.region_name} →
        </Link>
      </div>

      {/* Cities with service links */}
      {groupedEntries.map(([letter, letterCities]) => (
        <div key={letter} className="mb-10">
          {/* Letter divider */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-brand-navy text-white font-heading font-black text-sm flex items-center justify-center shrink-0">
              {letter}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="space-y-5">
            {letterCities.map((city) => {
              const citySlug = slugify(city.city_name);
              const label    = city.is_county ? 'County' : 'City';
              return (
                <div key={city.city_name} className="card p-5">
                  {/* City header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <Link
                        href={`/${region}/${citySlug}`}
                        className="font-heading font-bold text-brand-navy hover:text-brand-blue text-base"
                      >
                        {city.city_name}
                      </Link>
                      <span className="ml-2 text-xs text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                        {label}
                      </span>
                      <p className="text-xs text-brand-gray mt-0.5">
                        {regionData.region_name} &middot; {city.zipcodes.length} zip {city.zipcodes.length === 1 ? 'code' : 'codes'}
                      </p>
                    </div>
                    <Link
                      href={`/${region}/${citySlug}`}
                      className="text-xs text-brand-blue hover:underline shrink-0"
                    >
                      City page →
                    </Link>
                  </div>

                  {/* Service links */}
                  <div className="flex flex-wrap gap-2">
                    {services.map((svc) => (
                      <Link
                        key={svc.slug}
                        href={`/${region}/${citySlug}/${svc.slug}`}
                        className="text-xs bg-brand-light text-brand-blue border border-blue-100
                          px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors"
                      >
                        {svc.shortName} in {city.city_name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Back link */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <Link href="/sitemap-page" className="text-sm text-brand-blue hover:underline flex items-center gap-1">
          ← Back to full sitemap
        </Link>
      </div>
    </div>
  );
}
