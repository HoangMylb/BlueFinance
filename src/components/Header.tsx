import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addTransaction } from '../store/slices/financeSlice';
import { Menu, Search, Bell, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ onToggleSidebar, searchQuery, setSearchQuery }: HeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const categories = useAppSelector((state) => state.finance.categories);
  const wallets = useAppSelector((state) => state.finance.wallets);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Quick Add State
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Notifications Mock
  const notifications = [
    { id: 1, title: 'Budget Alert', message: 'You have spent 85% of your Groceries budget.', date: '10m ago', unread: true },
    { id: 2, title: 'Bill Reminder', message: 'Netflix subscription ($14.99) is due in 5 days.', date: '2h ago', unread: true },
    { id: 3, title: 'Goal Milestone', message: 'Way to go! You reached 65% of your Emergency Fund goal.', date: '1d ago', unread: false },
  ];

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !walletId || !description) return;

    dispatch(addTransaction({
      amount: parseFloat(amount),
      type,
      categoryId,
      walletId,
      description,
      date,
      tags: ['quick-add'],
    }));

    // Reset Form
    setAmount('');
    setType('expense');
    setCategoryId('');
    setWalletId('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setIsQuickAddOpen(false);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const filteredCategories = categories.filter(c => c.type === type || c.type === 'all');

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/50">
        {/* Left Section: Mobile Menu & Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 lg:hidden"
            id="btn-toggle-sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {getGreeting()}, {user?.name || 'User'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">Keep tracking, stay wealthy.</p>
          </div>
        </div>

        {/* Middle Section: Search Bar */}
        <div className="flex-1 max-w-sm mx-4 sm:mx-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions, tags, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500"
              id="header-search-input"
            />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Add Button */}
          <button
            onClick={() => {
              // Set defaults
              if (categories.length > 0) setCategoryId(categories[0].id);
              if (wallets.length > 0) setWalletId(wallets[0].id);
              setIsQuickAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all"
            id="btn-quick-add"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Transaction</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative"
              id="btn-notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
            </button>

            {/* Notification Drawer Popover */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 z-30 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">Inbox</h3>
                      <button className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Mark all read</button>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/40 max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors ${n.unread ? 'bg-indigo-50/10' : ''}`}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{n.title}</span>
                            <span className="text-[9px] text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Quick Add Dialog Backdrop */}
      <AnimatePresence>
        {isQuickAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickAddOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Quick Add Transaction</h3>
                <button
                  onClick={() => setIsQuickAddOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                  id="btn-close-quickadd"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                {/* Transaction Type Tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      type === 'expense' 
                        ? 'bg-white dark:bg-slate-900 text-rose-500 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      type === 'income' 
                        ? 'bg-white dark:bg-slate-900 text-emerald-500 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Income
                  </button>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                    id="quickadd-amount"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Starbucks Coffee"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                    id="quickadd-description"
                  />
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
                      {filteredCategories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Wallet */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Wallet</label>
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

                {/* Date */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                    id="quickadd-date"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                  id="btn-quickadd-submit"
                >
                  Save Transaction
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
