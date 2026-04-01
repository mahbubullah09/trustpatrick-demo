'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllRegions, getCitiesInRegion, locations, slugify } from '@/data/locations';
import { services } from '@/data/services';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setRegion, setCity, setService, addRecentSearch } from '@/store/slices/searchSlice';
import { closeSearchDrawer } from '@/store/slices/uiSlice';
import {
  selectRegionCode,
  selectRegionName,
  selectCitySlug,
  selectServiceSlug,
  selectSearchPath,
  selectRecentSearches,
} from '@/store/selectors';
import SearchableSelect from './SearchableSelect';

interface Props {
  compact?:    boolean;
  hideRegion?: boolean;
}

type SearchMode = 'state' | 'county';

export default function SearchWidget({ compact = false, hideRegion = false }: Props) {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const regionCode     = useAppSelector(selectRegionCode);
  const regionName     = useAppSelector(selectRegionName);
  const citySlug       = useAppSelector(selectCitySlug);
  const serviceSlug    = useAppSelector(selectServiceSlug);
  const searchPath     = useAppSelector(selectSearchPath);
  const recentSearches = useAppSelector(selectRecentSearches);

  const [searchMode, setSearchMode] = useState<SearchMode>('state');

  // ── State mode data ──
  const regions = getAllRegions().sort((a, b) => a.region_name.localeCompare(b.region_name));
  const cities  = regionCode
    ? getCitiesInRegion(regionCode)
        .filter((l) => l.is_county === 0)
        .sort((a, b) => a.city_name.localeCompare(b.city_name))
    : [];

  // ── County mode data — all counties across all states ──
  const allCounties = locations
    .filter((l) => l.is_county === 1)
    .sort((a, b) => a.city_name.localeCompare(b.city_name));

  // Selected county in county mode (value = "region_code|slug" to handle same-name counties)
  const [countyValue,  setCountyValue]  = useState('');
  const [countySlug,   setCountySlug]   = useState('');
  const [countyRegion, setCountyRegion] = useState('');

  // Build option arrays
  const regionOptions  = regions.map((r) => ({ value: r.region_code, label: r.region_name }));
  const cityOptions    = cities.map((c) => ({ value: slugify(c.city_name), label: c.city_name }));
  const serviceOptions = services.map((s) => ({ value: s.slug, label: s.name }));
  const countyOptions  = allCounties.map((c) => ({
    value: `${c.region_code}|${slugify(c.city_name)}`,
    label: `${c.city_name}, ${c.region_code}`,
  }));

  // ── Handlers ──
  function handleModeChange(mode: SearchMode) {
    setSearchMode(mode);
    // Reset both paths when toggling
    dispatch(setCity({ slug: '', name: '' }));
    dispatch(setRegion({ code: '', name: '' }));
    setCountyValue('');
    setCountySlug('');
    setCountyRegion('');
  }

  function handleRegionChange(code: string) {
    const found = regions.find((r) => r.region_code === code);
    dispatch(setRegion(found ? { code: found.region_code, name: found.region_name } : { code: '', name: '' }));
    dispatch(setCity({ slug: '', name: '' }));
  }

  function handleCityChange(slug: string) {
    const found = cities.find((c) => slugify(c.city_name) === slug);
    dispatch(setCity(found ? { slug, name: found.city_name } : { slug: '', name: '' }));
  }

  function handleCountyChange(val: string) {
    setCountyValue(val);
    if (!val) { setCountySlug(''); setCountyRegion(''); return; }
    const [rc, slug] = val.split('|');
    setCountySlug(slug);
    setCountyRegion(rc);
    const found = allCounties.find(
      (c) => c.region_code === rc && slugify(c.city_name) === slug
    );
    if (found) {
      dispatch(setRegion({ code: found.region_code, name: found.region_name }));
      dispatch(setCity({ slug, name: found.city_name }));
    }
  }

  function handleServiceChange(slug: string) {
    dispatch(setService(slug));
  }

  // County search path: /{region}/{countySlug}/{serviceSlug?}
  const countySearchPath = countyRegion && countySlug
    ? serviceSlug
      ? `/${countyRegion.toLowerCase()}/${countySlug}/${serviceSlug}`
      : `/${countyRegion.toLowerCase()}/${countySlug}`
    : null;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const path = searchMode === 'county' ? countySearchPath : searchPath;
    if (!path) return;

    const svc = services.find((s) => s.slug === serviceSlug);

    if (searchMode === 'county') {
      const county = allCounties.find(
        (c) => c.region_code === countyRegion && slugify(c.city_name) === countySlug
      );
      dispatch(addRecentSearch({
        regionCode: countyRegion,
        cityName:   county?.city_name ?? '',
        serviceSlug,
        label: [svc?.shortName, county && `in ${county.city_name}`, countyRegion].filter(Boolean).join(' '),
        path,
      }));
    } else {
      const cityName = cities.find((c) => slugify(c.city_name) === citySlug)?.city_name ?? '';
      dispatch(addRecentSearch({
        regionCode,
        cityName,
        serviceSlug,
        label: [svc?.shortName, cityName && `in ${cityName}`, regionCode].filter(Boolean).join(' '),
        path,
      }));
    }

    dispatch(closeSearchDrawer());
    router.push(path);
  }

  const canSubmit = searchMode === 'county' ? !!countyValue : !!regionCode;

  const selClass = `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white
    focus:outline-none focus:ring-2 focus:ring-brand-blue
    disabled:bg-gray-50 disabled:text-gray-400`;

  return (
    <div>
      {/* ── State / County top toggle ── */}
      <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1 mb-4">
        <button
          type="button"
          onClick={() => handleModeChange('state')}
          className={`flex-1 text-sm py-1.5 rounded-md font-semibold transition-all
            ${searchMode === 'state'
              ? 'bg-white text-brand-blue shadow-sm'
              : 'text-brand-gray hover:text-brand-dark'}`}
        >
          Search by State
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('county')}
          className={`flex-1 text-sm py-1.5 rounded-md font-semibold transition-all
            ${searchMode === 'county'
              ? 'bg-white text-brand-blue shadow-sm'
              : 'text-brand-gray hover:text-brand-dark'}`}
        >
          Search by County
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">

        {/* ── STATE mode ── */}
        {searchMode === 'state' && (
          <>
            {hideRegion && regionName ? (
              <div className="flex items-center gap-2 text-sm text-brand-gray">
                <svg className="w-4 h-4 text-brand-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Searching in <strong className="text-brand-navy">{regionName}</strong></span>
              </div>
            ) : null}

            <div className={`grid gap-3 ${compact ? 'grid-cols-1' : hideRegion ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
              {!hideRegion && (
                <div>
                  <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">State</label>
                  <SearchableSelect
                    value={regionCode}
                    onChange={handleRegionChange}
                    options={regionOptions}
                    allLabel="Select a state…"
                    placeholder="Search states…"
                    className={selClass}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">City</label>
                <SearchableSelect
                  value={citySlug}
                  onChange={handleCityChange}
                  options={cityOptions}
                  allLabel="All cities"
                  placeholder="Search cities…"
                  disabled={!regionCode}
                  className={selClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">Service</label>
                <SearchableSelect
                  value={serviceSlug}
                  onChange={handleServiceChange}
                  options={serviceOptions}
                  allLabel="All services"
                  placeholder="Search services…"
                  className={selClass}
                />
              </div>
            </div>
          </>
        )}

        {/* ── COUNTY mode ── */}
        {searchMode === 'county' && (
          <div className={`grid gap-3 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            <div>
              <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">
                County
              </label>
              <SearchableSelect
                value={countyValue}
                onChange={handleCountyChange}
                options={countyOptions}
                allLabel="Select a county…"
                placeholder="Search counties…"
                className={selClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-gray mb-1 uppercase tracking-wide">Service</label>
              <SearchableSelect
                value={serviceSlug}
                onChange={handleServiceChange}
                options={serviceOptions}
                allLabel="All services"
                placeholder="Search services…"
                className={selClass}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-orange text-sm py-2.5 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find Contractors
        </button>
      </form>

      {/* Recent searches */}
      {!compact && recentSearches.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-brand-gray mb-2 font-medium">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((s) => (
              <button
                key={s.path}
                onClick={() => router.push(s.path)}
                className="text-xs bg-brand-light text-brand-blue border border-blue-100
                  px-3 py-1 rounded-full hover:bg-brand-blue hover:text-white transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
