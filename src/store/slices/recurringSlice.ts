import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecurringTransaction } from '../../types';
import { initialRecurring } from '../../data/demoData';

interface RecurringState {
  list: RecurringTransaction[];
}

const loadState = (): RecurringState => {
  try {
    const serialized = localStorage.getItem('bluefinance_recurring');
    if (serialized === null) {
      return { list: initialRecurring };
    }
    return JSON.parse(serialized);
  } catch (err) {
    return { list: initialRecurring };
  }
};

const initialState: RecurringState = loadState();

const recurringSlice = createSlice({
  name: 'recurring',
  initialState,
  reducers: {
    addRecurring: (state, action: PayloadAction<Omit<RecurringTransaction, 'id'>>) => {
      const newRecurring: RecurringTransaction = {
        ...action.payload,
        id: `r-${Date.now()}`
      };
      state.list.push(newRecurring);
      localStorage.setItem('bluefinance_recurring', JSON.stringify(state));
    },
    updateRecurring: (state, action: PayloadAction<RecurringTransaction>) => {
      const index = state.list.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('bluefinance_recurring', JSON.stringify(state));
      }
    },
    deleteRecurring: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(r => r.id !== action.payload);
      localStorage.setItem('bluefinance_recurring', JSON.stringify(state));
    },
    toggleRecurringActive: (state, action: PayloadAction<string>) => {
      const item = state.list.find(r => r.id === action.payload);
      if (item) {
        item.isActive = !item.isActive;
        localStorage.setItem('bluefinance_recurring', JSON.stringify(state));
      }
    },
    resetRecurring: (state) => {
      state.list = initialRecurring;
      localStorage.setItem('bluefinance_recurring', JSON.stringify({ list: initialRecurring }));
    }
  }
});

export const { addRecurring, updateRecurring, deleteRecurring, toggleRecurringActive, resetRecurring } = recurringSlice.actions;
export default recurringSlice.reducer;
