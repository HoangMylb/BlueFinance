export type ViewType =
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'transactions'
  | 'categories'
  | 'wallets'
  | 'budgets'
  | 'reports'
  | 'recurring'
  | 'settings';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  currency: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  description: string;
  tags: string[];
  isRecurring?: boolean;
  recurringId?: string;
}

export type WalletType = 'bank' | 'card' | 'cash' | 'crypto';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string; // e.g. 'emerald', 'blue', 'indigo', 'purple', 'rose', 'amber'
  accountNumber?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name, e.g. 'ShoppingBag', 'Home', 'Car'
  color: string; // Tailwind color class base, e.g. 'emerald', 'amber', 'indigo'
  type: TransactionType | 'all';
}

export interface Budget {
  id: string;
  categoryId: string; // 'all' or specific category id
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  month: string; // YYYY-MM
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  description: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  color: string;
}
