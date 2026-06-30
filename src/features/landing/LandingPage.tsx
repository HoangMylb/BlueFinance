import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setView } from '../../store/slices/settingsSlice';
import { loginSuccess } from '../../store/slices/authSlice';
import { Coins, ArrowRight, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const dispatch = useAppDispatch();

  const handleDemoLogin = () => {
    dispatch(loginSuccess({
      id: 'usr-demo',
      email: 'demo@prosper.io',
      name: 'Alexander Sterling',
      currency: 'USD',
    }));
    dispatch(setView('dashboard'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/30">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Coins className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-base bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
            Prosper
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(setView('login'))}
            className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-slate-50 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={handleDemoLogin}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15"
          >
            Launch Free Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-900/30 text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Next-generation Wealth Tracking
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Take control of your <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">financial destiny</span>.
        </h1>
        
        <p className="max-w-xl mx-auto text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Track assets, manage dynamic budgets, analyze subscriptions, and visualize your savings trends inside one highly-polished offline-first command center.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleDemoLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 transition-all shadow-lg"
          >
            Explore Interactive Demo <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => dispatch(setView('login'))}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all text-slate-700 dark:text-slate-200"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/40 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Intelligent Insights</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize net-worth projections, custom income splits, and categorical expense distributions with clear, modern charts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/40 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Private & Secured</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your financial logs are isolated locally on your device. We respect absolute data sovereignty with fully sandboxed storage.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/40 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Subscription Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Stay ahead of stealth charges. Keep an active recurring bills index and watch due-date countdowns on dynamic timers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 text-center text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/30">
        © {new Date().getFullYear()} Prosper Wealth Hub. All rights reserved. Self-hosted, local-first sandbox.
      </footer>
    </div>
  );
}
