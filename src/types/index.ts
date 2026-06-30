export type WalletType = 'cash' | 'bank' | 'e-wallet' | 'investment';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string; // Tailwind class name or gradient description
  isActive: boolean;
}

export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class for bg and text
}

export interface Transaction {
  id: string;
  amount: number;
  type: CategoryType;
  categoryId: string;
  walletId: string;
  date: string; // YYYY-MM-DD
  note: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: CategoryType;
  categoryId: string;
  walletId: string;
  frequency: RecurringFrequency;
  isActive: boolean;
  nextExecutionDate: string; // YYYY-MM-DD
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  monthlySavingGoal: number;
}

export type CurrencyType = 'VND' | 'USD' | 'EUR';
export type ThemeType = 'light' | 'dark';
export type LanguageType = 'en' | 'vi';

export interface AppSettings {
  currency: CurrencyType;
  theme: ThemeType;
  language: LanguageType;
}
