import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import expertsReducer from './slices/expertsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    experts: expertsReducer,
    ui: uiReducer,
  },
});

// Infer RootState and AppDispatch from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
