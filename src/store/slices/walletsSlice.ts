import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Wallet } from '../../types';
import { initialWallets } from '../../data/demoData';

interface WalletsState {
  list: Wallet[];
}

const loadState = (): WalletsState => {
  try {
    const serialized = localStorage.getItem('bluefinance_wallets');
    if (serialized === null) {
      return { list: initialWallets };
    }
    return JSON.parse(serialized);
  } catch (err) {
    return { list: initialWallets };
  }
};

const initialState: WalletsState = loadState();

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addWallet: (state, action: PayloadAction<Omit<Wallet, 'id'>>) => {
      const newWallet: Wallet = {
        ...action.payload,
        id: `w-${Date.now()}`
      };
      state.list.push(newWallet);
      localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
    },
    updateWallet: (state, action: PayloadAction<Wallet>) => {
      const index = state.list.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
        localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
      }
    },
    deleteWallet: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(w => w.id !== action.payload);
      localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
    },
    adjustWalletBalance: (state, action: PayloadAction<{ walletId: string; amount: number }>) => {
      const wallet = state.list.find(w => w.id === action.payload.walletId);
      if (wallet) {
        wallet.balance += action.payload.amount;
        localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
      }
    },
    resetWallets: (state) => {
      state.list = initialWallets;
      localStorage.setItem('bluefinance_wallets', JSON.stringify({ list: initialWallets }));
    }
  },
  extraReducers: (builder) => {
    // We listen to transaction actions to adjust wallet balances automatically.
    // To avoid circular dependency, we listen to action types as strings.
    builder
      .addMatcher(
        (action) => action.type === 'transactions/addTransaction',
        (state, action: any) => {
          const { walletId, type, amount } = action.payload;
          const wallet = state.list.find(w => w.id === walletId);
          if (wallet) {
            if (type === 'income') {
              wallet.balance += amount;
            } else {
              wallet.balance -= amount;
            }
            localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
          }
        }
      )
      .addMatcher(
        (action) => action.type === 'transactions/deleteTransaction',
        (state, action: any) => {
          const { walletId, type, amount } = action.payload; // Payload should include full transaction details for reversal
          const wallet = state.list.find(w => w.id === walletId);
          if (wallet) {
            if (type === 'income') {
              wallet.balance -= amount;
            } else {
              wallet.balance += amount;
            }
            localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
          }
        }
      )
      .addMatcher(
        (action) => action.type === 'transactions/updateTransaction',
        (state, action: any) => {
          const { oldTransaction, newTransaction } = action.payload;
          
          // 1. Reverse the old transaction
          const oldWallet = state.list.find(w => w.id === oldTransaction.walletId);
          if (oldWallet) {
            if (oldTransaction.type === 'income') {
              oldWallet.balance -= oldTransaction.amount;
            } else {
              oldWallet.balance += oldTransaction.amount;
            }
          }

          // 2. Apply the new transaction
          const newWallet = state.list.find(w => w.id === newTransaction.walletId);
          if (newWallet) {
            if (newTransaction.type === 'income') {
              newWallet.balance += newTransaction.amount;
            } else {
              newWallet.balance -= newTransaction.amount;
            }
          }
          
          localStorage.setItem('bluefinance_wallets', JSON.stringify(state));
        }
      );
  }
});

export const { addWallet, updateWallet, deleteWallet, adjustWalletBalance, resetWallets } = walletsSlice.actions;
export default walletsSlice.reducer;
