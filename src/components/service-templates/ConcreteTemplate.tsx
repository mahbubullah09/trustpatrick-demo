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

export default function ConcreteTemplate({
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
    <div className="space-y-8">

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
          Concrete Driveway Contractors in {city}, {region}
        </h2>
        <p className="text-brand-gray leading-relaxed mb-3">
          Concrete driveways are the premium, long-lasting choice for homeowners in {city} who want
          a surface that stands the test of time. Unlike asphalt, concrete doesn't need regular
          sealing, can be stamped or colored to match your home's aesthetic, and typically lasts
          30–50 years with minimal maintenance. The trade-off? It costs more upfront and requires
          an experienced contractor who knows how to properly mix, pour, and finish concrete for
          {region}'s climate conditions.
        </p>
        <p className="text-brand-gray leading-relaxed">
          Every contractor on this page serves {city} and has been vetted for licensing, insurance,
          and quality of work. Compare them side by side to find the right fit for your project.
        </p>
      </section>

      {/* Concrete vs asphalt */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-4">
          Concrete vs. Asphalt: Which Is Right for {city} Homeowners?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-light">
                <th className="text-left px-4 py-2 font-semibold text-brand-navy border border-gray-200">Factor</th>
                <th className="text-left px-4 py-2 font-semibold text-brand-blue border border-gray-200">Concrete</th>
                <th className="text-left px-4 py-2 font-semibold text-brand-gray border border-gray-200">Asphalt</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Lifespan', '30–50 years', '20–30 years'],
                ['Upfront Cost', 'Higher ($5–$15/sq ft)', 'Lower ($3–$7/sq ft)'],
                ['Maintenance', 'Minimal', 'Seal every 3–5 years'],
                ['Aesthetics', 'Stamped, colored, polished', 'Standard black surface'],
                ['Heat Resistance', 'Excellent', 'Softens in extreme heat'],
                ['Cold Climate', 'Can crack if poorly poured', 'More flexible'],
                ['Repair Ease', 'Harder to patch seamlessly', 'Easier to patch'],
              ].map(([factor, concrete, asphalt]) => (
                <tr key={factor as string} className="even:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200 font-medium text-brand-dark">{factor}</td>
                  <td className="px-4 py-2 border border-gray-200 text-brand-blue">{concrete}</td>
                  <td className="px-4 py-2 border border-gray-200 text-brand-gray">{asphalt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cost guide */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-4">
          Concrete Driveway Cost Estimates for {city}, {regionCode}
        </h2>
        <p className="text-brand-gray mb-4">
          Concrete costs depend on square footage, thickness, finish type, and site preparation needs.
          Here's what to expect in the {city} area:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Basic broom finish', range: '$4 – $8 / sq ft', desc: 'Standard texture, most affordable' },
            { label: 'Exposed aggregate', range: '$6 – $12 / sq ft', desc: 'Decorative stone surface' },
            { label: 'Stamped concrete', range: '$10 – $20 / sq ft', desc: 'Custom patterns & colors' },
            { label: 'Colored concrete', range: '$7 – $14 / sq ft', desc: 'Integral or surface color' },
          ].map(({ label, range, desc }) => (
            <div key={label} className="bg-brand-light rounded-lg p-4">
              <div className="font-semibold text-brand-navy text-sm mb-1">{label}</div>
              <div className="text-brand-blue font-bold text-lg">{range}</div>
              <div className="text-xs text-brand-gray mt-1">{desc}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-brand-gray mt-4">
          * Average 2-car driveway is ~400–600 sq ft. Prices vary by {city} contractor — get free quotes above.
        </p>
      </section>

      {/* Warning signs */}
      <section className="card p-6 border-l-4 border-brand-orange">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-4">
          Concrete Driveway Scams to Watch Out For in {city}
        </h2>
        <p className="text-brand-gray mb-4 text-sm">
          Unfortunately, the driveway industry attracts its share of bad actors.
          Here are the most common scams reported by {city} homeowners:
        </p>
        <ul className="space-y-3">
          {[
            {
              title: '"Leftover material" door-knockers',
              body: 'A crew shows up claiming they have leftover concrete from a nearby job and can give you a great deal today only. These almost always result in a thin, low-quality pour that cracks within months.',
            },
            {
              title: 'No written contract',
              body: `Any ${city} contractor who refuses to provide a detailed written quote is a red flag. Without a contract, you have no protection if quality or scope changes.`,
            },
            {
              title: 'Unusually low bids',
              body: 'Concrete has a floor cost for materials. Bids significantly below others usually mean thinner pours, skipped reinforcement (rebar/fiber), or inferior mix designs.',
            },
            {
              title: 'Large upfront deposits',
              body: `Reputable ${city} contractors typically require 10–30% down. Demanding 50%+ before starting is a warning sign — some contractors disappear after collecting a large deposit.`,
            },
          ].map(({ title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="text-red-500 text-lg mt-0.5 flex-shrink-0">⚠</span>
              <div>
                <span className="font-semibold text-brand-navy text-sm">{title}: </span>
                <span className="text-sm text-brand-gray">{body}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="card p-6">
        <h2 className="font-heading font-bold text-brand-navy text-xl mb-5">
          Concrete Driveway FAQs — {city}, {region}
        </h2>
        <div className="space-y-5">
          {[
            {
              q: `How thick should a concrete driveway be in ${region}?`,
              a: `Standard residential driveways in ${region} should be at least 4 inches thick. If you have heavy vehicles (trucks, RVs), ask for 5–6 inches. In areas with harsh winters, proper reinforcement and control joints are critical to prevent freeze-thaw cracking.`,
            },
            {
              q: `How long does concrete take to cure in ${city}?`,
              a: `Concrete reaches about 70% of its strength in 7 days and full strength at 28 days. You can walk on it after 24 hours and drive light vehicles after 7 days. In ${region}'s colder months, curing takes longer and requires special precautions from your contractor.`,
            },
            {
              q: `Can I get a stamped concrete driveway in ${city}?`,
              a: `Yes — stamped concrete is popular in ${city} and throughout ${region}. It can mimic the look of brick, slate, stone, or tile at a fraction of the cost of real materials. Make sure your contractor has a portfolio of stamped work specifically.`,
            },
            {
              q: `Does a concrete driveway add home value in ${region}?`,
              a: `Concrete driveways generally offer a strong return on investment — typically 50–70% ROI — because they boost curb appeal and last decades. In ${city}'s real estate market, a clean, well-finished driveway is a genuine selling point.`,
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
