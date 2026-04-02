import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getService, fillTemplate, services } from '@/data/services';
import { getAllRegions, getCitiesInRegion, slugify } from '@/data/locations';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) return {};
  return {
    title: svc.name,
    description: fillTemplate(svc.description, 'your city', 'your state'),
  };
}

export default async function ServiceOverviewPage({ params }: Props) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();

  const regions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-brand-gray mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-brand-action">Services</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">{svc.name}</span>
      </nav>

      <h1 className="section-title mb-3">{svc.name} Near You</h1>
      <p className="text-brand-gray mb-10 max-w-2xl">
        {fillTemplate(svc.introParagraph, 'your city', 'your state').slice(0, 200)}…
      </p>

      {/* State grid */}
      <h2 className=" font-bold text-xl text-brand-navy mb-5">
        Find {svc.name} Contractors by State
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
        {regions.map((r) => {
          const cities = getCitiesInRegion(r.region_code);
          return (
            <div key={r.region_code} className="card p-4">
              <h3 className="font-semibold text-brand-navy text-sm mb-2 flex items-center justify-between">
                {r.region_name}
                <span className="text-xs text-brand-gray font-normal">{cities.length} cities</span>
              </h3>
              <ul className="space-y-1">
                {cities.slice(0, 4).map((c) => (
                  <li key={c.city_name}>
                    <Link
                      href={`/${r.region_code.toLowerCase()}/${slugify(c.city_name)}/${svc.slug}`}
                      className="text-xs text-brand-action hover:underline"
                    >
                      {svc.name} in {c.city_name}
                    </Link>
                  </li>
                ))}
                {cities.length > 4 && (
                  <li>
                    <Link
                      href={`/${r.region_code.toLowerCase()}`}
                      className="text-xs text-brand-gray hover:text-brand-action"
                    >
                      +{cities.length - 4} more cities →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-hero-gradient rounded-2xl p-8 text-white text-center">
        <h2 className=" font-bold text-2xl mb-3">
          Not Sure Which City to Pick?
        </h2>
        <p className="text-white/75 mb-6">
          Use our search tool to find {svc.name.toLowerCase()} contractors in your exact area.
        </p>
        <Link href="/" className="btn-orange px-10">
          Search by Location
        </Link>
      </div>
    </div>
  );
}
