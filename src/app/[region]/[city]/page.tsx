import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, getLocation, slugify } from '@/data/locations';
import { services } from '@/data/services';

interface Props {
  params: Promise<{ region: string; city: string }>;
}

export async function generateStaticParams() {
  const params: { region: string; city: string }[] = [];
  for (const r of getAllRegions()) {
    for (const c of getCitiesInRegion(r.region_code)) {
      params.push({
        region: r.region_code.toLowerCase(),
        city: slugify(c.city_name),
      });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city } = await params;
  const loc = getLocation(region, city);
  if (!loc) return {};
  return {
    title: `Driveway Contractors in ${loc.city_name}, ${loc.region_name}`,
    description: `Find vetted asphalt and concrete driveway contractors in ${loc.city_name}, ${loc.region_name}. Compare local pros and get free estimates.`,
  };
}

export default async function CityPage({ params }: Props) {
  const { region, city } = await params;
  const loc = getLocation(region, city);
  if (!loc) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-brand-gray mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href={`/${region}`} className="hover:text-brand-action">{loc.region_name}</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">{loc.city_name}</span>
      </nav>

      <h1 className="section-title mb-2">
        Driveway Contractors in {loc.city_name}, {loc.region_name}
      </h1>
      <p className="text-brand-gray mb-10">
        Find trusted driveway professionals in {loc.city_name}. Select a service below to compare vetted contractors and get free estimates.
      </p>

      {/* Service selection */}
      <h2 className=" font-bold text-xl text-brand-navy mb-5">
        Choose a Service in {loc.city_name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/${region}/${city}/${s.slug}`}
            className="card p-6 group flex flex-col"
          >
            <h3 className=" font-bold text-brand-navy text-lg mb-2 group-hover:text-brand-action transition-colors">
              {s.name} in {loc.city_name}
            </h3>
            <p className="text-sm text-brand-gray mb-4 flex-1">
              Compare vetted {s.name.toLowerCase()} contractors serving {loc.city_name}, {loc.region_code}.
            </p>
            <span className="btn-primary text-sm self-start py-2">
              Find {s.name} Pros →
            </span>
          </Link>
        ))}
      </div>

      {/* Zip codes served */}
      <div className="mt-10 bg-brand-light rounded-xl p-6">
        <h2 className=" font-bold text-brand-navy mb-3">
          Areas We Serve in {loc.city_name}
        </h2>
        <p className="text-sm text-brand-gray mb-3">
          We connect homeowners across the following zip codes in {loc.city_name}:
        </p>
        <div className="flex flex-wrap gap-2">
          {loc.zipcodes.map((zip) => (
            <span key={zip} className="text-xs bg-white border border-gray-200 text-brand-gray px-2 py-1 rounded-md font-mono">
              {zip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
