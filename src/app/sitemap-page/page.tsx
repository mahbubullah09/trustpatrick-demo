import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion } from '@/data/locations';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Sitemap — TrustPatrick',
  description: 'Browse all states, cities, and contractor service pages on TrustPatrick.',
  alternates: { canonical: 'https://trustpatrick.com/sitemap-page' },
};

// Group states alphabetically by first letter
function groupByLetter(regions: { region_name: string; region_code: string }[]) {
  const map = new Map<string, typeof regions>();
  for (const r of regions) {
    const letter = r.region_name[0].toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(r);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

const MAIN_PAGES = [
  { label: 'Home',            href: '/' },
  { label: 'About',           href: '/about' },
  { label: 'Contact',         href: '/contact' },
  { label: 'Privacy Policy',  href: '/privacy' },
  { label: 'Terms of Service',href: '/terms' },
];

export default function SitemapPage() {
  const allRegions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));
  const grouped    = groupByLetter(allRegions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1">
          <Link href="/" className="hover:text-brand-blue">Home</Link>
          <span>/</span>
          <span className="text-brand-navy font-medium">Sitemap</span>
        </nav>
        <h1 className="section-title mb-2">Sitemap</h1>
        <p className="text-brand-gray">
          Browse all {allRegions.length} states and every city + service page on TrustPatrick.
        </p>
      </div>

      {/* ── Main pages ── */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-4 pb-2 border-b border-gray-100">
          Main Pages
        </h2>
        <ul className="flex flex-wrap gap-3">
          {MAIN_PAGES.map(({ label, href }) => (
            <li key={href}>
              <Link href={href}
                className="text-sm text-brand-blue hover:underline border border-blue-100 bg-brand-light px-3 py-1.5 rounded-full">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Services ── */}
      <section className="mb-12">
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-4 pb-2 border-b border-gray-100">
          Services
        </h2>
        <ul className="flex flex-wrap gap-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`}
                className="text-sm text-brand-blue hover:underline border border-blue-100 bg-brand-light px-3 py-1.5 rounded-full">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── States ── */}
      <section>
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-2 pb-2 border-b border-gray-100">
          Browse by State
        </h2>
        <p className="text-sm text-brand-gray mb-6">
          Click a state to see all cities and service pages within it.
        </p>

        {grouped.map(([letter, regions]) => (
          <div key={letter} className="mb-8">
            {/* Letter anchor */}
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-full bg-brand-navy text-white font-heading font-black text-sm flex items-center justify-center shrink-0">
                {letter}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {regions.map((r) => {
                const cityCount = getCitiesInRegion(r.region_code).length;
                return (
                  <Link
                    key={r.region_code}
                    href={`/sitemap-page/${r.region_code.toLowerCase()}`}
                    className="card px-4 py-3 hover:border-brand-blue hover:text-brand-blue transition-colors group"
                  >
                    <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-blue leading-tight">
                      {r.region_name}
                    </p>
                    <p className="text-xs text-brand-gray mt-0.5">
                      {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
