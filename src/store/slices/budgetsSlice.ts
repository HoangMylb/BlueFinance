import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Budget } from '../../types';
import { initialBudgets } from '../../data/demoData';

interface BudgetsState {
  list: Budget[];
}

const loadState = (): BudgetsState => {
  try {
    const serialized = localStorage.getItem('bluefinance_budgets');
    if (serialized === null) {
      return { list: initialBudgets };
    }
    return JSON.parse(serialized);
  } catch (err) {
    return { list: initialBudgets };
  }
};

const initialState: BudgetsState = loadState();

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    addBudget: (state, action: PayloadAction<Omit<Budget, 'id'>>) => {
      // Check if a budget already exists for this category
      const existingIndex = state.list.findIndex(b => b.categoryId === action.payload.categoryId);
      if (existingIndex !== -1) {
        state.list[existingIndex].amount = action.payload.amount;
      } else {
        const newBudget: Budget = {
          ...action.payload,
          id: `b-${Date.now()}`
        };
        state.list.push(newBudget);
      }
      localStorage.setItem('bluefinance_budgets', JSON.stringify(state));
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.list.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('bluefinance_budgets', JSON.stringify(state));
      }
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(b => b.id !== action.payload);
      localStorage.setItem('bluefinance_budgets', JSON.stringify(state));
    },
    resetBudgets: (state) => {
      state.list = initialBudgets;
      localStorage.setItem('bluefinance_budgets', JSON.stringify({ list: initialBudgets }));
    }
  }
});

export const { addBudget, updateBudget, deleteBudget, resetBudgets } = budgetsSlice.actions;
export default budgetsSlice.reducer;
