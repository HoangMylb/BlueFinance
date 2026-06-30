import { Wallet, Category, Transaction, Budget, RecurringTransaction, UserProfile, AppSettings } from '../types';

export const initialProfile: UserProfile = {
  name: 'Alex Nguyen',
  email: 'alex.nguyen@bluefinance.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80',
  monthlySavingGoal: 15000000 // 15,000,000 VND (~$600)
};

export const initialSettings: AppSettings = {
  currency: 'VND',
  theme: 'light',
  language: 'vi'
};

export const initialWallets: Wallet[] = [
  {
    id: 'w-1',
    name: 'Tiền mặt (Physical Cash)',
    type: 'cash',
    balance: 2500000, // 2,500,000 VND
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    isActive: true
  },
  {
    id: 'w-2',
    name: 'Techcombank',
    type: 'bank',
    balance: 130250000, // 130,250,000 VND
    color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    isActive: true
  },
  {
    id: 'w-3',
    name: 'Momo E-Wallet',
    type: 'e-wallet',
    balance: 12500000, // 12,500,000 VND
    color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    isActive: true
  }
];

export const initialCategories: Category[] = [
  {
    id: 'c-1',
    name: 'Ăn uống (Food & Dining)',
    type: 'expense',
    icon: 'Utensils',
    color: 'amber'
  },
  {
    id: 'c-2',
    name: 'Di chuyển (Transportation)',
    type: 'expense',
    icon: 'Car',
    color: 'blue'
  },
  {
    id: 'c-3',
    name: 'Mua sắm tạp hóa (Groceries)',
    type: 'expense',
    icon: 'ShoppingBag',
    color: 'emerald'
  },
  {
    id: 'c-4',
    name: 'Nhà ở & Điện nước (Housing & Bills)',
    type: 'expense',
    icon: 'Home',
    color: 'indigo'
  },
  {
    id: 'c-5',
    name: 'Giải trí (Entertainment)',
    type: 'expense',
    icon: 'Tv',
    color: 'purple'
  },
  {
    id: 'c-6',
    name: 'Mua sắm (Shopping)',
    type: 'expense',
    icon: 'Tag',
    color: 'rose'
  },
  {
    id: 'c-7',
    name: 'Lương (Salary)',
    type: 'income',
    icon: 'Briefcase',
    color: 'teal'
  },
  {
    id: 'c-8',
    name: 'Làm thêm (Freelance)',
    type: 'income',
    icon: 'Laptop',
    color: 'cyan'
  },
  {
    id: 'c-9',
    name: 'Đầu tư (Investments)',
    type: 'income',
    icon: 'TrendingUp',
    color: 'emerald'
  }
];

