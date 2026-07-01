import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateProfile, fetchProfile } from '../../store/slices/authSlice';
import { setCurrency, fetchAppSettings } from '../../store/slices/settingsSlice';
import { ShieldAlert, Sparkles, User2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export default function SettingsView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const currency = useAppSelector((state) => state.settings.currency);

  useEffect(() => { dispatch(fetchProfile()); dispatch(fetchAppSettings()); }, [dispatch]);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [feedback, setFeedback] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    dispatch(updateProfile({
      name,
      email,
    }));

    setFeedback('Profile updated successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you absolutely sure you want to clear all transactions, categories, wallets, and budgets? This cannot be undone!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* View Header Bar */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">User Settings</h1>
        <p className="text-[10px] text-slate-400">Configure profile attributes, local currencies, and database parameters.</p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/15 dark:text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-100 dark:border-emerald-900/30">
          {feedback}
        </div>
      )}

      {/* Grid of Settings Modules */}
      <div className="space-y-6">
        {/* Profile Details Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50 dark:border-slate-800">
            <User2 className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">Profile Details</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-xl shadow-md"
            >
              Save Profile Attributes
            </button>
          </form>
        </div>

        {/* Currency preference */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-50 dark:border-slate-800">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100">Preferences & Localisation</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Display Currency</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => dispatch(setCurrency(curr.code))}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      currency === curr.code
                        ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500'
                    }`}
                  >
                    <p className="text-xs font-bold leading-none">{curr.code} ({curr.symbol})</p>
                    <p className="text-[9px] text-slate-400 mt-1">{curr.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Destructive Parameters */}
        <div className="bg-rose-50/15 dark:bg-rose-950/5 border border-rose-100/40 dark:border-rose-900/10 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-5 w-5 text-rose-500" />
            <h3 className="font-bold text-xs text-rose-500">Destructive Actions</h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Flush current account memory. Clearing local cache will erase all wallets, transactional ledgers, categories, and custom budgets permanently.
          </p>
          <button
            onClick={handleClearData}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors rounded-xl shadow-md"
            id="btn-clear-db"
          >
            Clear Ledger Database
          </button>
        </div>
      </div>
    </div>
  );
}
