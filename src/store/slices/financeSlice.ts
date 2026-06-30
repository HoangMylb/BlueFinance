import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, Category, Wallet, Budget, RecurringTransaction, Goal } from '../../types';

interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  budgets: Budget[];
  recurring: RecurringTransaction[];
  goals: Goal[];
}

// Generate recent dates dynamically so charts always look active and current
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Salary', icon: 'Briefcase', color: 'emerald', type: 'income' },
  { id: 'cat-2', name: 'Freelance', icon: 'Laptop', color: 'teal', type: 'income' },
  { id: 'cat-3', name: 'Investments', icon: 'TrendingUp', color: 'cyan', type: 'income' },
  { id: 'cat-4', name: 'Rent & Housing', icon: 'Home', color: 'indigo', type: 'expense' },
  { id: 'cat-5', name: 'Groceries', icon: 'ShoppingBag', color: 'amber', type: 'expense' },
  { id: 'cat-6', name: 'Dining Out', icon: 'Utensils', color: 'rose', type: 'expense' },
  { id: 'cat-7', name: 'Transport', icon: 'Car', color: 'blue', type: 'expense' },
  { id: 'cat-8', name: 'Utilities', icon: 'Zap', color: 'purple', type: 'expense' },
  { id: 'cat-9', name: 'Entertainment', icon: 'Tv', color: 'violet', type: 'expense' },
  { id: 'cat-10', name: 'Healthcare', icon: 'HeartPulse', color: 'red', type: 'expense' },
];

const defaultWallets: Wallet[] = [
  { id: 'wal-1', name: 'Checking Account', type: 'bank', balance: 5240.50, color: 'blue', accountNumber: '•••• 4256' },
  { id: 'wal-2', name: 'Cash Wallet', type: 'cash', balance: 320.00, color: 'emerald' },
  { id: 'wal-3', name: 'Credit Card', type: 'card', balance: -450.80, color: 'rose', accountNumber: '•••• 8812' },
  { id: 'wal-4', name: 'Crypto Exchange', type: 'crypto', balance: 1850.00, color: 'purple' },
];

const defaultBudgets = (month: string): Budget[] => [
  { id: 'bud-1', categoryId: 'cat-5', amount: 450, spent: 345.50, period: 'monthly', month }, // Groceries
  { id: 'bud-2', categoryId: 'cat-6', amount: 200, spent: 185.00, period: 'monthly', month }, // Dining Out
  { id: 'bud-3', categoryId: 'cat-7', amount: 150, spent: 85.00, period: 'monthly', month },  // Transport
  { id: 'bud-4', categoryId: 'cat-9', amount: 100, spent: 45.00, period: 'monthly', month },  // Entertainment
];

