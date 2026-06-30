import React, { useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setView } from '../../store/slices/settingsSlice';
import { loginSuccess } from '../../store/slices/authSlice';
import { Coins, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginSignup() {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate small auth delay
    setTimeout(() => {
      setIsLoading(false);
      dispatch(loginSuccess({
        id: `usr-${Date.now()}`,
        email,
        name: isLogin ? 'Alexander Sterling' : name,
        currency: 'USD',
      }));
      dispatch(setView('dashboard'));
    }, 1200);
  };

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      {/* Absolute Header Go Back */}
      <button
        onClick={() => dispatch(setView('landing'))}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Landing
      </button>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl p-8 space-y-6 relative overflow-hidden">
        {/* Subtle Decorative Gradient Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600" />

        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-600/15">
            <Coins className="h-5.5 w-5.5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join Prosper'}
          </h2>
          <p className="text-[11px] text-slate-400">
            {isLogin ? 'Sign in to access your wealth command center' : 'Start your automated, private financial cockpit today'}
          </p>
        </div>

        {/* Error Panel */}
        {error && (
          <div className="p-3 text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
              {isLogin && (
                <button type="button" className="text-[9px] text-indigo-600 dark:text-indigo-400 hover:underline">Forgot?</button>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10 disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Register Account'}</span>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-[10px] font-semibold text-slate-400 uppercase"><span className="bg-white dark:bg-slate-900 px-3">or</span></div>
        </div>

        {/* Demo Quick Access */}
        <button
          onClick={handleDemoLogin}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-colors"
        >
          <Sparkles className="h-4 w-4" /> Explore with Demo Mode
        </button>

        {/* Toggle Mode */}
        <p className="text-center text-xs text-slate-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
