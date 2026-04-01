import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/data/services';
import { getAllRegions } from '@/data/locations';

export const metadata: Metadata = {
  title: 'Driveway Services — Asphalt, Concrete & More',
  description:
    'Find vetted asphalt paving, concrete driveway, paver, and gravel contractors near you. Browse all services available on TrustPatrick.',
};

const SERVICE_ICONS: Record<string, string> = {
  'asphalt-paving-companies':       '🛣️',
  'concrete-driveway-contractors':  '🏗️',
};

export default function ServicesPage() {
  const regions = getAllRegions().slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-3">All Driveway Services</h1>
      <p className="text-brand-gray mb-10 max-w-2xl">
        TrustPatrick connects homeowners with vetted professionals across all major driveway services.
        Select a service to find contractors near you.
      </p>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {services.map((s) => (
          <div key={s.slug} className="card p-6 flex flex-col">
            <div className="text-4xl mb-4">{SERVICE_ICONS[s.slug] ?? '🔧'}</div>
            <h2 className="font-heading font-bold text-brand-navy text-lg mb-2">{s.name}</h2>
            <p className="text-sm text-brand-gray leading-relaxed flex-1 mb-4">
              {s.introParagraph
                .replace(/\{city\}/g, 'your city')
                .replace(/\{region\}/g, 'your state')
                .slice(0, 130)}…
            </p>
            <div className="space-y-2">
              <Link href={`/services/${s.slug}`} className="btn-primary text-sm w-full justify-center py-2">
                Browse {s.shortName} Contractors
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Browse by state */}
      <div className="bg-brand-light rounded-2xl p-8">
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-2">
          Browse by State
        </h2>
        <p className="text-sm text-brand-gray mb-5">
          Find contractors in your specific state and city.
        </p>
        <div className="flex flex-wrap gap-3">
          {getAllRegions()
            .sort((a, b) => a.region_name.localeCompare(b.region_name))
            .map((r) => (
              <Link
                key={r.region_code}
                href={`/${r.region_code.toLowerCase()}`}
                className="text-sm bg-white border border-gray-200 text-brand-navy px-3 py-1.5
                  rounded-lg hover:border-brand-blue hover:text-brand-blue transition-colors"
              >
                {r.region_name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