// Helper to get past dates dynamically so the chart looks real
const getPastDateString = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const initialTransactions: Transaction[] = [
  {
    id: 't-1',
    amount: 142500, // 142.500 VND
    type: 'expense',
    categoryId: 'c-1',
    walletId: 'w-1',
    date: getPastDateString(0),
    note: 'Ăn tối bún chả (Whole Foods)'
  },
  {
    id: 't-2',
    amount: 41200000, // 41.200.000 VND
    type: 'income',
    categoryId: 'c-7',
    walletId: 'w-2',
    date: getPastDateString(1),
    note: 'Lương TechCorp tháng này'
  },
  {
    id: 't-3',
    amount: 64000, // 64.000 VND
    type: 'expense',
    categoryId: 'c-1',
    walletId: 'w-3',
    date: getPastDateString(2),
    note: 'Cà phê Starbucks sáng'
  },
  {
    id: 't-4',
    amount: 240000, // 240.000 VND
    type: 'expense',
    categoryId: 'c-5',
    walletId: 'w-3',
    date: getPastDateString(3),
    note: 'Gói Netflix Premium hàng tháng'
  },
  {
    id: 't-5',
    amount: 450000, // 450.000 VND
    type: 'expense',
    categoryId: 'c-2',
    walletId: 'w-2',
    date: getPastDateString(4),
    note: 'Đổ xăng ô tô Shell'
  },
  {
    id: 't-6',
    amount: 1200000, // 1.200.000 VND
    type: 'expense',
    categoryId: 'c-6',
    walletId: 'w-2',
    date: getPastDateString(5),
    note: 'Mua giày chạy bộ mới'
  },
  {
    id: 't-7',
    amount: 5000000, // 5.000.000 VND
    type: 'income',
    categoryId: 'c-8',
    walletId: 'w-2',
    date: getPastDateString(6),
    note: 'Thiết kế website freelance'
  },
  {
    id: 't-8',
    amount: 1500000, // 1.500.000 VND
    type: 'expense',
    categoryId: 'c-3',
    walletId: 'w-1',
    date: getPastDateString(7),
    note: 'Đi siêu thị Winmart mua đồ cả tuần'
  },
  {
    id: 't-9',
    amount: 6500000, // 6.500.000 VND
    type: 'expense',
    categoryId: 'c-4',
    walletId: 'w-2',
    date: getPastDateString(10),
    note: 'Tiền thuê nhà tháng này'
  },
  {
    id: 't-10',
    amount: 800000, // 800.000 VND
    type: 'expense',
    categoryId: 'c-4',
    walletId: 'w-2',
    date: getPastDateString(12),
    note: 'Tiền điện nước internet'
  },
  {
    id: 't-11',
    amount: 1500000, // 1.500.000 VND
    type: 'income',
    categoryId: 'c-9',
    walletId: 'w-2',
    date: getPastDateString(15),
    note: 'Cổ tức chứng khoán'
  },
  {
    id: 't-12',
    amount: 320000, // 320.000 VND
    type: 'expense',
    categoryId: 'c-1',
    walletId: 'w-1',
    date: getPastDateString(18),
    note: 'Ăn trưa buffet cùng đồng nghiệp'
  }
];

export const initialBudgets: Budget[] = [
  {
    id: 'b-1',
    categoryId: 'c-1', // Food & Dining
    amount: 5000000 // 5.000.000 VND
  },
  {
    id: 'b-2',
    categoryId: 'c-2', // Transportation
    amount: 2000000 // 2.000.000 VND
  },
  {
    id: 'b-3',
    categoryId: 'c-6', // Shopping
    amount: 3000000 // 3.000.000 VND
  },
  {
    id: 'b-4',
    categoryId: 'c-3', // Groceries
    amount: 4000000 // 4.000.000 VND
  },
  {
    id: 'b-5',
    categoryId: 'c-5', // Entertainment
    amount: 1500000 // 1.500.000 VND
  }
];

export const initialRecurring: RecurringTransaction[] = [
  {
    id: 'r-1',
    name: 'Lương chính thức TechCorp',
    amount: 41200000,
    type: 'income',
    categoryId: 'c-7',
    walletId: 'w-2',
    frequency: 'monthly',
    isActive: true,
    nextExecutionDate: getPastDateString(-29) // 29 days in the future
  },
  {
    id: 'r-2',
    name: 'Tiền thuê nhà Vinhomes',
    amount: 6500000,
    type: 'expense',
    categoryId: 'c-4',
    walletId: 'w-2',
    frequency: 'monthly',
    isActive: true,
    nextExecutionDate: getPastDateString(-10) // 10 days in future
  },
  {
    id: 'r-3',
    name: 'Gói Netflix Premium',
    amount: 240000,
    type: 'expense',
    categoryId: 'c-5',
    walletId: 'w-3',
    frequency: 'monthly',
    isActive: true,
    nextExecutionDate: getPastDateString(-27) // 27 days in future
  },
  {
    id: 'r-4',
    name: 'Gói tập Gym California',
    amount: 800000,
    type: 'expense',
    categoryId: 'c-5',
    walletId: 'w-2',
    frequency: 'monthly',
    isActive: false, // Paused
    nextExecutionDate: getPastDateString(-1)
  }
];
