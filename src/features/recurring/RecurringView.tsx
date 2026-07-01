import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addRecurring, toggleRecurringActive, deleteRecurring, fetchRecurring } from '../../store/slices/financeSlice';
import { formatCurrency, formatDate } from '../../lib/utils';
import { categoryIconMap } from '../dashboard/DashboardView';
import { Plus, X, CalendarClock, AlertTriangle, ToggleLeft, ToggleRight, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RecurringView() {
  const dispatch = useAppDispatch();
  const recurring = useAppSelector((state) => state.finance.recurring);
  const categories = useAppSelector((state) => state.finance.categories);
  const wallets = useAppSelector((state) => state.finance.wallets);

  useEffect(() => { dispatch(fetchRecurring()); }, [dispatch]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form fields
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [nextDueDate, setNextDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !categoryId || !walletId || !nextDueDate) return;

    dispatch(addRecurring({
      amount: parseFloat(amount),
      type,
      categoryId,
      walletId,
      description,
      interval,
      nextDueDate,
    }));

    // Reset Form
    setDescription('');
    setAmount('');
    setType('expense');
    setCategoryId('');
    setWalletId('');
    setInterval('monthly');
    setNextDueDate('');
    setIsFormOpen(false);
  };

  const getCategoryDetails = (id: string) => {
    return categories.find(c => c.id === id) || { name: 'Uncategorized', icon: 'HelpCircle', color: 'slate' };
  };

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dateStr);
    due.setHours(0,0,0,0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredFormCategories = categories.filter(c => c.type === type || c.type === 'all');

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recurring bills & Subs</h1>
          <p className="text-[10px] text-slate-400">Track and schedule automatic bills, utilities, and online software subscriptions.</p>
        </div>
        <button
          onClick={() => {
            if (categories.length > 0) setCategoryId(categories[0].id);
            if (wallets.length > 0) setWalletId(wallets[0].id);
            setNextDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Default to 7 days from now
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
          id="btn-add-recurring"
        >
          <Plus className="h-4.5 w-4.5" /> Monitor Bill
        </button>
      </div>

      {/* Grid of Subscriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurring.map((rec) => {
          const cat = getCategoryDetails(rec.categoryId);
          const IconComponent = categoryIconMap[cat.icon] || HelpCircle;
          const daysLeft = getDaysUntil(rec.nextDueDate);
          const isOverdue = daysLeft < 0;
          
          return (
            <div 
              key={rec.id}
              className={`bg-white dark:bg-slate-900 border p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                rec.isActive 
                  ? 'border-slate-100 dark:border-slate-800/60' 
                  : 'border-slate-100 dark:border-slate-800/40 opacity-60'
              }`}
            >
              {/* Header Details */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-${cat.color}-50 dark:bg-${cat.color}-950/20 text-${cat.color}-600 dark:text-${cat.color}-400 shrink-0`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate max-w-xs">{rec.description}</h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{rec.interval} charge</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(toggleRecurringActive(rec.id))}
                    className={`p-1 transition-colors ${rec.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'}`}
                    title="Toggle active monitoring"
                  >
                    {rec.isActive ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={() => dispatch(deleteRecurring(rec.id))}
                    className="p-1 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    title="Delete Reminder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Amount and due warning */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400">Recurring Cost:</span>
                  <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{formatCurrency(rec.amount)}</p>
                </div>

                {rec.isActive ? (
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 block font-bold">Next Due Date:</span>
                    <p className={`font-bold text-xs ${
                      isOverdue 
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/15 px-2 py-0.5 rounded-md' 
                        : daysLeft <= 5 
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/15 px-2 py-0.5 rounded-md' 
                          : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {isOverdue 
                        ? `Overdue (${Math.abs(daysLeft)}d ago)` 
                        : daysLeft === 0 
                          ? 'Due Today!' 
                          : daysLeft === 1 
                            ? 'Due Tomorrow' 
                            : `In ${daysLeft} days (${formatDate(rec.nextDueDate)})`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 italic">Monitoring paused</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {recurring.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">No Recurring Bills Captured</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Remind yourself of upcoming subscription payments, utility bills, or monthly deposits early.</p>
            </div>
            <button
              onClick={() => {
                if (categories.length > 0) setCategoryId(categories[0].id);
                if (wallets.length > 0) setWalletId(wallets[0].id);
                setNextDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md"
            >
              Monitor Bill
            </button>
          </div>
        )}
      </div>

      {/* Slideover Form Backdrop */}
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
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Record Subscription Reminder</h3>
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
                    Outgoing Subscription
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
                    Incoming Contract
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spotify Premium"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cost Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Interval */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Frequency Interval</label>
                    <select
                      value={interval}
                      onChange={(e: any) => setInterval(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    >
                      {filteredFormCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Wallet */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Assigned Wallet</label>
                    <select
                      value={walletId}
                      onChange={(e) => setWalletId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                    >
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Next billing Date</label>
                  <input
                    type="date"
                    required
                    value={nextDueDate}
                    onChange={(e) => setNextDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                >
                  Confirm monitoring
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
