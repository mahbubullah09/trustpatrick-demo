'use client';

import Link from 'next/link';
import type { Expert } from '@/lib/api';

interface Props {
  expert: Expert;
  ctaText: string;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
  selectionDisabled: boolean;
}

function StarRating({ rating }: { rating: number }) {
  const num = Number(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(num) ? 'text-brand-gold' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-brand-gray ml-1">{num.toFixed(1)}</span>
    </div>
  );
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function ExpertCard({ expert, ctaText, isSelected, onToggle, selectionDisabled }: Props) {
  const displayName = expert.business_name ?? expert.name ?? 'Local Contractor';
  const location = [expert.city, expert.state].filter(Boolean).join(', ');
  const logoSrc = expert.logo ?? expert.profile_image;
  const profileHref = expert.slug ? `/pros/${expert.slug}` : null;
  const canToggle = isSelected || !selectionDisabled;

  return (
    <div
      className={`card flex flex-col h-full transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-brand-blue shadow-md'
          : selectionDisabled
          ? 'opacity-60'
          : 'hover:shadow-md'
      }`}
    >
      {/* Select button */}
      <button
        type="button"
        onClick={() => canToggle && onToggle(expert.id)}
        disabled={!canToggle}
        className={`flex items-center gap-2 px-4 pt-4 pb-0 text-sm font-semibold transition-colors w-full text-left
          ${isSelected ? 'text-brand-blue' : 'text-brand-gray'}
          ${!canToggle ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={isSelected}
      >
        <span
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
            ${isSelected ? 'bg-brand-blue border-brand-blue' : 'border-gray-300 bg-white'}`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        {isSelected ? 'Selected' : selectionDisabled ? 'Max 3 selected' : 'Select for quote'}
      </button>

      {/* Header: logo + name */}
      <div className="p-4 border-b border-gray-100 flex items-start gap-3">
        {profileHref ? (
          <Link href={profileHref} className="shrink-0">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={displayName}
                className="w-14 h-14 rounded-lg object-cover border border-gray-100"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-brand-light flex items-center justify-center text-brand-blue font-heading font-black text-xl border border-gray-100">
                {displayName.charAt(0)}
              </div>
            )}
          </Link>
        ) : (
          <>
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt={displayName}
                className="w-14 h-14 rounded-lg object-cover border border-gray-100 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-brand-light flex items-center justify-center text-brand-blue font-heading font-black text-xl border border-gray-100 shrink-0">
                {displayName.charAt(0)}
              </div>
            )}
          </>
        )}

        <div className="flex-1 min-w-0">
          {profileHref ? (
            <Link
              href={profileHref}
              className="font-heading font-bold text-brand-navy text-sm hover:text-brand-blue hover:underline leading-tight block truncate"
            >
              {displayName}
            </Link>
          ) : (
            <p className="font-heading font-bold text-brand-navy text-sm leading-tight truncate">{displayName}</p>
          )}
          {location && <p className="text-xs text-brand-gray mt-0.5">{location}</p>}
          {expert.rating != null && (
            <div className="mt-1 flex items-center gap-1.5">
              <StarRating rating={expert.rating} />
              {expert.review_count != null && (
                <span className="text-xs text-brand-gray">({expert.review_count} reviews)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 space-y-3">
        {expert.description && (
          <p className="text-xs text-brand-gray line-clamp-2 leading-relaxed">{expert.description}</p>
        )}

        {/* Trust badges */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {expert.years_in_business != null && (
            <span className="badge-trust">✓ {expert.years_in_business}+ yrs</span>
          )}
          {expert.is_insured && <span className="badge-trust">✓ Insured</span>}
          {expert.license_number && <span className="badge-trust">✓ Licensed</span>}
        </div>

        {/* Screening dates */}
        {(expert.recent_screening_date || expert.background_check_date) && (
          <div className="space-y-1 border-t border-gray-100 pt-2">
            {expert.recent_screening_date && (
              <p className="text-xs text-green-700 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Screened {formatDate(expert.recent_screening_date)}
              </p>
            )}
            {expert.background_check_date && (
              <p className="text-xs text-green-700 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Background check {formatDate(expert.background_check_date)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="p-4 pt-0 flex flex-col gap-2">
        {expert.phone && (
          <a href={`tel:${expert.phone}`} className="btn-orange text-sm justify-center py-2.5">
            📞 {expert.phone}
          </a>
        )}
        {expert.website && (
          <a
            href={expert.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm text-brand-blue hover:underline py-1"
          >
            {ctaText}
          </a>
        )}
      </div>
    </div>
  );
}
