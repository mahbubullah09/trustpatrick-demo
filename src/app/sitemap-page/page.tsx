import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllRegions, getCitiesInRegion, getAllCounties } from '@/data/locations';
import { services } from '@/data/services';
import { getAllCompanies } from '@/data/companies';

export const metadata: Metadata = {
  title: 'Sitemap — TrustPatrick',
  description: 'Browse all states, cities, and contractor service pages on TrustPatrick.',
  alternates: { canonical: 'https://trustpatrick.com/sitemap-page' },
};

export default function SitemapPage() {
  const allRegions  = getAllRegions();
  const companies   = getAllCompanies();
  const allCounties = getAllCounties();

  const cityCount = allRegions.reduce(
    (sum, r) => sum + getCitiesInRegion(r.region_code).length, 0
  );

  const sections = [
    {
      href: '/sitemap-page/main-pages',
      label: 'Main Pages',
      count: 6,
      description: 'Home, About, Contact and more',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/services',
      label: 'Services',
      count: services.length,
      description: 'All contractor service types',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/contractors',
      label: 'Contractors',
      count: companies.length,
      description: 'All verified contractor profiles',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/states',
      label: 'States',
      count: allRegions.length,
      description: 'Browse all US states',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/cities',
      label: 'Cities',
      count: cityCount,
      description: 'All cities across every state',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/counties',
      label: 'Counties',
      count: allCounties.length,
      description: 'All counties across every state',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      href: '/sitemap-page/categories',
      label: 'Categories',
      count: services.length * allRegions.length,
      description: 'Services by state',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">Sitemap</span>
      </nav>
      <h1 className="section-title mb-2">Sitemap</h1>
      <p className="text-brand-gray mb-10">Browse all pages on TrustPatrick.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}
            className="card p-6 flex items-start gap-4 hover:border-brand-action hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-action shrink-0 group-hover:bg-brand-light transition-colors">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className=" font-bold text-brand-navy group-hover:text-brand-action transition-colors">
                {s.label}
              </p>
              <p className="text-xs text-brand-gray mt-0.5">{s.description}</p>
              <p className="text-xs font-semibold text-brand-action mt-2">
                {s.count.toLocaleString()} pages →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
