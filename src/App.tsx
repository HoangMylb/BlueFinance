import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setView } from './store/slices/settingsSlice';
import LandingPage from './features/landing/LandingPage';
import LoginSignup from './features/auth/LoginSignup';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './features/dashboard/DashboardView';
import TransactionsView from './features/transactions/TransactionsView';
import CategoriesView from './features/categories/CategoriesView';
import WalletsView from './features/wallets/WalletsView';
import BudgetsView from './features/budgets/BudgetsView';
import ReportsView from './features/reports/ReportsView';
import RecurringView from './features/recurring/RecurringView';
import SettingsView from './features/settings/SettingsView';

export default function App() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const currentView = useAppSelector((state) => state.settings.currentView);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // If user is authenticated, redirect them from unauthenticated landing or login view to dashboard
  useEffect(() => {
    if (isAuthenticated && (currentView === 'landing' || currentView === 'login')) {
      dispatch(setView('dashboard'));
    }
  }, [isAuthenticated, currentView, dispatch]);

  // Route protection: If unauthenticated, redirect views
  const renderUnauthenticated = () => {
    if (currentView === 'login') {
      return <LoginSignup />;
    }
    return <LandingPage />;
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionsView />;
      case 'categories':
        return <CategoriesView />;
      case 'wallets':
        return <WalletsView />;
      case 'budgets':
        return <BudgetsView />;
      case 'reports':
        return <ReportsView />;
      case 'recurring':
        return <RecurringView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  if (!isAuthenticated && currentView !== 'dashboard' && currentView !== 'transactions' && currentView !== 'categories' && currentView !== 'wallets' && currentView !== 'budgets' && currentView !== 'reports' && currentView !== 'recurring' && currentView !== 'settings') {
    return renderUnauthenticated();
  }

  // Fallback: If not logged in but they tried to navigate deeper, force unauthenticated shell
  if (!isAuthenticated) {
    return renderUnauthenticated();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200 flex">
      {/* Main Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Frame Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Interactive Header control bar */}
        <Header 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          searchQuery={globalSearch}
          setSearchQuery={(q) => {
            setGlobalSearch(q);
            // If user searches globally, auto-focus them on the transaction history page!
            if (currentView !== 'transactions') {
              dispatch(setView('transactions'));
            }
          }}
        />
        
        {/* Active viewport content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
