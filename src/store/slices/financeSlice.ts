import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, Category, Wallet, Budget, RecurringTransaction, Goal } from '../../types';
import {
  WalletApi, CategoryApi, TransactionApi, BudgetApi, RecurringApi, DashboardApi,
  WalletDto, CategoryDto, TransactionDto, BudgetDto, RecurringDto,
  mapType, mapWalletType, mapFrequency, toDateStr, toCreateTransactionDto,
  reverseWalletType, reverseFrequency,
} from '../../services/api';

// ─── Mapper Functions (backend DTO → frontend model) ─────────────────

function mapWallet(dto: WalletDto): Wallet {
  return {
    id: dto.id,
    name: dto.name,
    type: mapWalletType(dto.type) as Wallet['type'],
    balance: dto.balance,
    color: dto.color,
    accountNumber: undefined,
  };
}

function mapCategory(dto: CategoryDto): Category {
  return {
    id: dto.id,
    name: dto.name,
    icon: dto.icon,
    color: dto.color,
    type: mapType(dto.type),
  };
}

function mapTransaction(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    date: toDateStr(dto.date),
    amount: dto.amount,
    type: mapType(dto.type),
    categoryId: dto.categoryId,
    walletId: dto.walletId,
    description: dto.note,
    tags: [],
  };
}

function mapBudget(dto: BudgetDto): Budget {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return {
    id: dto.id,
    categoryId: dto.categoryId,
    amount: dto.amount,
    spent: dto.spent,
    period: 'monthly',
    month,
  };
}

function mapRecurring(dto: RecurringDto): RecurringTransaction {
  return {
    id: dto.id,
    amount: dto.amount,
    type: mapType(dto.type),
    categoryId: dto.categoryId,
    walletId: dto.walletId,
    description: dto.name,
    interval: mapFrequency(dto.frequency) as RecurringTransaction['interval'],
    nextDueDate: toDateStr(dto.nextExecutionDate),
    isActive: dto.isActive,
  };
}

// ─── State ────────────────────────────────────────────────────────────

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  budgets: Budget[];
  recurring: RecurringTransaction[];
  goals: Goal[];
  loading: boolean;
  error: string | null;
}

