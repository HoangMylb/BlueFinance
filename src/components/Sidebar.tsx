import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setView } from '../store/slices/settingsSlice';
import { logout } from '../store/slices/authSlice';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  PiggyBank, 
  Tags, 
  BarChart3, 
  CalendarClock, 
  Settings, 
  LogOut, 
  X,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.settings.currentView);
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as ViewType, label: 'Transactions', icon: ArrowLeftRight },
    { id: 'wallets' as ViewType, label: 'Wallets', icon: Wallet },
    { id: 'budgets' as ViewType, label: 'Budgets', icon: PiggyBank },
    { id: 'categories' as ViewType, label: 'Categories', icon: Tags },
    { id: 'reports' as ViewType, label: 'Reports', icon: BarChart3 },
    { id: 'recurring' as ViewType, label: 'Recurring Bills', icon: CalendarClock },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (view: ViewType) => {
    dispatch(setView(view));
    onClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setView('landing'));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/50">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
            <Coins className="h-5 w-5" id="sidebar-logo-icon" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
              Prosper
            </h1>
            <span className="text-xs text-slate-400 font-medium">Wealth Hub</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          id="btn-close-sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all relative ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              id={`nav-item-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme and Account Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
        {/* User Info Bar */}
        {user && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="Sign Out"
              id="btn-logout-sidebar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden lg:block w-64 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar (Animated) */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 h-full lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
