'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Expert } from '@/lib/api';

interface Props {
  expert: Expert;
  ctaText: string;
  isSelected: boolean;
  onToggle: (id: string | number) => void;
  selectionDisabled: boolean;
}

type ReviewShape = { content?: string; customer_name?: string; ratings?: number };

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const num = Number(rating);
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`${cls} ${i <= Math.round(num) ? 'text-brand-gold' : 'text-gray-300'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateStr: string) {
  const mmYyyy = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (mmYyyy) {
    return new Date(Number(mmYyyy[2]), Number(mmYyyy[1]) - 1)
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function ReviewQuote({ review }: { review: ReviewShape }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.content ? stripHtml(review.content) : '';
  const LIMIT = 120;
  const isLong = text.length > LIMIT;
  if (!text) return null;

  return (
    <div className="relative pl-4 border-l-2 border-brand-gold">
      <svg className="absolute -top-0.5 -left-1 w-3 h-3 text-brand-gold/60 fill-current" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.293-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.293-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-xs text-brand-gray leading-relaxed">
        {expanded || !isLong ? text : `${text.slice(0, LIMIT)}…`}
        {isLong && (
          <button type="button" onClick={() => setExpanded(v => !v)}
            className="ml-1 text-brand-action hover:underline font-semibold">
            {expanded ? 'See less' : 'Read more'}
          </button>
        )}
      </p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <StarRating rating={review.ratings ?? 0} />
        {review.customer_name && (
          <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wide">— {review.customer_name}</span>
        )}
      </div>
    </div>
  );
}

export default function ExpertCard({ expert, ctaText, isSelected, onToggle, selectionDisabled }: Props) {
  const displayName = expert.business_name ?? expert.name ?? 'Local Contractor';
  const location = [expert.city, expert.state].filter(Boolean).join(', ');
  const logoSrc = expert.logo ?? expert.profile_image;
  const profileHref = expert.slug ? `/pros/${expert.slug}` : null;
  const canToggle = isSelected || !selectionDisabled;

  const ratingValue = typeof expert.rating === 'object' && expert.rating !== null
    ? (expert.rating as { average_ratings?: number }).average_ratings ?? 0
    : Number(expert.rating ?? 0);

  const reviewList: ReviewShape[] = Array.isArray(expert.review)
    ? expert.review
    : expert.review && typeof expert.review === 'object'
    ? [expert.review as ReviewShape]
    : [];

  const hasTrust = expert.years_in_business != null || expert.is_insured || expert.license_number;
  const hasScreening = expert.recent_screening_date || expert.background_check_date;

  return (
    <div className={`relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 bg-white
      ${isSelected
        ? 'shadow-xl ring-2 ring-brand-action'
        : selectionDisabled
        ? 'opacity-50 shadow-sm border border-gray-100'
        : 'shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5'
      }`}
    >
      {/* ── Gradient banner ── */}
      <div className="h-14 bg-gradient-to-br from-[#0f2d4a] via-brand-navy to-[#1e4976] relative z-0">
        {/* dot pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        {isSelected && (
          <div className="absolute top-3 right-3 bg-brand-action text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            SELECTED
          </div>
        )}
      </div>

      {/* ── Logo overlapping the banner ── */}
      <div className="relative z-10 px-5 -mt-7">
        <div className={`w-14 h-14 rounded-xl border-[3px] overflow-hidden shrink-0 shadow-lg
          ${isSelected ? 'border-brand-action' : 'border-white'}`}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt={displayName}
              className="w-full h-full object-contain bg-white p-1" />
          ) : (
            <div className="w-full h-full bg-brand-light flex items-center justify-center text-brand-action font-black text-xl">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* ── Company info ── */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {profileHref ? (
              <Link href={profileHref}
                className="font-black text-brand-navy text-base hover:text-brand-action transition-colors leading-tight block">
                {displayName}
              </Link>
            ) : (
              <p className="font-black text-brand-navy text-base leading-tight">{displayName}</p>
            )}
            {location && (
              <p className="text-xs text-brand-gray flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3 shrink-0 text-brand-action" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                {location}
              </p>
            )}
          </div>
          {ratingValue > 0 && (
            <div className="shrink-0 flex flex-col items-end mt-0.5">
              <StarRating rating={ratingValue} size="md" />
              <span className="text-xs font-bold text-brand-navy mt-0.5">
                {ratingValue.toFixed(1)}
                {expert.review_count != null && (
                  <span className="font-normal text-brand-gray"> ({expert.review_count})</span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-dashed border-gray-200" />

      {/* ── Body ── */}
      <div className="px-5 py-4 flex-1 space-y-4">

        {/* Trust badges */}
        {hasTrust && (
          <div className="flex flex-wrap gap-2">
            {expert.years_in_business != null && (
              <div className="flex items-center gap-1.5 bg-brand-navy/5 border border-brand-navy/10 rounded-full px-3 py-1">
                <svg className="w-3 h-3 text-brand-navy shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0112 0v2" />
                </svg>
                <span className="text-[11px] font-bold text-brand-navy">{expert.years_in_business}+ yrs exp</span>
              </div>
            )}
            {expert.is_insured && (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                <svg className="w-3 h-3 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l7 4v6c0 5-7 10-7 10S5 17 5 12V6l7-4z" />
                </svg>
                <span className="text-[11px] font-bold text-blue-700">Insured</span>
              </div>
            )}
            {expert.license_number && (
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
                <svg className="w-3 h-3 text-purple-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-[11px] font-bold text-purple-700">Licensed</span>
              </div>
            )}
          </div>
        )}

        {/* Screening — green pill row */}
        {hasScreening && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 space-y-1.5">
            {expert.recent_screening_date && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-xs text-green-800 font-medium">
                  Screened <span className="font-bold">{formatDate(expert.recent_screening_date)}</span>
                </span>
              </div>
            )}
            {expert.background_check_date && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-xs text-green-800 font-medium">
                  Background check <span className="font-bold">{formatDate(expert.background_check_date)}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Review */}
        {reviewList.length > 0 && <ReviewQuote review={reviewList[0]} />}
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-5 pt-3 space-y-2.5 border-t border-gray-100">

        {/* Phone CTA — primary */}
        {expert.phone && (
          <a href={`tel:${expert.phone}`}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0115.07 2.18 2 2 0 0117.07 4v3c.01 1.1-.77 2.06-1.84 2.24a15.08 15.08 0 002.45 5.09 15.08 15.08 0 005.09 2.45c1.18-.07 2.15-1.04 2.23-2.26z"/>
            </svg>
            {expert.phone}
          </a>
        )}

        {/* Select toggle — secondary */}
        <button
          type="button"
          onClick={() => canToggle && onToggle(expert.id)}
          disabled={!canToggle}
          aria-pressed={isSelected}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all active:scale-[0.98]
            ${isSelected
              ? 'bg-brand-action border-brand-action text-white shadow-md'
              : selectionDisabled
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-brand-navy/20 text-brand-navy bg-brand-navy/5 hover:border-brand-action hover:text-brand-action hover:bg-brand-action/5 cursor-pointer'
            }`}
        >
          {isSelected ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Selected for Quote
            </>
          ) : (
            <>
              <span className="w-4 h-4 rounded border-2 border-current flex items-center justify-center shrink-0" />
              {selectionDisabled ? 'Max 3 Selected' : 'Select for Quote'}
            </>
          )}
        </button>

        {expert.website && (
          <a href={expert.website} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-gray hover:text-brand-action transition-colors py-0.5">
            {ctaText}
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