// Goals remain localStorage-only (no backend support)
const savedGoals: Goal[] = (() => {
  try {
    const raw = localStorage.getItem('fin_goals');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
})();

const initialState: FinanceState = {
  transactions: [],
  categories: [],
  wallets: [],
  budgets: [],
  recurring: [],
  goals: savedGoals,
  loading: false,
  error: null,
};

// ─── Fetch Thunks ─────────────────────────────────────────────────────

export const fetchWallets = createAsyncThunk('finance/fetchWallets', async () => {
  const dtos = await WalletApi.getAll();
  return dtos.map(mapWallet);
});

export const fetchCategories = createAsyncThunk('finance/fetchCategories', async () => {
  const dtos = await CategoryApi.getAll();
  return dtos.map(mapCategory);
});

export const fetchTransactions = createAsyncThunk('finance/fetchTransactions', async () => {
  const dtos = await TransactionApi.getAll();
  return dtos.map(mapTransaction);
});

export const fetchBudgets = createAsyncThunk('finance/fetchBudgets', async () => {
  const dtos = await BudgetApi.getAll();
  return dtos.map(mapBudget);
});

export const fetchRecurring = createAsyncThunk('finance/fetchRecurring', async () => {
  const dtos = await RecurringApi.getAll();
  return dtos.map(mapRecurring);
});

export const fetchAll = createAsyncThunk('finance/fetchAll', async () => {
  const dto = await DashboardApi.get();
  return {
    wallets: dto.wallets.map(mapWallet),
    categories: dto.categories.map(mapCategory),
    transactions: dto.transactions.map(mapTransaction),
    budgets: dto.budgets.map(mapBudget),
    recurring: dto.recurring.map(mapRecurring),
  };
});

// ─── Transaction Mutation Thunks ──────────────────────────────────────

export const addTransaction = createAsyncThunk(
  'finance/addTransaction',
  async (data: Omit<Transaction, 'id'>) => {
    const dto = await TransactionApi.create(toCreateTransactionDto({
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      walletId: data.walletId,
      date: data.date,
      note: data.description,
    }));
    return mapTransaction(dto);
  },
);

export const editTransaction = createAsyncThunk(
  'finance/editTransaction',
  async (data: Transaction) => {
    const dto = await TransactionApi.update(data.id, {
      amount: data.amount,
      type: data.type === 'income' ? 'Income' : 'Expense',
      categoryId: data.categoryId,
      walletId: data.walletId,
      date: data.date,
      note: data.description,
    });
    return mapTransaction(dto);
  },
);

export const deleteTransaction = createAsyncThunk(
  'finance/deleteTransaction',
  async (id: string) => {
    await TransactionApi.delete(id);
    return id;
  },
);

// ─── Wallet Mutation Thunks ───────────────────────────────────────────

export const addWallet = createAsyncThunk(
  'finance/addWallet',
  async (data: Omit<Wallet, 'id'>) => {
    const dto = await WalletApi.create({
      name: data.name,
      type: reverseWalletType(data.type),
      balance: data.balance,
      color: data.color,
    });
    return mapWallet(dto);
  },
);

export const editWallet = createAsyncThunk(
  'finance/editWallet',
  async (data: Wallet) => {
    const dto = await WalletApi.update(data.id, {
      name: data.name,
      type: reverseWalletType(data.type),
      balance: data.balance,
      color: data.color,
    });
    return mapWallet(dto);
  },
);

export const deleteWallet = createAsyncThunk(
  'finance/deleteWallet',
  async (id: string) => {
    await WalletApi.delete(id);
    return id;
  },
);

// ─── Category Mutation Thunks ─────────────────────────────────────────

export const addCategory = createAsyncThunk(
  'finance/addCategory',
  async (data: Omit<Category, 'id'>) => {
    const dto = await CategoryApi.create({
      name: data.name,
      type: data.type === 'all' ? 'Expense' : data.type === 'income' ? 'Income' : 'Expense',
      icon: data.icon,
      color: data.color,
    });
    return mapCategory(dto);
  },
);

export const editCategory = createAsyncThunk(
  'finance/editCategory',
  async (data: Category) => {
    const dto = await CategoryApi.update(data.id, {
      name: data.name,
      type: data.type === 'all' ? 'Expense' : data.type === 'income' ? 'Income' : 'Expense',
      icon: data.icon,
      color: data.color,
    });
    return mapCategory(dto);
  },
);

// ─── Budget Mutation Thunks ──────────────────────────────────────────

export const setBudget = createAsyncThunk(
  'finance/setBudget',
  async (payload: { categoryId: string; amount: number; period: Budget['period']; month: string }, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const existing = state.finance.budgets.find(
      b => b.categoryId === payload.categoryId && b.month === payload.month,
    );
    if (existing) {
      const dto = await BudgetApi.update(existing.id, {
        categoryId: payload.categoryId,
        amount: payload.amount,
      });
      return { ...mapBudget(dto), period: payload.period, month: payload.month };
    }
    const dto = await BudgetApi.create({
      categoryId: payload.categoryId,
      amount: payload.amount,
    });
    return { ...mapBudget(dto), period: payload.period, month: payload.month };
  },
);

export const deleteBudget = createAsyncThunk(
  'finance/deleteBudget',
  async (id: string) => {
    await BudgetApi.delete(id);
    return id;
  },
);

// ─── Recurring Mutation Thunks ────────────────────────────────────────

export const addRecurring = createAsyncThunk(
  'finance/addRecurring',
  async (data: Omit<RecurringTransaction, 'id' | 'isActive'>) => {
    const dto = await RecurringApi.create({
      name: data.description,
      amount: data.amount,
      type: data.type === 'income' ? 'Income' : 'Expense',
      categoryId: data.categoryId,
      walletId: data.walletId,
      frequency: reverseFrequency(data.interval),
      isActive: true,
      nextExecutionDate: data.nextDueDate,
    });
    return mapRecurring(dto);
  },
);

export const toggleRecurringActive = createAsyncThunk(
  'finance/toggleRecurringActive',
  async (id: string, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const rec = state.finance.recurring.find(r => r.id === id);
    if (!rec) throw new Error('Recurring transaction not found');
    const dto = await RecurringApi.update(id, {
      name: rec.description,
      amount: rec.amount,
      type: rec.type === 'income' ? 'Income' : 'Expense',
      categoryId: rec.categoryId,
      walletId: rec.walletId,
      frequency: reverseFrequency(rec.interval),
      isActive: !rec.isActive,
      nextExecutionDate: rec.nextDueDate,
    });
    return mapRecurring(dto);
  },
);

export const deleteRecurring = createAsyncThunk(
  'finance/deleteRecurring',
  async (id: string) => {
    await RecurringApi.delete(id);
    return id;
  },
);

// ─── Slice ────────────────────────────────────────────────────────────

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    // Goals are localStorage-only (no backend support)
    addGoal: (state, action: PayloadAction<Omit<Goal, 'id'>>) => {
      const newGoal: Goal = {
        ...action.payload,
        id: `goal-${Date.now()}`,
      };
      state.goals.push(newGoal);
      localStorage.setItem('fin_goals', JSON.stringify(state.goals));
    },
    updateGoalAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const { id, amount } = action.payload;
      const goal = state.goals.find(g => g.id === id);
      if (goal) {
        goal.currentAmount = amount;
        localStorage.setItem('fin_goals', JSON.stringify(state.goals));
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
      localStorage.setItem('fin_goals', JSON.stringify(state.goals));
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchAll ────────────────────────────────────────────────
      .addCase(fetchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.wallets = action.payload.wallets;
        state.categories = action.payload.categories;
        state.transactions = action.payload.transactions;
        state.budgets = action.payload.budgets;
        state.recurring = action.payload.recurring;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load data';
      })

      // ── Individual fetches ──────────────────────────────────────
      .addCase(fetchWallets.fulfilled, (state, action) => { state.wallets = action.payload; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
      .addCase(fetchTransactions.fulfilled, (state, action) => { state.transactions = action.payload; })
      .addCase(fetchBudgets.fulfilled, (state, action) => { state.budgets = action.payload; })
      .addCase(fetchRecurring.fulfilled, (state, action) => { state.recurring = action.payload; })

      // ── Transaction mutations ───────────────────────────────────
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const idx = state.transactions.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.transactions[idx] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      })

      // ── Wallet mutations ────────────────────────────────────────
      .addCase(addWallet.fulfilled, (state, action) => {
        state.wallets.push(action.payload);
      })
      .addCase(editWallet.fulfilled, (state, action) => {
        const idx = state.wallets.findIndex(w => w.id === action.payload.id);
        if (idx !== -1) state.wallets[idx] = action.payload;
      })
      .addCase(deleteWallet.fulfilled, (state, action) => {
        state.wallets = state.wallets.filter(w => w.id !== action.payload);
      })

      // ── Category mutations ──────────────────────────────────────
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const idx = state.categories.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.categories[idx] = action.payload;
      })

      // ── Budget mutations ────────────────────────────────────────
      .addCase(setBudget.fulfilled, (state, action) => {
        const idx = state.budgets.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) {
          state.budgets[idx] = action.payload;
        } else {
          state.budgets.push(action.payload);
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(b => b.id !== action.payload);
      })

      // ── Recurring mutations ─────────────────────────────────────
      .addCase(addRecurring.fulfilled, (state, action) => {
        state.recurring.push(action.payload);
      })
      .addCase(toggleRecurringActive.fulfilled, (state, action) => {
        const idx = state.recurring.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.recurring[idx] = action.payload;
      })
      .addCase(deleteRecurring.fulfilled, (state, action) => {
        state.recurring = state.recurring.filter(r => r.id !== action.payload);
      });
  },
});

export const { addGoal, updateGoalAmount, deleteGoal } = financeSlice.actions;
export default financeSlice.reducer;
