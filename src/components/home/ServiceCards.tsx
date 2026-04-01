import Link from 'next/link';
import { services } from '@/data/services';

const icons: Record<string, string> = {
  'asphalt-paving-companies': '🛣️',
  'concrete-driveway-contractors': '🏗️',
};

export default function ServiceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
      {services.map((s) => (
        <Link key={s.slug} href={`/services/${s.slug}`} className="card p-6 group">
          <div className="text-4xl mb-4">{icons[s.slug] ?? '🔧'}</div>
          <h3 className="font-heading font-bold text-brand-navy text-lg mb-2 group-hover:text-brand-blue transition-colors">
            {s.name}
          </h3>
          <p className="text-sm text-brand-gray leading-relaxed">
            {s.introParagraph.replace(/\{city\}/g, 'your area').replace(/\{region\}/g, 'your state').slice(0, 120)}…
          </p>
          <div className="mt-4 text-brand-blue text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Find {s.shortName} Pros
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
