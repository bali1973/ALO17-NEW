'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { i18n } from '@/lib/i18n';

// Auth Context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
}

interface AuthContextType {
  session: { user: User } | null;
  isLoading: boolean;
  setSession: (session: { user: User } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const checkAuth = () => {
      try {
        const sessionData = localStorage.getItem('alo17-session');
        if (sessionData) {
          const data = JSON.parse(sessionData);
          if (data.user) {
            setSession({ user: data.user });
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Language Context
interface LanguageContextType {
  currentLocale: string;
  setLocale: (locale: string) => void;
  forceRefresh: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState('tr');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load locale from storage
    i18n.loadLocaleFromStorage();
    setCurrentLocale(i18n.getCurrentLocale());

    // Listen for locale changes
    const unsubscribe = i18n.onLocaleChange((locale) => {
      setCurrentLocale(locale);
      // Force page refresh when language changes
      setRefreshKey(prev => prev + 1);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    });

    return unsubscribe;
  }, []);

  const setLocale = (locale: string) => {
    i18n.setLocale(locale as 'tr' | 'en');
  };

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLocale, setLocale, forceRefresh }}>
      <div key={refreshKey}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Combined Provider
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
} 