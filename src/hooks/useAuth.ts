'use client';

import { useState, useEffect } from 'react';
import { Session, getSession, setSession, clearSession, validateUser } from '@/lib/auth';

export function useAuth() {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = getSession();
    setSessionState(savedSession);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    const validatedSession = validateUser(email, password);
    
    if (validatedSession) {
      setSession(validatedSession);
      setSessionState(validatedSession);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    clearSession();
    setSessionState(null);
  };

  return {
    session,
    setSession: setSessionState,
    isLoading,
    login,
    logout
  };
} 