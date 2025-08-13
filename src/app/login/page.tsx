'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/Providers';

// Basit client-side auth sistemi
const hardcodedUsers = [
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

// localStorage'dan kayıtlı kullanıcıları al
const getStoredUsers = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('alo17-users');
  return stored ? JSON.parse(stored) : [];
};

// Tüm kullanıcıları birleştir (hardcoded + localStorage)
const getAllUsers = () => {
  return [...hardcodedUsers, ...getStoredUsers()];
};

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // URL'den callbackUrl'i al
    const callback = searchParams.get('callbackUrl');
    if (callback) {
      setCallbackUrl(callback);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hardcoded kullanıcılardan ara
      const user = getAllUsers().find(u => u.email === email && u.password === password);

      if (!user) {
        setError('Email veya şifre yanlış. Lütfen bilgilerinizi kontrol edin.');
        return;
      }
      
      // Session'ı oluştur ve context'e kaydet
      const session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün
      };
      
      setSession(session);
      
      // Role'e göre yönlendirme
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('💥 Giriş exception:', error);
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Test kullanıcıları için hızlı giriş butonları
  const testUsers = [
    { email: 'admin@alo17.com', password: 'admin123', label: 'Admin' },
    { email: 'test@alo17.com', password: 'test123', label: 'Test' },
    { email: 'user@alo17.com', password: 'user123', label: 'User' },
  ];

  const handleTestLogin = async (testUser: typeof testUsers[0]) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
    setLoading(true);
    setError('');

    try {
      // Hardcoded kullanıcılardan ara
      const user = getAllUsers().find(u => u.email === testUser.email && u.password === testUser.password);

      if (!user) {
        setError('Test kullanıcısı bulunamadı. Lütfen veritabanını kontrol edin.');
        return;
      }
      
      // Session'ı oluştur ve context'e kaydet
      const session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün
      };
      
      setSession(session);
      
      // Role'e göre yönlendirme
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('💥 Test giriş exception:', error);
      setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side yüklenene kadar loading göster
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Sayfa yükleniyor...</p>
          <p className="text-xs text-gray-500 mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    );
    }

  return (
    <div className="min-h-screen bg-alo-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-alo-dark">
            Hesabınıza Giriş Yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test kullanıcıları ile hızlı giriş yapabilirsiniz
          </p>
          {callbackUrl !== '/' && (
            <p className="mt-2 text-center text-xs text-blue-600">
              Giriş yaptıktan sonra {callbackUrl} sayfasına yönlendirileceksiniz
            </p>
          )}
        </div>

        {/* Test Kullanıcıları */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Test Kullanıcıları:</h3>
          <div className="space-y-2">
            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleTestLogin(user)}
                disabled={loading}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <strong>{user.label}:</strong> {user.email} / {user.password}
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Test kullanıcıları ile hızlı giriş yapabilirsiniz. Bu kullanıcılar hardcoded olarak tanımlanmıştır.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                setError('');
                setEmail('');
                setPassword('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Formu Temizle
            </button>
            <span className="text-xs text-gray-500">|</span>
            <span className="text-xs text-gray-500">
              Client-side auth sistemi
            </span>
          </div>
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            <strong>✅ Çalışıyor:</strong> Bu sistem Vercel API sorunlarını bypass eder ve client-side çalışır.
          </div>
        </div>

          {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Giriş Hatası:</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
            </div>
          )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="/sifremi-unuttum" className="font-medium text-alo-orange hover:text-alo-dark-orange">
                Şifremi unuttum
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-alo-orange hover:bg-alo-dark-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alo-orange disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <a href="/kayit" className="font-medium text-alo-orange hover:text-alo-dark-orange">
                Kayıt olun
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
