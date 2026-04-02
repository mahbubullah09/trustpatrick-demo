import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCompanies } from '@/data/companies';

export const metadata: Metadata = {
  title: 'Contractors — Sitemap | TrustPatrick',
};

export default function ContractorsSitemap() {
  const companies = getAllCompanies();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-action">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">Contractors</span>
      </nav>
      <h1 className="section-title mb-2">Contractors</h1>
      <p className="text-brand-gray mb-8">{companies.length} contractor profiles</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {companies.map((c) => (
          <Link key={c.slug} href={`/pros/${c.slug}`}
            className="card px-5 py-4 flex items-center justify-between group hover:border-brand-action transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center text-brand-action  font-bold text-sm shrink-0">
                {c.name.charAt(0)}
              </div>
              <p className="font-semibold text-brand-navy group-hover:text-brand-action transition-colors text-sm">
                {c.name}
              </p>
            </div>
            <svg className="w-4 h-4 text-brand-gray group-hover:text-brand-action shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
