import type { RootState } from './store';

// ─── Search selectors ─────────────────────────────────────────────────────────

export const selectRegionCode   = (s: RootState) => s.search.regionCode;
export const selectRegionName   = (s: RootState) => s.search.regionName;
export const selectCitySlug     = (s: RootState) => s.search.citySlug;
export const selectCityName     = (s: RootState) => s.search.cityName;
export const selectServiceSlug  = (s: RootState) => s.search.serviceSlug;
export const selectRecentSearches = (s: RootState) => s.search.recentSearches;

/** Derived: build the target URL from current search state */
export const selectSearchPath = (s: RootState): string | null => {
  const { regionCode, citySlug, serviceSlug } = s.search;
  if (!regionCode) return null;
  const rc = regionCode.toLowerCase();
  if (citySlug && serviceSlug) return `/${rc}/${citySlug}/${serviceSlug}`;
  if (citySlug)               return `/${rc}/${citySlug}`;
  return `/${rc}`;
};

// ─── Experts selectors ────────────────────────────────────────────────────────

export const selectExperts      = (s: RootState) => s.experts.items;
export const selectExpertsStatus = (s: RootState) => s.experts.status;
export const selectExpertsError = (s: RootState) => s.experts.error;
export const selectExpertsCount = (s: RootState) => s.experts.items.length;
export const selectLoadedKey    = (s: RootState) => s.experts.loadedKey;

// ─── UI selectors ─────────────────────────────────────────────────────────────

export const selectMobileMenuOpen  = (s: RootState) => s.ui.mobileMenuOpen;
export const selectActiveModal     = (s: RootState) => s.ui.activeModal;
export const selectToasts          = (s: RootState) => s.ui.toasts;
export const selectSearchDrawerOpen = (s: RootState) => s.ui.searchDrawerOpen;
export const selectIsPageLoading   = (s: RootState) => s.ui.isPageLoading;
