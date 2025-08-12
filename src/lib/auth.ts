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
  // Mock kullanıcı doğrulama - users.json'dan kontrol et
  const mockUsers = [
    { email: 'admin@alo17.com', password: 'TRS8n@Aw2BZLxqa', id: 'admin1', name: 'Admin User', role: 'admin' },
    { email: 'test@alo17.com', password: 'test123', id: 'test_user', name: 'Test User', role: 'user' },
    { email: 'balisari17@hotmail.com', password: 'TRS8n@Aw2BZLxqa', id: '1752843407341', name: 'Bali Sarı', role: 'user' },
    { email: 'balisaari17@hotmail.com', password: 'TRS8n@Aw2BZLxqa', id: '1752848611902', name: 'Bali Sarı', role: 'user' },
    { email: 'bali73@gmail.com', password: 'TRS8n@Aw2BZLxqa', id: '1752850270982', name: 'MEDİNE sarı', role: 'user' },
    { email: 'destek@hemenalgetir.com', password: 'TRS8n@Aw2BZLxqa', id: '1752850736095', name: 'MEDİNE sarı', role: 'user' },
    { email: 'alo@hemenalgetir.com', password: 'TRS8n@Aw2BZLxqa', id: '1752861501524', name: 'MEDİNE sarı', role: 'user' }
  ];

  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
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