const API_BASE = import.meta.env.VITE_API_URL || 'https://bluefinance-api.onrender.com';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Wallets ────────────────────────────────────────────────────────
export const WalletApi = {
  getAll: () => request<WalletDto[]>('/api/wallets'),
  getById: (id: string) => request<WalletDto>(`/api/wallets/${id}`),
  create: (data: CreateWalletDto) =>
    request<WalletDto>('/api/wallets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateWalletDto) =>
    request<WalletDto>(`/api/wallets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/wallets/${id}`, { method: 'DELETE' }),
};

// ─── Categories ─────────────────────────────────────────────────────
export const CategoryApi = {
  getAll: () => request<CategoryDto[]>('/api/categories'),
  getById: (id: string) => request<CategoryDto>(`/api/categories/${id}`),
  create: (data: CreateCategoryDto) =>
    request<CategoryDto>('/api/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateCategoryDto) =>
    request<CategoryDto>(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/categories/${id}`, { method: 'DELETE' }),
};

// ─── Transactions ───────────────────────────────────────────────────
export const TransactionApi = {
  getAll: (params?: { categoryId?: string; walletId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.categoryId) qs.set('categoryId', params.categoryId);
    if (params?.walletId) qs.set('walletId', params.walletId);
    const q = qs.toString();
    return request<TransactionDto[]>(`/api/transactions${q ? `?${q}` : ''}`);
  },
  getById: (id: string) => request<TransactionDto>(`/api/transactions/${id}`),
  create: (data: CreateTransactionDto) =>
    request<TransactionDto>('/api/transactions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateTransactionDto) =>
    request<TransactionDto>(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/transactions/${id}`, { method: 'DELETE' }),
};

// ─── Budgets ────────────────────────────────────────────────────────
export const BudgetApi = {
  getAll: () => request<BudgetDto[]>('/api/budgets'),
  getById: (id: string) => request<BudgetDto>(`/api/budgets/${id}`),
  create: (data: CreateBudgetDto) =>
    request<BudgetDto>('/api/budgets', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateBudgetDto) =>
    request<BudgetDto>(`/api/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/budgets/${id}`, { method: 'DELETE' }),
};

// ─── Recurring Transactions ─────────────────────────────────────────
export const RecurringApi = {
  getAll: () => request<RecurringDto[]>('/api/recurringtransactions'),
  getById: (id: string) => request<RecurringDto>(`/api/recurringtransactions/${id}`),
  create: (data: CreateRecurringDto) =>
    request<RecurringDto>('/api/recurringtransactions', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateRecurringDto) =>
    request<RecurringDto>(`/api/recurringtransactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<void>(`/api/recurringtransactions/${id}`, { method: 'DELETE' }),
};

// ─── User Profile ───────────────────────────────────────────────────
export const ProfileApi = {
  get: () => request<UserProfileDto>('/api/userprofile'),
  update: (data: Partial<UserProfileDto>) =>
    request<UserProfileDto>('/api/userprofile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── App Settings ───────────────────────────────────────────────────
export const SettingsApi = {
  get: () => request<AppSettingsDto>('/api/appsettings'),
  update: (data: Partial<AppSettingsDto>) =>
    request<AppSettingsDto>('/api/appsettings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const DashboardApi = {
  get: () => request<DashboardDto>('/api/dashboard'),
};

// ═════════════════════════════════════════════════════════════════════
// DTOs (backend response shapes)
// ═════════════════════════════════════════════════════════════════════

export interface WalletDto {
  id: string;
  name: string;
  type: string; // "Cash" | "Bank" | "EWallet" | "Investment"
  balance: number;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  type: string; // "Expense" | "Income"
  icon: string;
  color: string;
}

export interface TransactionDto {
  id: string;
  amount: number;
  type: string; // "Expense" | "Income"
  categoryId: string;
  categoryName: string;
  walletId: string;
  walletName: string;
  date: string;
  note: string;
}

export interface BudgetDto {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
}

export interface RecurringDto {
  id: string;
  name: string;
  amount: number;
  type: string;
  categoryId: string;
  categoryName: string;
  walletId: string;
  walletName: string;
  frequency: string;
  isActive: boolean;
  nextExecutionDate: string;
}

export interface UserProfileDto {
  name: string;
  email: string;
  avatarUrl: string;
  monthlySavingGoal: number;
}

export interface AppSettingsDto {
  currency: string;
  theme: string;
  language: string;
}

export interface DashboardSummaryDto {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export interface DashboardDto {
  wallets: WalletDto[];
  categories: CategoryDto[];
  transactions: TransactionDto[];
  budgets: BudgetDto[];
  recurring: RecurringDto[];
  summary: DashboardSummaryDto;
}

// ─── Request DTOs ───────────────────────────────────────────────────
export interface CreateWalletDto {
  name: string;
  type: string;
  balance: number;
  color: string;
  isActive?: boolean;
}
export interface UpdateWalletDto extends CreateWalletDto {}

export interface CreateCategoryDto {
  name: string;
  type: string;
  icon: string;
  color: string;
}
export interface UpdateCategoryDto extends CreateCategoryDto {}

export interface CreateTransactionDto {
  amount: number;
  type: string;
  categoryId: string;
  walletId: string;
  date: string;
  note: string;
}
export interface UpdateTransactionDto extends CreateTransactionDto {}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
}
export interface UpdateBudgetDto extends CreateBudgetDto {}

export interface CreateRecurringDto {
  name: string;
  amount: number;
  type: string;
  categoryId: string;
  walletId: string;
  frequency: string;
  isActive: boolean;
  nextExecutionDate: string;
}
export interface UpdateRecurringDto extends CreateRecurringDto {}

// ═════════════════════════════════════════════════════════════════════
// Mappers (backend DTO → frontend model)
// ═════════════════════════════════════════════════════════════════════

/** "Expense" → "expense", "Income" → "income" */
export function mapType(backend: string): 'income' | 'expense' {
  return backend.toLowerCase() as 'income' | 'expense';
}

/** "Cash" → "cash", "Bank" → "bank", "EWallet" → "e-wallet" */
export function mapWalletType(backend: string): string {
  const map: Record<string, string> = {
    Cash: 'cash',
    Bank: 'bank',
    EWallet: 'e-wallet',
    Investment: 'investment',
  };
  return map[backend] || backend.toLowerCase();
}

/** Frontend wallet type → backend wallet type */
export function reverseWalletType(frontend: string): string {
  const map: Record<string, string> = {
    cash: 'Cash',
    bank: 'Bank',
    'e-wallet': 'EWallet',
    investment: 'Investment',
  };
  return map[frontend] || frontend;
}

/** "Monthly" → "monthly", "Daily" → "daily", etc. */
export function mapFrequency(backend: string): string {
  return backend.toLowerCase();
}

/** Frontend interval → backend frequency */
export function reverseFrequency(frontend: string): string {
  return frontend.charAt(0).toUpperCase() + frontend.slice(1);
}

/** Truncate ISO date to YYYY-MM-DD */
export function toDateStr(iso: string): string {
  return iso.substring(0, 10);
}

/** Format frontend transaction for backend CreateTransactionDto */
export function toCreateTransactionDto(tx: {
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  walletId: string;
  date: string;
  note: string;
}): CreateTransactionDto {
  return {
    amount: tx.amount,
    type: tx.type === 'income' ? 'Income' : 'Expense',
    categoryId: tx.categoryId,
    walletId: tx.walletId,
    date: tx.date,
    note: tx.note,
  };
}
