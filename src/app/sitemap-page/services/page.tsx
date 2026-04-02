import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/data/services';

export const metadata: Metadata = {
  title: 'Services — Sitemap | TrustPatrick',
};

export default function ServicesSitemap() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-brand-gray mb-4 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-brand-action">Home</Link>
        <span>/</span>
        <Link href="/sitemap-page" className="hover:text-brand-action">Sitemap</Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">Services</span>
      </nav>
      <h1 className="section-title mb-2">Services</h1>
      <p className="text-brand-gray mb-8">{services.length} services</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`}
            className="card px-5 py-4 flex items-center justify-between group hover:border-brand-action transition-all">
            <div>
              <p className="font-semibold text-brand-navy group-hover:text-brand-action transition-colors text-sm">
                {s.name}
              </p>
              <p className="text-xs text-brand-gray mt-0.5 line-clamp-1">{s.description.replace(/\{city\}|\{region\}/g, '...')}</p>
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
