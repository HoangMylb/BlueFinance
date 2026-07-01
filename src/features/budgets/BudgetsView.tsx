import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setBudget, deleteBudget, fetchBudgets } from '../../store/slices/financeSlice';
import { formatCurrency } from '../../lib/utils';
import { categoryIconMap } from '../dashboard/DashboardView';
import { Plus, X, AlertTriangle, PiggyBank, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function BudgetsView() {
  const dispatch = useAppDispatch();
  const budgets = useAppSelector((state) => state.finance.budgets);
  const categories = useAppSelector((state) => state.finance.categories);
  const transactions = useAppSelector((state) => state.finance.transactions);

  useEffect(() => { dispatch(fetchBudgets()); }, [dispatch]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');

  const currentMonthStr = new Date().toISOString().substring(0, 7); // YYYY-MM

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    dispatch(setBudget({
      categoryId,
      amount: parseFloat(amount),
      period: 'monthly',
      month: currentMonthStr,
    }));

    setCategoryId('');
    setAmount('');
    setIsFormOpen(false);
  };

  const getCategoryDetails = (id: string) => {
    return categories.find(c => c.id === id) || { name: 'Uncategorized', icon: 'HelpCircle', color: 'slate' };
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Find remaining unbudgeted expense categories
  const unbudgetedCategories = expenseCategories.filter(
    cat => !budgets.some(b => b.categoryId === cat.id && b.month === currentMonthStr)
  );

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Spend Control & Budgets</h1>
          <p className="text-[10px] text-slate-400">Establish maximum spending boundaries per expense category.</p>
        </div>
        {unbudgetedCategories.length > 0 && (
          <button
            onClick={() => {
              setCategoryId(unbudgetedCategories[0].id);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
            id="btn-add-budget"
          >
            <Plus className="h-4.5 w-4.5" /> Set spending Cap
          </button>
        )}
      </div>

      {/* Grid of Active Budget Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const cat = getCategoryDetails(b.categoryId);
          const IconComponent = categoryIconMap[cat.icon] || HelpCircle;
          const percent = Math.min(100, (b.spent / b.amount) * 100);
          const isOver = b.spent > b.amount;
          const remaining = Math.max(0, b.amount - b.spent);
          
          return (
            <div 
              key={b.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4"
            >
              {/* Category Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-${cat.color}-50 dark:bg-${cat.color}-950/20 text-${cat.color}-600 dark:text-${cat.color}-400 shrink-0`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">{cat.name}</h3>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Monthly Spend Target</span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(deleteBudget(b.id))}
                  className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="Remove Budget Cap"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Progress Bar & Numerical Details */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Total Spent:</span>
                  <span className="text-slate-800 dark:text-slate-100 font-bold">
                    {formatCurrency(b.spent)} / <span className="text-slate-400">{formatCurrency(b.amount)}</span>
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-indigo-600 dark:bg-indigo-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Status Badges */}
              <div className="flex items-center justify-between text-[10px] pt-1 font-semibold">
                {isOver ? (
                  <span className="text-rose-500 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/15 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Over by {formatCurrency(b.spent - b.amount)}!
                  </span>
                ) : percent > 85 ? (
                  <span className="text-amber-500 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/15 px-2 py-0.5 rounded-md">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    Approaching Limit
                  </span>
                ) : (
                  <span className="text-emerald-500 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/15 px-2 py-0.5 rounded-md">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                    Within target boundaries
                  </span>
                )}

                <span className="text-slate-500">
                  {isOver ? 'Zero remaining' : `${formatCurrency(remaining)} remaining`}
                </span>
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">No Budgets Defined</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Track category caps to avoid stealth overspending and fast-track savings goals.</p>
            </div>
            {unbudgetedCategories.length > 0 && (
              <button
                onClick={() => {
                  setCategoryId(unbudgetedCategories[0].id);
                  setIsFormOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
              >
                Set spending Cap
              </button>
            )}
          </div>
        )}
      </div>

      {/* Set Spend Limit Dialog Backdrop */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Establish Spend Cap</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSetBudget} className="space-y-4">
                {/* Select Category */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expense Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  >
                    {unbudgetedCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Monthly Spending Cap Limit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                >
                  Save Spending Limit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
