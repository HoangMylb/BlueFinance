import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteTransaction, addTransaction } from '../../store/slices/financeSlice';
import { setView } from '../../store/slices/settingsSlice';
import { formatCurrency, formatDate } from '../../lib/utils';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Target, 
  TrendingUp, 
  Trash2, 
  PiggyBank, 
  Plus, 
  AlertTriangle,
  Tag,
  Briefcase,
  Laptop,
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Tv,
  HeartPulse,
  HelpCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

// Map icon string to Lucide component
export const categoryIconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  Laptop,
  TrendingUp,
  Home,
  ShoppingBag,
  Utensils,
  Car,
  Zap,
  Tv,
  HeartPulse
};

export default function DashboardView() {
  const dispatch = useAppDispatch();
  
  const transactions = useAppSelector((state) => state.finance.transactions);
  const wallets = useAppSelector((state) => state.finance.wallets);
  const categories = useAppSelector((state) => state.finance.categories);
  const budgets = useAppSelector((state) => state.finance.budgets);
  const goals = useAppSelector((state) => state.finance.goals);

  // Financial Metrics calculations
  const totalNetWorth = wallets.reduce((sum, w) => sum + w.balance, 0);

  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM
  
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = monthlyIncome > 0 
    ? Math.max(0, Math.min(100, ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100)) 
    : 0;

  // Chart Data preparation: Group transactions of the last 10 days
  const chartData = Array.from({ length: 10 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (9 - i));
    const dateStr = d.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(t => t.date === dateStr);
    const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Format date as e.g. "Jun 24"
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return { date: label, Income: income, Expense: expense };
  });

  const getCategoryDetails = (id: string) => {
    return categories.find(c => c.id === id) || { name: 'Uncategorized', icon: 'HelpCircle', color: 'slate' };
  };

  const getWalletDetails = (id: string) => {
    return wallets.find(w => w.id === id) || { name: 'Unknown Wallet' };
  };

  return (
    <div className="space-y-6">
      {/* 4 Cards Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Net Worth</span>
            <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{formatCurrency(totalNetWorth)}</p>
            <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-medium">Combined Wallet Balance</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="absolute right-0 bottom-0 w-12 h-12 bg-indigo-50/10 dark:bg-indigo-950/5 rounded-tl-full" />
        </motion.div>

        {/* Monthly Income */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Income</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(monthlyIncome)}</p>
            <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3 w-3" />
              <span>Current Month Deposit</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Expenses</span>
            <p className="text-xl font-extrabold text-rose-500 dark:text-rose-400">{formatCurrency(monthlyExpense)}</p>
            <div className="flex items-center gap-1 text-[9px] text-rose-500 font-semibold">
              <ArrowDownRight className="h-3 w-3" />
              <span>Total Debits Captured</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </motion.div>

        {/* Savings Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden"
        >
          <div className="space-y-1 z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Savings Rate</span>
            <p className="text-xl font-extrabold text-violet-600 dark:text-violet-400">{savingsRate.toFixed(1)}%</p>
            <span className="text-[9px] text-slate-400 font-medium">Income saved after bills</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Graph Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Daily Balance Stream</h3>
              <p className="text-[10px] text-slate-400">Comparing income deposits and debits over the past 10 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Income</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Expense</div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/30" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }} 
                />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Allocation Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Budget Warning Indicators</h3>
              <button 
                onClick={() => dispatch(setView('budgets'))} 
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                View Caps
              </button>
            </div>
            <div className="space-y-4">
              {budgets.slice(0, 3).map((b) => {
                const cat = getCategoryDetails(b.categoryId);
                const percent = Math.min(100, (b.spent / b.amount) * 100);
                const isOver = b.spent > b.amount;
                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full bg-${cat.color}-500`} />
                        {cat.name}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {formatCurrency(b.spent)} / <span className="text-slate-400">{formatCurrency(b.amount)}</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/60 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center gap-1">
                  <AlertTriangle className="h-5 w-5 text-slate-300" />
                  <span>No category budgets established for this month.</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => dispatch(setView('budgets'))}
            className="w-full flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 mt-4 transition-colors"
          >
            <Plus className="h-4.5 w-4.5" /> Establish Spend Limits
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions + Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Recent Ledger Activity</h3>
                <p className="text-[10px] text-slate-400">Your latest transactions recorded locally</p>
              </div>
              <button 
                onClick={() => dispatch(setView('transactions'))} 
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Full Log
              </button>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
              {transactions.slice(0, 5).map((t) => {
                const cat = getCategoryDetails(t.categoryId);
                const IconComponent = categoryIconMap[cat.icon] || HelpCircle;
                const isExpense = t.type === 'expense';
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between group">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Category Icon */}
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isExpense 
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{t.description}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{formatDate(t.date)}</span>
                          <span>•</span>
                          <span>{getWalletDetails(t.walletId).name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`text-xs font-bold ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                      </span>
                      <button
                        onClick={() => dispatch(deleteTransaction(t.id))}
                        className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        id={`btn-delete-tx-${t.id}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No transaction ledger events documented yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Savings Goals Meter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Savings Target Goals</h3>
              <PiggyBank className="h-4.5 w-4.5 text-indigo-500" />
            </div>

            <div className="space-y-4">
              {goals.map((g) => {
                const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                return (
                  <div key={g.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{g.name}</span>
                      <span className="text-slate-400 text-[10px]">{formatDate(g.targetDate)}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-${g.color}-500 transition-all duration-500`} 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                      <span>{percent.toFixed(1)}% complete</span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {formatCurrency(g.currentAmount)} / <span className="text-slate-400">{formatCurrency(g.targetAmount)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No saving target goals created yet.
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800/40 flex gap-2">
            <button
              onClick={() => dispatch(setView('wallets'))}
              className="flex-1 py-2 text-center rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/40 transition-colors"
            >
              Allocate Funds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
