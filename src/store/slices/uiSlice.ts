import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UiState {
  mobileMenuOpen: boolean;
  activeModal: string | null;   // modal id, e.g. 'contact-form'
  toasts: Toast[];
  searchDrawerOpen: boolean;    // mobile search drawer
  isPageLoading: boolean;
}

const initialState: UiState = {
  mobileMenuOpen: false,
  activeModal: null,
  toasts: [],
  searchDrawerOpen: false,
  isPageLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileMenu(state) {
      state.mobileMenuOpen = true;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },

    openSearchDrawer(state) {
      state.searchDrawerOpen = true;
    },
    closeSearchDrawer(state) {
      state.searchDrawerOpen = false;
    },

    setPageLoading(state, action: PayloadAction<boolean>) {
      state.isPageLoading = action.payload;
    },

    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts(state) {
      state.toasts = [];
    },
  },
});

export const {
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openModal,
  closeModal,
  openSearchDrawer,
  closeSearchDrawer,
  setPageLoading,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
