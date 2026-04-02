import { fetchAdditionalContractors, type AdditionalContractor } from '@/lib/api';

interface Props {
  city: string;
  serviceName: string;
  zipCodes: string[];
  serviceCategoryCodes: string[];
}

function ContractorCard({ name, address, city, state, zipcode }: AdditionalContractor) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-action to-brand-soft" />

      <div className="p-5">
        {/* Icon + name row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-brand-action" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" strokeWidth="2" />
              <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="font-bold text-brand-navy text-sm leading-tight">{name}</h3>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-xs text-brand-gray">
          <svg className="w-3.5 h-3.5 text-brand-muted mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>
            {address}
            <br />
            {city}, {state} {zipcode}
          </span>
        </div>
      </div>
    </div>
  );
}

export default async function NearbyContractors({
  city,
  serviceName,
  zipCodes,
  serviceCategoryCodes,
}: Props) {
  const contractors = await fetchAdditionalContractors(serviceCategoryCodes, zipCodes);
  if (!contractors.length) return null;

  return (
    <section className="py-4">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-px bg-brand-gold" />
        <span className="text-brand-gold text-xs font-semibold tracking-widest uppercase">
          Companies
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-brand-navy mb-1">
        <span className="text-brand-action">{serviceName} </span>
        Companies Near{' '}
        <span className="text-brand-dark">{city}</span>
      </h2>
      <p className="text-xs text-brand-gray italic mb-6">
        *Not Endorsed By TrustPatrick.com
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractors.map((c, i) => (
          <ContractorCard key={i} {...c} />
        ))}
      </div>
    </section>
  );
}
