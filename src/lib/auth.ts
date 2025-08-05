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

// Session interface
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

// Local storage session yönetimi
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem('alo17-session');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.expires && new Date(session.expires) > new Date()) {
        return session;
      }
    }
  } catch (error) {
    console.error('Session okuma hatası:', error);
  }
  
  return null;
}

export function setSession(session: Session): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('alo17-session', JSON.stringify(session));
  } catch (error) {
    console.error('Session kaydetme hatası:', error);
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('alo17-session');
  } catch (error) {
    console.error('Session temizleme hatası:', error);
  }
}

export function validateUser(email: string, password: string): Session | null {
  // Mock kullanıcı doğrulama
  if (email === 'admin@alo17.com' && password === 'admin123') {
    return {
      user: {
        id: '1',
        email: 'admin@alo17.com',
        name: 'Admin',
        role: 'admin'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
  
  return null;
}

export function verifyToken(token: string): { id: string; email: string; name: string; role: string } | null {
  // Mock token doğrulama
  if (token.startsWith('mock_token_')) {
    return {
      id: '1',
      email: 'admin@alo17.com',
      name: 'Admin',
      role: 'admin'
    };
  }
  
  return null;
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