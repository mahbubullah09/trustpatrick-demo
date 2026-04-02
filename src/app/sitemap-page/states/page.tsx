import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion } from '@/data/locations';

export const metadata: Metadata = {
  title: 'States — Sitemap | TrustPatrick',
};

export default function StatesSitemap() {
  const regions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-action">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">States</span>
      </nav>
      <h1 className="section-title mb-2">States</h1>
      <p className="text-brand-gray mb-8">{regions.length} states</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {regions.map((r) => {
          const cityCount = getCitiesInRegion(r.region_code).length;
          return (
            <Link key={r.region_code} href={`/sitemap-page/${r.region_code.toLowerCase()}`}
              className="card px-4 py-3 flex items-center justify-between group hover:border-brand-action transition-all">
              <div>
                <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-action transition-colors leading-tight">
                  {r.region_name}
                </p>
                <p className="text-xs text-brand-gray mt-0.5">{cityCount} cities</p>
              </div>
              <svg className="w-3.5 h-3.5 text-brand-gray group-hover:text-brand-action shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
