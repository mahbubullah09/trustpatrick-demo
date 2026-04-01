'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchExperts, setExpertsFromServer } from '@/store/slices/expertsSlice';
import {
  selectExperts,
  selectExpertsStatus,
  selectExpertsError,
  selectLoadedKey,
} from '@/store/selectors';
import ExpertCard from './ExpertCard';
import QuoteRequestForm from './QuoteRequestForm';
import type { Expert } from '@/lib/api';

const MAX_SELECTION = 3;

interface Props {
  initialExperts: Expert[];
  zipCodes: string[];
  serviceCategoryCodes: string[];
  cityName: string;
  regionName: string;
  regionCode: string;
  ctaText: string;
  cacheKey: string;
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="h-10 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default function ExpertsGrid({
  initialExperts,
  zipCodes,
  serviceCategoryCodes,
  cityName,
  regionCode,
  ctaText,
  cacheKey,
}: Props) {
  const dispatch = useAppDispatch();
  const experts   = useAppSelector(selectExperts);
  const status    = useAppSelector(selectExpertsStatus);
  const error     = useAppSelector(selectExpertsError);
  const loadedKey = useAppSelector(selectLoadedKey);

  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    if (loadedKey === cacheKey) return;
    if (initialExperts.length > 0) {
      dispatch(setExpertsFromServer({ experts: initialExperts, key: cacheKey }));
    } else {
      dispatch(fetchExperts({ zipCodes, serviceCategoryCodes }));
    }
  }, [cacheKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset selection when experts change (page navigation)
  useEffect(() => {
    setSelectedIds([]);
  }, [cacheKey]);

  function handleToggle(id: string | number) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  }

  const selectedExperts = experts.filter((e) => selectedIds.includes(e.id));
  const isLoading = status === 'loading' || (status === 'idle' && loadedKey !== cacheKey);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-xl text-brand-navy">
          {isLoading
            ? `Finding contractors near ${cityName}…`
            : experts.length > 0
              ? `${experts.length} Contractor${experts.length !== 1 ? 's' : ''} Found Near ${cityName}`
              : `No Contractors Listed Yet in ${cityName}`}
        </h2>
        {!isLoading && experts.length > 0 && (
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full font-medium shrink-0">
            ✓ All Vetted
          </span>
        )}
      </div>

      {/* Selection hint */}
      {!isLoading && experts.length > 0 && (
        <p className="text-sm text-brand-gray -mt-4">
          Select up to {MAX_SELECTION} contractors below, then fill out the form to request free quotes.
          {selectedIds.length > 0 && (
            <span className="ml-2 font-semibold text-brand-blue">
              {selectedIds.length}/{MAX_SELECTION} selected
            </span>
          )}
        </p>
      )}

      {/* Error state */}
      {status === 'failed' && (
        <div className="card p-5 border border-red-100 bg-red-50 text-center">
          <p className="text-sm text-red-600 mb-3">{error ?? 'Could not load contractors. Please try again.'}</p>
          <button
            onClick={() => dispatch(fetchExperts({ zipCodes, serviceCategoryCodes }))}
            className="btn-primary text-sm py-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Contractor cards */}
      {!isLoading && experts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              ctaText={ctaText}
              isSelected={selectedIds.includes(expert.id)}
              onToggle={handleToggle}
              selectionDisabled={selectedIds.length >= MAX_SELECTION && !selectedIds.includes(expert.id)}
            />
          ))}
        </div>
      )}

      {/* Quote request form — always shown; locked when nothing selected */}
      {/* When no contractors exist, form acts as lead-capture standalone */}
      {!isLoading && (
        <>
          {experts.length === 0 && status !== 'failed' && (
            <div className="card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-heading font-bold text-brand-navy mb-2">
                No contractors listed yet in {cityName}
              </h3>
              <p className="text-sm text-brand-gray mb-5">
                We&apos;re expanding our network. Fill out the form below and we&apos;ll notify you when contractors become available in your area.
              </p>
              <Link href={`/${regionCode.toLowerCase()}`} className="btn-primary text-sm inline-block">
                Browse All {regionCode} Contractors
              </Link>
            </div>
          )}

          <QuoteRequestForm
            selectedExperts={selectedExperts}
            noContractors={experts.length === 0 && status !== 'failed'}
            serviceCategoryCodes={serviceCategoryCodes}
          />
        </>
      )}
    </div>
  );
}
