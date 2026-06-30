import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewType } from '../../types';

interface SettingsState {
  currentView: ViewType;
  currency: string;
}

const initialState: SettingsState = {
  currentView: 'landing',
  currency: 'USD',
};

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
});

export const { setView, setCurrency } = settingsSlice.actions;
export default settingsSlice.reducer;
