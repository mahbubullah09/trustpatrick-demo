import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, getLocation, slugify } from '@/data/locations';
import { getService, fillTemplate, services } from '@/data/services';
import { fetchFeaturedExperts } from '@/lib/api';
import { serviceTemplates } from '@/components/service-templates';
import SearchWidget from '@/components/search/SearchWidget';
import SearchHydrator from '@/components/search/SearchHydrator';

interface Props {
  params: Promise<{ region: string; city: string; service: string }>;
}

export async function generateStaticParams() {
  const params: { region: string; city: string; service: string }[] = [];
  for (const r of getAllRegions()) {
    for (const c of getCitiesInRegion(r.region_code)) {
      for (const s of services) {
        params.push({
          region: r.region_code.toLowerCase(),
          city: slugify(c.city_name),
          service: s.slug,
        });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region, city, service } = await params;
  const loc = getLocation(region, city);
  const svc = getService(service);
  if (!loc || !svc) return {};

  const title       = fillTemplate(svc.h1Template, loc.city_name, loc.region_name);
  const description = fillTemplate(svc.description, loc.city_name, loc.region_name);

  return {
    title,
    description,
    openGraph: { title, description, url: `https://trustpatrick.com/${region}/${city}/${service}` },
    alternates: { canonical: `https://trustpatrick.com/${region}/${city}/${service}` },
  };
}

export default async function ServiceLandingPage({ params }: Props) {
  const { region, city, service } = await params;

  const loc = getLocation(region, city);
  const svc = getService(service);

  if (!loc || !svc) notFound();

  // Server-side fetch — result is passed to ExpertsGrid which hydrates the Redux store
  const initialExperts = await fetchFeaturedExperts(loc.zipcodes, svc.serviceCategoryCodes);

  console.log(initialExperts)

  // Stable cache key for this exact page
  const cacheKey = `${region}/${city}/${service}`;

  const h1    = fillTemplate(svc.h1Template, loc.city_name, loc.region_name);
  const intro = fillTemplate(svc.introParagraph, loc.city_name, loc.region_name);

  const nearbyCities = getCitiesInRegion(loc.region_code)
    .filter((c) => slugify(c.city_name) !== city)
    .slice(0, 6);

  return (
    <div className="bg-white">
      {/*
        SearchHydrator: tiny 'use client' component that dispatches hydrateSearch()
        on mount so the search widget sidebar reflects the current page's selections.
      */}
      <SearchHydrator
        regionCode={loc.region_code}
        regionName={loc.region_name}
        citySlug={city}
        cityName={loc.city_name}
        serviceSlug={service}
      />

      {/* Hero */}
      <div className="bg-hero-gradient text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-white/75 mb-4 flex items-center gap-1 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href={`/${region}`} className="hover:text-white">{loc.region_name}</Link>
            <span>/</span>
            <Link href={`/${region}/${city}`} className="hover:text-white">{loc.city_name}</Link>
            <span>/</span>
            <span className="text-white font-medium">{svc.name}</span>
          </nav>
          <h1 className=" text-3xl md:text-4xl font-black mb-3 leading-tight">{h1}</h1>
          <p className="text-white/75 text-lg max-w-2xl">{intro.slice(0, 160)}…</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-10">

            {(() => {
              const Template = serviceTemplates[service];
              if (!Template) return null;
              return (
                <Template
                  city={loc.city_name}
                  region={loc.region_name}
                  regionCode={loc.region_code}
                  initialExperts={initialExperts}
                  zipCodes={loc.zipcodes}
                  serviceCategoryCodes={svc.serviceCategoryCodes}
                  ctaText={svc.ctaText}
                  cacheKey={cacheKey}
                />
              );
            })()}

            {/* Zip codes served */}
            <section className="bg-brand-light rounded-xl p-6">
              <h2 className=" font-bold text-brand-navy mb-2 text-lg">
                Areas Served in {loc.city_name}
              </h2>
              <p className="text-sm text-brand-gray mb-3">
                Our contractor network covers the following zip codes in {loc.city_name}, {loc.region_code}:
              </p>
              <div className="flex flex-wrap gap-2">
                {loc.zipcodes.map((zip) => (
                  <span key={zip}
                    className="text-xs bg-white border border-gray-200 text-brand-gray px-2 py-1 rounded-md font-mono">
                    {zip}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">

            {/* Refine search — SearchWidget reads/writes Redux */}
            <div className="card p-5">
              <h3 className=" font-bold text-brand-navy mb-4 text-base">
                Refine Your Search
              </h3>
              <SearchWidget compact />
            </div>

            {/* Other services in this city */}
            <div className="card p-5">
              <h3 className=" font-bold text-brand-navy mb-4 text-base">
                Other Services in {loc.city_name}
              </h3>
              <ul className="space-y-2">
                {services.filter((s) => s.slug !== service).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/${region}/${city}/${s.slug}`}
                      className="text-sm text-brand-action hover:underline">
                      → {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust block */}
            <div className="bg-brand-navy text-white rounded-xl p-5">
              <h3 className=" font-bold text-white mb-3 text-base">
                Why TrustPatrick?
              </h3>
              <ul className="space-y-2 text-sm text-white/75">
                {[
                  'Every contractor is vetted',
                  'Real homeowner reviews',
                  'Free estimates — no obligation',
                  'No spam, ever',
                  'Licensed & insured pros only',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-brand-gold mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Nearby cities */}
            {nearbyCities.length > 0 && (
              <div className="card p-5">
                <h3 className=" font-bold text-brand-navy mb-4 text-base">
                  Nearby Cities in {loc.region_name}
                </h3>
                <ul className="space-y-2">
                  {nearbyCities.map((c) => (
                    <li key={c.city_name}>
                      <Link href={`/${region}/${slugify(c.city_name)}/${service}`}
                        className="text-sm text-brand-action hover:underline">
                        → {svc.name} in {c.city_name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
}
