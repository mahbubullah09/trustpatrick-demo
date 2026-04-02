import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';
import { services } from '@/data/services';
import SearchWidget from '@/components/search/SearchWidget';
import SearchHydrator from '@/components/search/SearchHydrator';

interface Props {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  return getAllRegions().map((r) => ({ region: r.region_code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region } = await params;
  const regions = getAllRegions();
  const found = regions.find((r) => r.region_code.toLowerCase() === region);
  if (!found) return {};
  return {
    title: `Driveway Contractors in ${found.region_name}`,
    description: `Find vetted asphalt and concrete driveway contractors across ${found.region_name}. Browse cities and compare local pros.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { region } = await params;
  const regions = getAllRegions();
  const regionData = regions.find((r) => r.region_code.toLowerCase() === region);
  if (!regionData) notFound();

  const cities = getCitiesInRegion(regionData.region_code).sort((a, b) =>
    a.city_name.localeCompare(b.city_name)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-brand-gray mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">{regionData.region_name}</span>
      </nav>

      <h1 className="section-title mb-2">
        Driveway Contractors in {regionData.region_name}
      </h1>
      <p className="text-brand-gray mb-8">
        Browse {cities.length} cities in {regionData.region_name} and find vetted asphalt and concrete driveway professionals near you.
      </p>

      {/* Hydrate Redux with current region so SearchWidget knows state is pre-selected */}
      <SearchHydrator
        regionCode={regionData.region_code}
        regionName={regionData.region_name}
        citySlug=""
        cityName=""
        serviceSlug=""
      />

      {/* Inline search (pre-filtered to this state — no state dropdown shown) */}
      <div className="bg-brand-light rounded-xl p-6 mb-10">
        <p className="font-semibold text-brand-navy mb-4">Search within {regionData.region_name}</p>
        <SearchWidget hideRegion />
      </div>

      {/* Cities grid */}
      <h2 className=" font-bold text-xl text-brand-navy mb-5">
        Cities in {regionData.region_name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cities.map((city) => (
          <Link
            key={city.city_name}
            href={`/${region}/${slugify(city.city_name)}`}
            className="card px-4 py-3 text-sm font-medium text-brand-navy hover:text-brand-action hover:border-brand-action transition-colors"
          >
            {city.city_name}
          </Link>
        ))}
      </div>

      {/* Services quick links */}
      <div className="mt-12 border-t border-gray-100 pt-8">
        <h2 className=" font-bold text-xl text-brand-navy mb-5">
          Services Available in {regionData.region_name}
        </h2>
        <div className="flex flex-wrap gap-3">
          {services.map((s) =>
            cities.map((c) => (
              <Link
                key={`${c.city_name}-${s.slug}`}
                href={`/${region}/${slugify(c.city_name)}/${s.slug}`}
                className="text-sm bg-brand-light text-brand-action border border-brand-action/20 px-3 py-1.5 rounded-full hover:bg-brand-action hover:text-white transition-colors"
              >
                {s.name} in {c.city_name}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
