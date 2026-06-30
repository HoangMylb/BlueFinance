import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types';
import { initialTransactions } from '../../data/demoData';

interface TransactionsState {
  list: Transaction[];
}

const loadState = (): TransactionsState => {
  try {
    const serialized = localStorage.getItem('bluefinance_transactions');
    if (serialized === null) {
      return { list: initialTransactions };
    }
    return JSON.parse(serialized);
  } catch (err) {
    return { list: initialTransactions };
  }
};

const initialState: TransactionsState = loadState();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTransaction: Transaction = {
        ...action.payload,
        id: `t-${Date.now()}`
      };
      state.list.unshift(newTransaction); // Add to the top of the list
      localStorage.setItem('bluefinance_transactions', JSON.stringify(state));
    },
    // We pass the full transaction so that walletsState listener can reverse the balance
    deleteTransaction: (state, action: PayloadAction<Transaction>) => {
      state.list = state.list.filter(t => t.id !== action.payload.id);
      localStorage.setItem('bluefinance_transactions', JSON.stringify(state));
    },
    // We pass both old and new transactions so walletsState listener can adjust balances
    updateTransaction: (state, action: PayloadAction<{ oldTransaction: Transaction; newTransaction: Transaction }>) => {
      const index = state.list.findIndex(t => t.id === action.payload.newTransaction.id);
      if (index !== -1) {
        state.list[index] = action.payload.newTransaction;
        localStorage.setItem('bluefinance_transactions', JSON.stringify(state));
      }
    },
    resetTransactions: (state) => {
      state.list = initialTransactions;
      localStorage.setItem('bluefinance_transactions', JSON.stringify({ list: initialTransactions }));
    }
  }
});

export const { addTransaction, deleteTransaction, updateTransaction, resetTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
