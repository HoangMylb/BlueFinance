import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addCategory, fetchCategories } from '../../store/slices/financeSlice';
import { categoryIconMap } from '../dashboard/DashboardView';
import { Plus, X, FolderKanban, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const COLORS = ['emerald', 'teal', 'cyan', 'indigo', 'purple', 'violet', 'rose', 'red', 'amber', 'blue', 'orange', 'slate'];
const ICONS = ['Briefcase', 'Laptop', 'TrendingUp', 'Home', 'ShoppingBag', 'Utensils', 'Car', 'Zap', 'Tv', 'HeartPulse'];

export default function CategoriesView() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.finance.categories);
  const transactions = useAppSelector((state) => state.finance.transactions);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [icon, setIcon] = useState('ShoppingBag');
  const [color, setColor] = useState('indigo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    dispatch(addCategory({
      name,
      type,
      icon,
      color
    }));

    setName('');
    setIcon('ShoppingBag');
    setColor('indigo');
    setIsFormOpen(false);
  };

  const getCategorySpend = (catId: string) => {
    return transactions
      .filter(t => t.categoryId === catId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Category Definitions</h1>
          <p className="text-[10px] text-slate-400">Manage transaction categories for budgets and ledger classification.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
          id="btn-add-category"
        >
          <Plus className="h-4.5 w-4.5" /> Define Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => {
          const IconComponent = categoryIconMap[c.icon] || HelpCircle;
          const totalLogged = getCategorySpend(c.id);
          const isExpense = c.type === 'expense';
          
          return (
            <div 
              key={c.id} 
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Dynamic Theme Color Icon Frame */}
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center bg-${c.color}-50 dark:bg-${c.color}-950/20 text-${c.color}-600 dark:text-${c.color}-400 shrink-0`}>
                <IconComponent className="h-5.5 w-5.5" />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">{c.name}</h3>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    isExpense 
                      ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20' 
                      : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20'
                  }`}>
                    {c.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Aggregate ledger flows:</p>
                <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalLogged)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Slideover / Dialog */}
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
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Define Category</h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Tab */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      type === 'expense' 
                        ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Expense Cat
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      type === 'income' 
                        ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Income Cat
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gym & Fitness"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Select Icon */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {ICONS.map((icName) => {
                      const IconComp = categoryIconMap[icName] || HelpCircle;
                      return (
                        <button
                          key={icName}
                          type="button"
                          onClick={() => setIcon(icName)}
                          className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                            icon === icName 
                              ? 'bg-indigo-600 border-indigo-600 text-white' 
                              : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          <IconComp className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select Color */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Color Accent</label>
                  <div className="grid grid-cols-6 gap-2">
                    {COLORS.map((colName) => (
                      <button
                        key={colName}
                        type="button"
                        onClick={() => setColor(colName)}
                        className={`h-7 w-7 rounded-full bg-${colName}-500 flex items-center justify-center transition-transform ${
                          color === colName ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''
                        }`}
                        title={colName}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                >
                  Create Category
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
