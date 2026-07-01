import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addWallet, editWallet, deleteWallet, fetchWallets } from '../../store/slices/financeSlice';
import { formatCurrency } from '../../lib/utils';
import { WalletType } from '../../types';
import { Plus, X, Landmark, CreditCard, DollarSign, Bitcoin, Smartphone, TrendingUp, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WALLET_COLORS: Record<string, string> = {
  blue: 'from-blue-600 to-indigo-600 text-white shadow-blue-500/10',
  emerald: 'from-emerald-600 to-teal-600 text-white shadow-emerald-500/10',
  purple: 'from-purple-600 to-violet-600 text-white shadow-purple-500/10',
  rose: 'from-rose-600 to-pink-600 text-white shadow-rose-500/10',
  amber: 'from-amber-500 to-orange-500 text-white shadow-amber-500/10',
  slate: 'from-slate-700 to-slate-900 text-white shadow-slate-500/10',
};

export default function WalletsView() {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.finance.wallets);

  useEffect(() => { dispatch(fetchWallets()); }, [dispatch]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('bank');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('blue');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;

    const walletData = {
      name,
      type,
      balance: parseFloat(balance),
      color,
      accountNumber: accountNumber ? `•••• ${accountNumber.slice(-4)}` : undefined,
    };

    if (editingId) {
      dispatch(editWallet({
        id: editingId,
        ...walletData,
      }));
    } else {
      dispatch(addWallet(walletData));
    }

    handleCloseForm();
  };

  const handleOpenEdit = (w: any) => {
    setEditingId(w.id);
    setName(w.name);
    setType(w.type);
    setBalance(w.balance.toString());
    setColor(w.color);
    setAccountNumber(w.accountNumber ? w.accountNumber.replace('•••• ', '') : '');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setName('');
    setType('bank');
    setBalance('');
    setColor('blue');
    setAccountNumber('');
  };

  const getWalletIcon = (type: WalletType) => {
    switch (type) {
      case 'bank': return Landmark;
      case 'card': return CreditCard;
      case 'cash': return DollarSign;
      case 'e-wallet': return Smartphone;
      case 'investment': return TrendingUp;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Wallet Registry</h1>
          <p className="text-[10px] text-slate-400">View and organize cash reserves, cards, credit limits, and bank accounts.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-colors"
          id="btn-add-wallet"
        >
          <Plus className="h-4.5 w-4.5" /> Link Account
        </button>
      </div>

      {/* Grid of Credit Card components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((w) => {
          const WalletIcon = getWalletIcon(w.type);
          const colorClass = WALLET_COLORS[w.color] || WALLET_COLORS.blue;
          
          return (
            <div 
              key={w.id}
              className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-44 group cursor-pointer`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between z-10">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/75">{w.type}</span>
                  <h3 className="font-bold text-sm tracking-tight">{w.name}</h3>
                </div>
                <div className="h-9 w-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                  <WalletIcon className="h-5 w-5" />
                </div>
              </div>

              {/* Card Body Balance */}
              <div className="z-10 mt-2">
                <span className="text-[9px] text-white/70 block uppercase font-bold tracking-wider">Available Balance</span>
                <p className="text-2xl font-extrabold tracking-tight">{formatCurrency(w.balance)}</p>
              </div>

              {/* Card Footer Account Details */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono tracking-widest opacity-80">{w.accountNumber || '•••• CASH'}</span>
                
                {/* Actions overlaying */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(w);
                    }}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors"
                    title="Edit Wallet"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(deleteWallet(w.id));
                    }}
                    className="p-1.5 rounded-lg bg-white/15 hover:bg-rose-600 hover:text-white text-white transition-colors"
                    title="Delete Wallet"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Decorative Hologram Chip and circles */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full" />
              <div className="absolute right-12 bottom-4 w-12 h-12 bg-white/5 rounded-full" />
            </div>
          );
        })}
      </div>

      {/* Slideover / Modal Dialog */}
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
                  {editingId ? 'Edit Account Link' : 'Link Bank / Cash Account'}
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Account Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chase Premium Checking"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Type</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="bank">Bank Checking</option>
                      <option value="card">Credit Card</option>
                      <option value="cash">Cash / Physical</option>
                      <option value="e-wallet">E-Wallet</option>
                      <option value="investment">Investment</option>
                    </select>
                  </div>

                  {/* Initial Balance */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Account Digits (Optional) */}
                {type !== 'cash' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Account digits / Last 4 (Optional)</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="e.g. 4256"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none"
                    />
                  </div>
                )}

                {/* Card Color Gradient Theme */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Card Theme Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(WALLET_COLORS).map((colName) => (
                      <button
                        key={colName}
                        type="button"
                        onClick={() => setColor(colName)}
                        className={`h-7 w-7 rounded-xl bg-gradient-to-br ${WALLET_COLORS[colName]} flex items-center justify-center transition-transform ${
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
                  {editingId ? 'Save Changes' : 'Link New Wallet'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
