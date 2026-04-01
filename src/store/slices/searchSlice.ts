import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchState {
  regionCode: string;       // e.g. "AK"
  regionName: string;       // e.g. "Alaska"
  citySlug: string;         // e.g. "juneau"
  cityName: string;         // e.g. "Juneau"
  serviceSlug: string;      // e.g. "asphalt-paving-companies"
  recentSearches: {
    regionCode: string;
    cityName: string;
    serviceSlug: string;
    label: string;          // human-readable e.g. "Asphalt in Juneau, AK"
    path: string;           // URL path
  }[];
}

const initialState: SearchState = {
  regionCode: '',
  regionName: '',
  citySlug: '',
  cityName: '',
  serviceSlug: '',
  recentSearches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setRegion(state, action: PayloadAction<{ code: string; name: string }>) {
      state.regionCode = action.payload.code;
      state.regionName = action.payload.name;
      // Reset city when region changes
      state.citySlug = '';
      state.cityName = '';
    },

    setCity(state, action: PayloadAction<{ slug: string; name: string }>) {
      state.citySlug = action.payload.slug;
      state.cityName = action.payload.name;
    },

    setService(state, action: PayloadAction<string>) {
      state.serviceSlug = action.payload;
    },

    clearSearch(state) {
      state.regionCode = '';
      state.regionName = '';
      state.citySlug = '';
      state.cityName = '';
      state.serviceSlug = '';
    },

    // Pre-fill search from URL params (used on landing pages)
    hydrateSearch(
      state,
      action: PayloadAction<{
        regionCode: string;
        regionName: string;
        citySlug: string;
        cityName: string;
        serviceSlug: string;
      }>
    ) {
      state.regionCode = action.payload.regionCode;
      state.regionName = action.payload.regionName;
      state.citySlug = action.payload.citySlug;
      state.cityName = action.payload.cityName;
      state.serviceSlug = action.payload.serviceSlug;
    },

    addRecentSearch(
      state,
      action: PayloadAction<{
        regionCode: string;
        cityName: string;
        serviceSlug: string;
        label: string;
        path: string;
      }>
    ) {
      // Avoid duplicates
      const exists = state.recentSearches.some((s) => s.path === action.payload.path);
      if (!exists) {
        // Keep max 5 recent searches, newest first
        state.recentSearches = [action.payload, ...state.recentSearches].slice(0, 5);
      }
    },

    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
});

export const {
  setRegion,
  setCity,
  setService,
  clearSearch,
  hydrateSearch,
  addRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
