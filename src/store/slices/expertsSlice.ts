import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Expert } from '@/lib/api';

// ─── Async thunk ──────────────────────────────────────────────────────────────

export const fetchExperts = createAsyncThunk(
  'experts/fetch',
  async (
    { zipCodes, serviceCategoryCodes }: { zipCodes: string[]; serviceCategoryCodes: string[] },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      zipCodes.forEach((z) => params.append('zip_codes[]', z));
      serviceCategoryCodes.forEach((c) => params.append('service_category_codes[]', c));

      const res = await fetch(
        `https://pros.trustpatrick.com/api/featured_experts?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const all: Expert[] = Array.isArray(data) ? data : data.experts ?? data.company_details ?? [];
      return all.slice(0, 6); // max 6
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ─── State ───────────────────────────────────────────────────────────────────

export type ExpertsStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ExpertsState {
  items: Expert[];
  status: ExpertsStatus;
  error: string | null;
  // Track which zip+service combo is currently loaded
  loadedKey: string | null;
}

const initialState: ExpertsState = {
  items: [],
  status: 'idle',
  error: null,
  loadedKey: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const expertsSlice = createSlice({
  name: 'experts',
  initialState,
  reducers: {
    clearExperts(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.loadedKey = null;
    },
    // Allow server-rendered experts to be injected into the store
    // (used on SSR landing pages to avoid client re-fetch)
    setExpertsFromServer(state, action: PayloadAction<{ experts: Expert[]; key: string }>) {
      state.items = action.payload.experts;
      state.status = 'succeeded';
      state.error = null;
      state.loadedKey = action.payload.key;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperts.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        // Build a cache key from the request args
        const { zipCodes, serviceCategoryCodes } = action.meta.arg;
        state.loadedKey = [...zipCodes, ...serviceCategoryCodes].join('|');
      })
      .addCase(fetchExperts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExperts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string ?? 'Unknown error';
        state.items = [];
      });
  },
});

export const { clearExperts, setExpertsFromServer } = expertsSlice.actions;
export default expertsSlice.reducer;
