import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addTransaction, editTransaction, deleteTransaction } from '../../store/slices/financeSlice';
import { formatCurrency, formatDate } from '../../lib/utils';
import { categoryIconMap } from '../dashboard/DashboardView';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Download,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TransactionsView() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.finance.transactions);
  const categories = useAppSelector((state) => state.finance.categories);
  const wallets = useAppSelector((state) => state.finance.wallets);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [walletFilter, setWalletFilter] = useState('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form Field States
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [walletId, setWalletId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagInput, setTagInput] = useState('');

  // Handle Form Submit (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !walletId || !description) return;

    const parsedTags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const txData = {
      amount: parseFloat(amount),
      type,
      categoryId,
      walletId,
      description,
      date,
      tags: parsedTags,
    };

    if (editingId) {
      dispatch(editTransaction({
        id: editingId,
        ...txData,
      }));
    } else {
      dispatch(addTransaction(txData));
    }

    handleCloseForm();
  };

  const handleOpenEdit = (tx: any) => {
    setEditingId(tx.id);
    setAmount(tx.amount.toString());
    setType(tx.type);
    setCategoryId(tx.categoryId);
    setWalletId(tx.walletId);
    setDescription(tx.description);
    setDate(tx.date);
    setTagInput(tx.tags ? tx.tags.join(', ') : '');
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setAmount('');
    setType('expense');
    setCategoryId(categories.length > 0 ? categories[0].id : '');
    setWalletId(wallets.length > 0 ? wallets[0].id : '');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setTagInput('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setAmount('');
    setDescription('');
    setTagInput('');
  };

  // Filter & Sort Application
  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || tx.categoryId === categoryFilter;
      const matchesWallet = walletFilter === 'all' || tx.walletId === walletFilter;
      
      return matchesSearch && matchesType && matchesCategory && matchesWallet;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getCategoryDetails = (id: string) => {
    return categories.find(c => c.id === id) || { name: 'Uncategorized', icon: 'HelpCircle', color: 'slate' };
  };

  const getWalletDetails = (id: string) => {
    return wallets.find(w => w.id === id) || { name: 'Unknown Wallet' };
  };

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportCSV = () => {
    const headers = ['Date,Description,Type,Category,Wallet,Amount,Tags\n'];
    const rows = filteredTransactions.map(t => {
      const cat = getCategoryDetails(t.categoryId);
      const wal = getWalletDetails(t.walletId);
      return `${t.date},"${t.description.replace(/"/g, '""')}",${t.type},"${cat.name}","${wal.name}",${t.amount},"${t.tags.join(';')}"\n`;
    });
    
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Prosper_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  const filteredFormCategories = categories.filter(c => c.type === type || c.type === 'all');

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Transaction Ledger</h1>
          <p className="text-[10px] text-slate-400">View, audit, edit and log financial transaction entries.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            id="btn-export-csv"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
            id="btn-add-transaction"
          >
            <Plus className="h-4.5 w-4.5" /> Record Entry
          </button>
        </div>
      </div>

      {/* Control Filter Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-3 sm:flex items-center gap-2.5 w-full md:w-auto">
            {/* Type */}
            <div className="flex flex-col">
              <select
                value={typeFilter}
                onChange={(e: any) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Wallet */}
            <div className="flex flex-col">
              <select
                value={walletFilter}
                onChange={(e) => setWalletFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Wallets</option>
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-6 cursor-pointer select-none hover:text-slate-600 dark:hover:text-slate-200" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    {sortField === 'date' && (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                  </div>
                </th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Wallet</th>
                <th className="py-3.5 px-6 cursor-pointer select-none hover:text-slate-600 dark:hover:text-slate-200" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    {sortField === 'amount' && (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                  </div>
                </th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-xs text-slate-700 dark:text-slate-300">
              {filteredTransactions.map((t) => {
                const cat = getCategoryDetails(t.categoryId);
                const IconComponent = categoryIconMap[cat.icon] || HelpCircle;
                const isExpense = t.type === 'expense';
                return (
                  <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-6 font-medium whitespace-nowrap">{formatDate(t.date)}</td>
                    
                    {/* Description */}
                    <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white max-w-xs truncate">{t.description}</td>
                    
                    {/* Category */}
                    <td className="py-3.5 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 bg-${cat.color}-50 dark:bg-${cat.color}-950/20 text-${cat.color}-600 dark:text-${cat.color}-400`}>
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold">{cat.name}</span>
                      </div>
                    </td>

                    {/* Wallet */}
                    <td className="py-3.5 px-6 whitespace-nowrap font-medium text-slate-500">{getWalletDetails(t.walletId).name}</td>

                    {/* Amount */}
                    <td className={`py-3.5 px-6 font-extrabold whitespace-nowrap ${isExpense ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {isExpense ? '-' : '+'}{formatCurrency(t.amount)}
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-6">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {t.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          title="Edit Transaction"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => dispatch(deleteTransaction(t.id))}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          title="Delete Transaction"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No matching ledger transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record / Edit Dialog Backdrop */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {editingId ? 'Edit Transaction Entry' : 'Record Transaction Entry'}
                </h3>
                <button
                  onClick={handleCloseForm}
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
                    Expense
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
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekly Groceries"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
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
                      {filteredFormCategories.map((c) => (
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
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. food, starbucks, dinner"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                >
                  {editingId ? 'Update Ledger Entry' : 'Record Ledger Entry'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
