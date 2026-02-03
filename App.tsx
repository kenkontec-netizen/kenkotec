import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { NewOrder } from './components/NewOrder';
import { Inventory } from './components/Inventory';
import { Receipt } from './components/Receipt';
import { Reports } from './components/Reports';
import { Customers } from './components/Customers';
import { Deliveries } from './components/Deliveries';
import { Sales } from './components/Sales';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Screen } from './types';
import { PostSale } from './components/PostSale';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.DASHBOARD);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    import('./lib/supabaseClient').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthenticated(true);
        }
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });

      return () => subscription.unsubscribe();
    });
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setCurrentScreen(Screen.NEW_ORDER);
      } else if (e.key === 'F3') {
        e.preventDefault();
        setCurrentScreen(Screen.INVENTORY);
        // Note: We can't easily focus the search input inside the component from here 
        // without Context/Refs, but navigation is a good start.
      } else if (e.key === 'Escape') {
        // Only go to dashboard if not already there, and maybe close modals? 
        // Ideally modals handle Esc themselves, but this provides a global "Home"
        setCurrentScreen(Screen.DASHBOARD);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.DASHBOARD:
        return <Dashboard onNavigate={setCurrentScreen} />;
      case Screen.NEW_ORDER:
        return <NewOrder onNavigate={setCurrentScreen} />;
      case Screen.INVENTORY:
        return <Inventory onNavigate={setCurrentScreen} />;
      case Screen.RECEIPT:
        return <Receipt onNavigate={setCurrentScreen} />;
      case Screen.REPORTS:
        return <Reports onNavigate={setCurrentScreen} />;
      case Screen.CUSTOMERS:
        return <Customers onNavigate={setCurrentScreen} />;
      case Screen.DELIVERIES:
        return <Deliveries onNavigate={setCurrentScreen} />;
      case Screen.SALES:
        return <Sales onNavigate={setCurrentScreen} />;
      case Screen.SETTINGS:
        return <Settings onNavigate={setCurrentScreen} onLogout={() => setIsAuthenticated(false)} />;
      case Screen.POST_SALE:
        return <PostSale onNavigate={setCurrentScreen} />;
      default:
        return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
};

export default App;