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

export async function signIn(email: string, password: string) {
  try {
    // Önce hardcoded kullanıcıları kontrol et
    const hardcodedUser = hardcodedUsers.find(
      u => u.email === email && u.password === password
    );
    
    if (hardcodedUser) {
      return {
        user: {
          id: hardcodedUser.id,
          email: hardcodedUser.email,
          name: hardcodedUser.name,
          role: hardcodedUser.role
        }
      };
    }

    // API'den giriş kontrolü yap
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      if (res.status === 401) {
        return null; // Kullanıcı bulunamadı veya şifre yanlış
      }
      throw new Error('Bağlantı hatası');
    }

    const data = await res.json();
    if (!data || !data.user) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('SignIn Error:', error);
    throw error;
  }
}

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