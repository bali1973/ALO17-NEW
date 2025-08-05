import { NextAuthOptions } from 'next-auth';

// NextAuth.js konfigürasyonu
export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user }) {
      return token;
    },
  },
  pages: {
    signIn: '/giris',
    error: '/giris',
  },
};

// Hardcoded test kullanıcıları
export const hardcodedUsers = [
  {
    id: '1',
    email: 'admin@alo17.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@alo17.com',
    name: 'Normal User',
    password: 'user123',
    role: 'user'
  },
  {
    id: '3',
    email: 'test@alo17.com',
    name: 'Test User',
    password: 'test123',
    role: 'user'
  }
];

// Session tipi
export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
    password?: string;
    location?: string;
    birthdate?: string;
  };
  expires: string;
  token?: string;
}

// Local storage'dan session al
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem('alo17-session');
    return sessionData ? JSON.parse(sessionData) : null;
  } catch {
    return null;
  }
}

// Session kaydet
export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('alo17-session', JSON.stringify(session));
}

// Session temizle
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('alo17-session');
}

// Kullanıcı doğrulama (client-side)
export function validateUser(email: string, password: string): Session | null {
  const user = hardcodedUsers.find(u => u.email === email && u.password === password);
  
  if (!user) return null;
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 saat sonra
    token: `mock_token_${user.id}_${Date.now()}`
  };
}

// Token doğrulama
export function verifyToken(token: string): { id: string; email: string; name: string; role: string } | null {
  // Mock token validation
  if (!token.startsWith('mock_token_')) return null;
  
  const parts = token.split('_');
  if (parts.length < 3) return null;
  
  const userId = parts[2];
  const user = hardcodedUsers.find(u => u.id === userId);
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

// Hook: Auth durumu
import { useState, useEffect } from 'react';

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

// Admin kontrolü
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'admin';
}

// Authentication guard
export function requireAuth(session: Session | null): boolean {
  return session !== null;
}

// Mock functions for backward compatibility
export const signIn = (email: string, password: string): Session | null => {
  return validateUser(email, password);
};

export const signOut = () => {
  clearSession();
};

// Server-side functions (for API routes)
export function getServerSession(): Session | null {
  // Bu server-side'da çalışmaz, API route'larda başka yöntem kullan
  return null;
}

// JWT işlemleri (mock)
export function createToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

export function parseToken(token: string): { userId: string } | null {
  if (!token.startsWith('mock_token_')) return null;
  
  const parts = token.split('_');
  if (parts.length < 3) return null;
  
  return { userId: parts[2] };
}

// Kullanıcı rolü kontrolü
export function hasRole(session: Session | null, role: string): boolean {
  return session?.user?.role === role;
}

// Permission kontrolü
export function hasPermission(session: Session | null, permission: string): boolean {
  if (!session) return false;
  
  // Admin tüm izinlere sahip
  if (session.user.role === 'admin') return true;
  
  // Diğer rol tabanlı izin kontrolü burada yapılabilir
  return false;
} 