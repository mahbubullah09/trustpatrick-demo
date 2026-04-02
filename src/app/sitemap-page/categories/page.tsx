import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions } from '@/data/locations';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Categories — Sitemap | TrustPatrick',
};

export default function CategoriesSitemap() {
  const allRegions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-action">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">Categories</span>
      </nav>
      <h1 className="section-title mb-2">Categories</h1>
      <p className="text-brand-gray mb-10">
        {services.length} service types across {allRegions.length} states
      </p>

      <div className="space-y-10">
        {services.map((svc) => (
          <div key={svc.slug}>
            <div className="flex items-center gap-3 mb-4">
              <Link href={`/services/${svc.slug}`}
                className=" font-bold text-brand-navy hover:text-brand-action transition-colors text-lg">
                {svc.name}
              </Link>
              <span className="text-xs text-brand-gray bg-gray-100 px-2 py-0.5 rounded-full">
                {allRegions.length} states
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allRegions.map((r) => (
                <Link key={r.region_code}
                  href={`/${r.region_code.toLowerCase()}`}
                  className="text-sm text-brand-action hover:text-white hover:bg-brand-action border border-brand-action/30 bg-brand-light px-3 py-1.5 rounded-full transition-colors">
                  {svc.name} in {r.region_name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
