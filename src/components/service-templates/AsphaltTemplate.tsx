import ExpertsGrid from '@/components/experts/ExpertsGrid';
import type { Expert } from '@/lib/api';

interface Props {
  city: string;
  region: string;
  regionCode: string;
  initialExperts: Expert[];
  zipCodes: string[];
  serviceCategoryCodes: string[];
  ctaText: string;
  cacheKey: string;
}

export default function AsphaltTemplate({
  city,
  region,
  regionCode,
  initialExperts,
  zipCodes,
  serviceCategoryCodes,
  ctaText,
  cacheKey,
}: Props) {
  return (
    <div className="space-y-8 prose-sm max-w-none">

      <ExpertsGrid
        initialExperts={initialExperts}
        zipCodes={zipCodes}
        serviceCategoryCodes={serviceCategoryCodes}
        cityName={city}
        regionName={region}
        regionCode={regionCode}
        ctaText={ctaText}
        cacheKey={cacheKey}
      />

      {/* Intro */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-3">
          Asphalt Paving in {city}, {region}
        </h2>
        <p className="text-brand-gray leading-relaxed mb-3">
          Asphalt driveways are one of the most popular choices for homeowners in {city} — and for good reason.
          They're cost-effective, quick to install, and hold up well against the freeze-thaw cycles
          common throughout {region}. Whether you're replacing a cracked old driveway or installing
          a brand-new one, choosing the right contractor in {city} makes all the difference between
          a job that lasts 20 years and one that starts crumbling after two.
        </p>
        <p className="text-brand-gray leading-relaxed">
          The contractors listed on this page serve {city} and surrounding zip codes. Each one has
          been screened for licensing, insurance, and customer satisfaction — so you can compare
          with confidence.
        </p>
      </section>

      {/* Cost guide */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-4">
          Asphalt Driveway Cost Guide for {city}
        </h2>
        <p className="text-brand-gray mb-4">
          Prices vary based on driveway size, thickness, site prep, and local material costs in {regionCode}.
          Here's a general range to help you budget:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-light">
                <th className="text-left px-4 py-2 font-semibold text-brand-navy border border-gray-200">Project Type</th>
                <th className="text-left px-4 py-2 font-semibold text-brand-navy border border-gray-200">Avg. Cost Range</th>
                <th className="text-left px-4 py-2 font-semibold text-brand-navy border border-gray-200">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['New driveway (2-car)', '$3,000 – $7,000', 'Includes excavation & grading'],
                ['Resurfacing / overlay', '$1,500 – $3,500', 'For driveways in fair condition'],
                ['Crack filling & sealing', '$200 – $600', 'Annual maintenance'],
                ['Full replacement', '$4,000 – $10,000', 'Remove old, install new base'],
              ].map(([type, cost, note]) => (
                <tr key={type as string} className="even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 text-brand-dark">{type}</td>
                  <td className="px-4 py-2 border border-gray-200 text-brand-blue font-semibold">{cost}</td>
                  <td className="px-4 py-2 border border-gray-200 text-brand-gray">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-brand-gray mt-3">
          * Estimates only. Get free quotes from the contractors listed above for {city}-specific pricing.
        </p>
      </section>

      {/* What to look for */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-4">
          How to Choose an Asphalt Contractor in {city}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Verify Licensing & Insurance',
              body: `Always confirm the contractor holds a valid {regionCode} license and carries both liability and workers' comp insurance before signing anything.`,
            },
            {
              title: 'Get at Least 3 Quotes',
              body: 'Prices can vary significantly between {city} contractors. Getting multiple estimates helps you spot outliers — both suspiciously low and unreasonably high bids.',
            },
            {
              title: 'Ask About the Base Layer',
              body: 'A quality asphalt driveway starts with a properly compacted gravel base. Cut-rate contractors often skip this step, leading to early cracking and sinking.',
            },
            {
              title: 'Check References',
              body: 'Ask for recent jobs in the {city} area you can drive by. Seeing completed driveways in person tells you more than photos alone.',
            },
            {
              title: 'Understand the Mix',
              body: 'Hot-mix asphalt is the gold standard. Be wary of contractors offering cold-patch or recycled materials for full installs — they don\'t last.',
            },
            {
              title: 'Get Everything in Writing',
              body: 'A detailed written contract should specify thickness (at least 2–3 inches), base depth, timeline, warranty, and exact price before any work begins.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="flex gap-3">
              <span className="text-brand-gold text-xl mt-0.5 flex-shrink-0">✓</span>
              <div>
                <h3 className="font-semibold text-brand-navy text-sm mb-1">{title}</h3>
                <p className="text-xs text-brand-gray leading-relaxed">
                  {body.replace(/\{city\}/g, city).replace(/\{regionCode\}/g, regionCode)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-5">
          Asphalt Driveway FAQs for {city} Homeowners
        </h2>
        <div className="space-y-5">
          {[
            {
              q: `How long does an asphalt driveway last in ${region}?`,
              a: `With proper installation and regular sealing, an asphalt driveway in ${region} typically lasts 20–30 years. ${region}'s climate can affect longevity — freezing winters accelerate cracking if the base isn't properly installed.`,
            },
            {
              q: `When is the best time to pave a driveway in ${city}?`,
              a: `Late spring through early fall is ideal for asphalt work in ${city}. Asphalt needs warm temperatures (above 50°F) to properly cure and compact. Most ${city} contractors are busiest between May and October.`,
            },
            {
              q: `Do I need a permit to pave a driveway in ${city}?`,
              a: `Permit requirements vary by municipality. Many ${city} projects under a certain square footage don't require permits, but it's always best to ask your contractor — a reputable pro will know local ${region} regulations.`,
            },
            {
              q: 'How soon can I drive on a new asphalt driveway?',
              a: 'Most asphalt driveways can handle light foot traffic within 24 hours and vehicle traffic within 2–3 days. However, it takes 6–12 months to fully cure — avoid turning your wheels sharply during this period.',
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <summary className="font-semibold text-brand-navy text-sm cursor-pointer flex items-start justify-between gap-3 list-none">
                <span>{q}</span>
                <span className="text-brand-blue text-lg mt-0.5 flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-sm text-brand-gray mt-3 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
