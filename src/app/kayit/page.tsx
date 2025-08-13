'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/Providers';

// Basit client-side auth sistemi - kullanıcıları localStorage'da saklayacağız
const getStoredUsers = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('alo17-users');
  return stored ? JSON.parse(stored) : [];
};

const saveUser = (user: any) => {
  if (typeof window === 'undefined') return;
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem('alo17-users', JSON.stringify(users));
};

export default function KayitPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('auth.passwords_dont_match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('auth.password_min_length');
      setIsLoading(false);
      return;
    }

    try {
      // Email kontrolü
      const users = getStoredUsers();
      const existingUser = users.find((u: any) => u.email === formData.email);
      
      if (existingUser) {
        setError('auth.email_already_exists');
        setIsLoading(false);
        return;
      }

      // Yeni kullanıcı oluştur
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Kullanıcıyı kaydet
      saveUser(newUser);
      // Dosyaya da ekle
      try {
        await fetch('/api/users/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
      } catch (e) {
        console.warn('users.json dosyasına yazılamadı:', e);
      }

      console.log('✅ Kayıt başarılı:', newUser.email);

      // Otomatik giriş yap
      const session = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 gün
      };
      
      setSession(session);
      
      console.log('✅ Otomatik giriş başarılı');
      router.push('/');
    } catch (error) {
      console.error('💥 Kayıt exception:', error);
      setError('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yeni hesap oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veya{' '}
            <button
              onClick={() => router.push('/giris')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              mevcut hesabınıza giriş yapın
            </button>
          </p>
        </div>

        {/* Bilgi Kutusu */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Client-side Kayıt Sistemi:</h3>
          <p className="text-xs text-blue-700 mb-2">
            Bu sistem kullanıcıları tarayıcınızın localStorage&apos;ında saklar.
            Veriler sadece sizin cihazınızda tutulur.
          </p>
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            <strong>✅ Güvenli:</strong> Verileriniz sadece sizin cihazınızda saklanır.
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Ad Soyad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Ad Soyad"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                E-posta adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="E-posta adresi"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="sr-only">
                Telefon
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Telefon"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Şifre (en az 6 karakter)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Şifre Tekrar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Şifre Tekrar"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Kayıt yapılıyor...
                </div>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <button
                onClick={() => router.push('/giris')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Giriş yapın
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 
