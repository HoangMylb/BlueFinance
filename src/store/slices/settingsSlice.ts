import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ViewType } from '../../types';
import { SettingsApi } from '../../services/api';

interface SettingsState {
  currentView: ViewType;
  currency: string;
  theme: string;
  language: string;
}

const initialState: SettingsState = {
  currentView: 'landing',
  currency: 'USD',
  theme: 'light',
  language: 'en',
};

export const fetchAppSettings = createAsyncThunk('settings/fetchAppSettings', async () => {
  return await SettingsApi.get();
});

export const updateAppSettings = createAsyncThunk('settings/updateAppSettings', async (data: any) => {
  return await SettingsApi.update(data);
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppSettings.fulfilled, (state, action) => {
        state.currency = action.payload.currency;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
      })
      .addCase(updateAppSettings.fulfilled, (state, action) => {
        state.currency = action.payload.currency;
        state.theme = action.payload.theme;
        state.language = action.payload.language;
      });
  },
});

export const { setView, setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;
