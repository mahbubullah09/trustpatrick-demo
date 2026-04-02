import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL  = 'https://pros.trustpatrick.com/api';
const QUOTE_API_URL = `${API_BASE_URL}/quote_requests`;
const LEAD_API_URL  = `${API_BASE_URL}/lead_captures`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ServiceType      { key: string; value: string }
export interface MainCategoryItem { type_id: number; categories: { key: string; value: string }[] }
export interface ServiceCategory  { type_id: number; main_category_id: number; key: string; value: string }
export interface GeneralCategories {
  serviceTypes:      ServiceType[];
  mainCategories:    MainCategoryItem[];
  serviceCategories: ServiceCategory[];
}

export interface QuotePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  timeframe: string;
  description: string;
  service_type_id: number;
  service_type_text: string;
  main_category_id?: string;
  main_category_text?: string;
  service_category_code?: string;
  service_category_text?: string;
  contractor_ids?: (string | number)[];
  contractor_names?: (string | undefined)[];
  isLead: boolean; // true → lead_captures, false → quote_requests
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const fetchGeneralServices = createAsyncThunk(
  'quote/fetchGeneralServices',
  async (serviceCategoryCodes: string[], { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      serviceCategoryCodes.forEach((c) => params.append('service_category_codes[]', c));
      const res = await fetch(`${API_BASE_URL}/general_services?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      return {
        serviceTypes:      (data.service_category_types ?? []) as ServiceType[],
        mainCategories:    (data.main_categories        ?? []) as MainCategoryItem[],
        serviceCategories: (data.service_categories     ?? []) as ServiceCategory[],
      } as GeneralCategories;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const submitQuote = createAsyncThunk(
  'quote/submit',
  async (payload: QuotePayload, { rejectWithValue }) => {
    try {
      const { isLead, ...body } = payload;
      const url = isLead ? LEAD_API_URL : QUOTE_API_URL;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      return true;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ─── State ───────────────────────────────────────────────────────────────────

interface QuoteState {
  generalData:        GeneralCategories | null;
  generalDataStatus:  'idle' | 'loading' | 'succeeded' | 'failed';
  submitting:         boolean;
  submitted:          boolean;
  submitError:        string | null;
}

const initialState: QuoteState = {
  generalData:       null,
  generalDataStatus: 'idle',
  submitting:        false,
  submitted:         false,
  submitError:       null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    resetQuote(state) {
      state.submitted   = false;
      state.submitError = null;
      state.submitting  = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGeneralServices
      .addCase(fetchGeneralServices.pending, (state) => {
        state.generalDataStatus = 'loading';
      })
      .addCase(fetchGeneralServices.fulfilled, (state, action) => {
        state.generalDataStatus = 'succeeded';
        state.generalData       = action.payload;
      })
      .addCase(fetchGeneralServices.rejected, (state) => {
        state.generalDataStatus = 'failed';
      })
      // submitQuote
      .addCase(submitQuote.pending, (state) => {
        state.submitting  = true;
        state.submitError = null;
      })
      .addCase(submitQuote.fulfilled, (state) => {
        state.submitting = false;
        state.submitted  = true;
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.submitting  = false;
        state.submitError = (action.payload as string) ?? 'Something went wrong.';
      });
  },
});

export const { resetQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
