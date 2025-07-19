// Client-side authentication utilities
// Bu dosya artık NextAuth kullanmıyor, sadece client-side auth için yardımcı fonksiyonlar içeriyor

import { prisma } from './prisma'
import { compare } from 'bcryptjs'
import { promises as fs } from 'fs';
import path from 'path';

const USERS_PATH = path.join(process.cwd(), 'public', 'users.json');

async function readUsersJson() {
  try {
    const data = await fs.readFile(USERS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

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
    location?: string;
    birthdate?: string;
  };
  expires: string;
}

// Kullanıcı tipi
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
  birthdate?: string;
}

// localStorage'dan session'ı al
export const getSession = (): Session | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const sessionData = localStorage.getItem('alo17-session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    
    // Session'ın süresi dolmuş mu kontrol et
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem('alo17-session');
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
};

// Session'ı localStorage'a kaydet
export const setSession = (session: Session): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('alo17-session', JSON.stringify(session));
};

// Session'ı localStorage'dan sil
export const clearSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('alo17-session');
};

// Kullanıcı girişi yap
export const signIn = async (email: string, password: string): Promise<Session | null> => {
  // Hardcoded kullanıcılardan ara
  const user = hardcodedUsers.find(u => u.email === email && u.password === password);
  if (user) {
    // Session oluştur
    const session: Session = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün
    };
    setSession(session);
    return session;
  }

  // Veritabanında kullanıcıyı ara
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (dbUser && dbUser.password) {
    // Şifreyi karşılaştır (önce hash, sonra düz metin)
    let isPasswordValid = false;
    try {
      isPasswordValid = await compare(password, dbUser.password);
    } catch {}
    if (!isPasswordValid) {
      // Düz metin kontrolü (geçici)
      isPasswordValid = password === dbUser.password;
    }
    if (!isPasswordValid) return null;
    // Session oluştur
    const session: Session = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: String(dbUser.role || 'user'),
        phone: dbUser.phone,
        location: dbUser.location,
        birthdate: dbUser.birthdate,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün
    };
    setSession(session);
    return session;
  }

  // JSON dosyasından kullanıcıyı ara (public/users.json) - sunucu tarafı
  const users = await readUsersJson();
  const jsonUser = users.find((u: any) => u.email === email);
  if (jsonUser && jsonUser.password) {
    let isPasswordValid = false;
    try {
      isPasswordValid = await compare(password, jsonUser.password);
    } catch {}
    if (!isPasswordValid) {
      // Düz metin kontrolü (geçici)
      isPasswordValid = password === jsonUser.password;
    }
    if (!isPasswordValid) return null;
    const session: Session = {
      user: {
        id: jsonUser.id,
        email: jsonUser.email,
        name: jsonUser.name,
        role: jsonUser.role,
        phone: jsonUser.phone,
        location: jsonUser.location,
        birthdate: jsonUser.birthdate,
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    setSession(session);
    return session;
  }

  return null;
};

// Kullanıcı çıkışı yap
export const signOut = (): void => {
  clearSession();
};

// Kullanıcının giriş yapmış olup olmadığını kontrol et
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

// Kullanıcının admin olup olmadığını kontrol et
export const isAdmin = (): boolean => {
  const session = getSession();
  return session?.user?.role === 'admin';
};

// API istekleri için authorization header'ı oluştur
export const getAuthHeader = (): string | null => {
  const session = getSession();
  if (!session) return null;
  
  return `Bearer ${JSON.stringify(session)}`;
}; 