const defaultGoals: Goal[] = [
  { id: 'goal-1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, targetDate: '2026-12-31', color: 'indigo' },
  { id: 'goal-2', name: 'New Laptop', targetAmount: 2000, currentAmount: 1200, targetDate: '2026-09-15', color: 'teal' },
];

const defaultRecurring = (): RecurringTransaction[] => [
  {
    id: 'rec-1',
    amount: 1500,
    type: 'expense',
    categoryId: 'cat-4',
    walletId: 'wal-1',
    description: 'Apartment Monthly Rent',
    interval: 'monthly',
    nextDueDate: getPastDateString(-15), // due in 15 days
    isActive: true,
  },
  {
    id: 'rec-2',
    amount: 14.99,
    type: 'expense',
    categoryId: 'cat-9',
    walletId: 'wal-3',
    description: 'Netflix Subscription',
    interval: 'monthly',
    nextDueDate: getPastDateString(-5), // due in 5 days
    isActive: true,
  },
];

const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM

const defaultTransactions = (): Transaction[] => [
  { id: 'tx-1', date: getPastDateString(0), amount: 2500, type: 'income', categoryId: 'cat-1', walletId: 'wal-1', description: 'Bi-weekly Salary Deposit', tags: ['work', 'main'] },
  { id: 'tx-2', date: getPastDateString(1), amount: 85.50, type: 'expense', categoryId: 'cat-5', walletId: 'wal-1', description: 'Weekly Groceries Supermarket', tags: ['food'] },
  { id: 'tx-3', date: getPastDateString(2), amount: 45.00, type: 'expense', categoryId: 'cat-6', walletId: 'wal-3', description: 'Sushi Dinner with Friends', tags: ['social'] },
  { id: 'tx-4', date: getPastDateString(4), amount: 120, type: 'income', categoryId: 'cat-2', walletId: 'wal-1', description: 'Freelance Design Logo', tags: ['side-hustle'] },
  { id: 'tx-5', date: getPastDateString(5), amount: 1500, type: 'expense', categoryId: 'cat-4', walletId: 'wal-1', description: 'Monthly Rent Payment', tags: ['bills'] },
  { id: 'tx-6', date: getPastDateString(7), amount: 32.40, type: 'expense', categoryId: 'cat-7', walletId: 'wal-3', description: 'Gas Station Refuel', tags: ['car'] },
  { id: 'tx-7', date: getPastDateString(9), amount: 14.99, type: 'expense', categoryId: 'cat-9', walletId: 'wal-3', description: 'Netflix Subscription', tags: ['digital'] },
  { id: 'tx-8', date: getPastDateString(12), amount: 2500, type: 'income', categoryId: 'cat-1', walletId: 'wal-1', description: 'Bi-weekly Salary Deposit', tags: ['work'] },
  { id: 'tx-9', date: getPastDateString(14), amount: 92.10, type: 'expense', categoryId: 'cat-5', walletId: 'wal-1', description: 'Costco Wholesale Haul', tags: ['food', 'bulk'] },
  { id: 'tx-10', date: getPastDateString(16), amount: 80.00, type: 'expense', categoryId: 'cat-8', walletId: 'wal-1', description: 'Electricity Bill', tags: ['utilities'] },
  { id: 'tx-11', date: getPastDateString(18), amount: 120.00, type: 'expense', categoryId: 'cat-10', walletId: 'wal-3', description: 'Dental Checkup Copay', tags: ['medical'] },
  { id: 'tx-12', date: getPastDateString(22), amount: 350.00, type: 'income', categoryId: 'cat-3', walletId: 'wal-4', description: 'Crypto Staking Rewards', tags: ['investment'] },
  { id: 'tx-13', date: getPastDateString(25), amount: 65.00, type: 'expense', categoryId: 'cat-6', walletId: 'wal-2', description: 'Brunch and Coffee', tags: ['social'] },
  { id: 'tx-14', date: getPastDateString(28), amount: 15.00, type: 'expense', categoryId: 'cat-7', walletId: 'wal-2', description: 'Bus Pass Topup', tags: ['commute'] },
];

const loadFromStorage = <T>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const saveToStorage = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initialState: FinanceState = {
  transactions: loadFromStorage('fin_transactions', defaultTransactions()),
  categories: loadFromStorage('fin_categories', defaultCategories),
  wallets: loadFromStorage('fin_wallets', defaultWallets),
  budgets: loadFromStorage('fin_budgets', defaultBudgets(currentMonthStr)),
  recurring: loadFromStorage('fin_recurring', defaultRecurring()),
  goals: loadFromStorage('fin_goals', defaultGoals),
};

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Omit<Transaction, 'id'>>) => {
      const newTx: Transaction = {
        ...action.payload,
        id: `tx-${Date.now()}`,
      };
      state.transactions.unshift(newTx);
      
      // Automatically adjust wallet balance
      const wallet = state.wallets.find(w => w.id === newTx.walletId);
      if (wallet) {
        if (newTx.type === 'income') {
          wallet.balance += newTx.amount;
        } else {
          wallet.balance -= newTx.amount;
        }
      }

      // Automatically adjust budget spend if expense
      if (newTx.type === 'expense') {
        const txMonth = newTx.date.substring(0, 7);
        const budget = state.budgets.find(b => b.categoryId === newTx.categoryId && b.month === txMonth);
        if (budget) {
          budget.spent += newTx.amount;
        }
      }

      saveToStorage('fin_transactions', state.transactions);
      saveToStorage('fin_wallets', state.wallets);
      saveToStorage('fin_budgets', state.budgets);
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const txIndex = state.transactions.findIndex(t => t.id === action.payload);
      if (txIndex !== -1) {
        const tx = state.transactions[txIndex];
        // Revert wallet balance changes
        const wallet = state.wallets.find(w => w.id === tx.walletId);
        if (wallet) {
          if (tx.type === 'income') {
            wallet.balance -= tx.amount;
          } else {
            wallet.balance += tx.amount;
          }
        }
        // Revert budget spend changes
        if (tx.type === 'expense') {
          const txMonth = tx.date.substring(0, 7);
          const budget = state.budgets.find(b => b.categoryId === tx.categoryId && b.month === txMonth);
          if (budget) {
            budget.spent = Math.max(0, budget.spent - tx.amount);
          }
        }
        
        state.transactions.splice(txIndex, 1);
        saveToStorage('fin_transactions', state.transactions);
        saveToStorage('fin_wallets', state.wallets);
        saveToStorage('fin_budgets', state.budgets);
      }
    },
    editTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        const oldTx = state.transactions[index];
        const newTx = action.payload;

        // Revert old transaction's wallet change
        const oldWallet = state.wallets.find(w => w.id === oldTx.walletId);
        if (oldWallet) {
          if (oldTx.type === 'income') {
            oldWallet.balance -= oldTx.amount;
          } else {
            oldWallet.balance += oldTx.amount;
          }
        }

        // Apply new transaction's wallet change
        const newWallet = state.wallets.find(w => w.id === newTx.walletId);
        if (newWallet) {
          if (newTx.type === 'income') {
            newWallet.balance += newTx.amount;
          } else {
            newWallet.balance -= newTx.amount;
          }
        }

        // Revert old budget spend
        if (oldTx.type === 'expense') {
          const oldMonth = oldTx.date.substring(0, 7);
          const oldBudget = state.budgets.find(b => b.categoryId === oldTx.categoryId && b.month === oldMonth);
          if (oldBudget) {
            oldBudget.spent = Math.max(0, oldBudget.spent - oldTx.amount);
          }
        }

        // Apply new budget spend
        if (newTx.type === 'expense') {
          const newMonth = newTx.date.substring(0, 7);
          const newBudget = state.budgets.find(b => b.categoryId === newTx.categoryId && b.month === newMonth);
          if (newBudget) {
            newBudget.spent += newTx.amount;
          }
        }

        state.transactions[index] = newTx;
        saveToStorage('fin_transactions', state.transactions);
        saveToStorage('fin_wallets', state.wallets);
        saveToStorage('fin_budgets', state.budgets);
      }
    },
    addWallet: (state, action: PayloadAction<Omit<Wallet, 'id'>>) => {
      const newWallet: Wallet = {
        ...action.payload,
        id: `wal-${Date.now()}`,
      };
      state.wallets.push(newWallet);
      saveToStorage('fin_wallets', state.wallets);
    },
    editWallet: (state, action: PayloadAction<Wallet>) => {
      const index = state.wallets.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.wallets[index] = action.payload;
        saveToStorage('fin_wallets', state.wallets);
      }
    },
    deleteWallet: (state, action: PayloadAction<string>) => {
      state.wallets = state.wallets.filter(w => w.id !== action.payload);
      // Remove or reassign transactions that used this wallet? For simplicity, we just keep them but delete the wallet
      saveToStorage('fin_wallets', state.wallets);
    },
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: `cat-${Date.now()}`,
      };
      state.categories.push(newCategory);
      saveToStorage('fin_categories', state.categories);
    },
    editCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
        saveToStorage('fin_categories', state.categories);
      }
    },
    setBudget: (state, action: PayloadAction<{ categoryId: string, amount: number, period: 'monthly' | 'weekly' | 'yearly', month: string }>) => {
      const { categoryId, amount, period, month } = action.payload;
      const index = state.budgets.findIndex(b => b.categoryId === categoryId && b.month === month);

      if (index !== -1) {
        state.budgets[index].amount = amount;
      } else {
        // Calculate spent so far in this month for this category
        const spent = state.transactions
          .filter(t => t.type === 'expense' && t.categoryId === categoryId && t.date.substring(0, 7) === month)
          .reduce((sum, t) => sum + t.amount, 0);

        state.budgets.push({
          id: `bud-${Date.now()}`,
          categoryId,
          amount,
          spent,
          period,
          month
        });
      }
      saveToStorage('fin_budgets', state.budgets);
    },
    deleteBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
      saveToStorage('fin_budgets', state.budgets);
    },
    addGoal: (state, action: PayloadAction<Omit<Goal, 'id'>>) => {
      const newGoal: Goal = {
        ...action.payload,
        id: `goal-${Date.now()}`,
      };
      state.goals.push(newGoal);
      saveToStorage('fin_goals', state.goals);
    },
    updateGoalAmount: (state, action: PayloadAction<{ id: string, amount: number }>) => {
      const { id, amount } = action.payload;
      const goal = state.goals.find(g => g.id === id);
      if (goal) {
        goal.currentAmount = amount;
        saveToStorage('fin_goals', state.goals);
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(g => g.id !== action.payload);
      saveToStorage('fin_goals', state.goals);
    },
    addRecurring: (state, action: PayloadAction<Omit<RecurringTransaction, 'id' | 'isActive'>>) => {
      const newRec: RecurringTransaction = {
        ...action.payload,
        id: `rec-${Date.now()}`,
        isActive: true,
      };
      state.recurring.push(newRec);
      saveToStorage('fin_recurring', state.recurring);
    },
    toggleRecurringActive: (state, action: PayloadAction<string>) => {
      const rec = state.recurring.find(r => r.id === action.payload);
      if (rec) {
        rec.isActive = !rec.isActive;
        saveToStorage('fin_recurring', state.recurring);
      }
    },
    deleteRecurring: (state, action: PayloadAction<string>) => {
      state.recurring = state.recurring.filter(r => r.id !== action.payload);
      saveToStorage('fin_recurring', state.recurring);
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  editTransaction,
  addWallet,
  editWallet,
  deleteWallet,
  addCategory,
  editCategory,
  setBudget,
  deleteBudget,
  addGoal,
  updateGoalAmount,
  deleteGoal,
  addRecurring,
  toggleRecurringActive,
  deleteRecurring,
} = financeSlice.actions;

export default financeSlice.reducer;
