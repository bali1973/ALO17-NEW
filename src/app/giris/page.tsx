'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { signIn, hardcodedUsers } from '@/lib/auth';
import Link from 'next/link';

export default function GirisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // URL'den callbackUrl veya redirect parametresini al
    const callback = searchParams.get('callbackUrl');
    const redirect = searchParams.get('redirect');
    if (callback) {
      setCallbackUrl(callback);
    } else if (redirect) {
      setCallbackUrl(redirect);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Giriş denemesi:', email);
      
      // Yeni auth sistemi ile giriş yap
      const session = await signIn(email, password);

      if (!session) {
        console.log('❌ Kullanıcı bulunamadı veya şifre yanlış');
        setError('Email veya şifre yanlış. Lütfen bilgilerinizi kontrol edin.');
        return;
      }

      console.log('✅ Giriş başarılı:', session.user.email);
      
      // Context'e session'ı kaydet
      setSession(session);
      
      // Role'e göre yönlendirme
      if (session.user.role === 'admin') {
        console.log('👑 Admin kullanıcısı, admin sayfasına yönlendiriliyor...');
        router.push('/admin');
      } else {
        console.log('👤 Normal kullanıcı, callback URL\'e yönlendiriliyor...');
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
      console.log('🔐 Test giriş denemesi:', testUser.email);
      
      // Yeni auth sistemi ile test girişi yap
      const session = await signIn(testUser.email, testUser.password);

      if (!session) {
        console.log('❌ Test kullanıcısı bulunamadı');
        setError('Test kullanıcısı bulunamadı. Lütfen veritabanını kontrol edin.');
        return;
      }

      console.log('✅ Test giriş başarılı:', session.user.email);
      
      // Context'e session'ı kaydet
      setSession(session);
      
      // Role'e göre yönlendirme
      if (session.user.role === 'admin') {
        console.log('👑 Admin test kullanıcısı, admin sayfasına yönlendiriliyor...');
        router.push('/admin');
      } else {
        console.log('👤 Normal test kullanıcısı, callback URL\'e yönlendiriliyor...');
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
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
          <p className="text-xs text-gray-500 mt-2">Lütfen bekleyin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Hesabınıza giriş yapın
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Test kullanıcıları hızlı giriş
            </p>
            {callbackUrl !== '/' && (
              <p className="mt-2 text-center text-xs text-blue-600">
                Giriş sonrası yönlendirilecek: {callbackUrl}
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
                  className="w-full text-left p-2 bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-blue-900">{user.label}</div>
                  <div className="text-xs text-blue-600">{user.email}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Test kullanıcıları açıklaması
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Formu Temizle
              </button>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-500">
                Client-side sistem
              </span>
            </div>
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
              <strong>✅ Çalışıyor:</strong> Vercel sorunlarını atlatıyor
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Giriş Hatası:</div>
                  <div className="text-sm mt-1">{error}</div>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  E-posta adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="E-posta adresi"
                />
              </div>
              <div className="mt-4 relative">
                <label htmlFor="password" className="sr-only">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Şifre"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <a href="/sifremi-unuttum" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <Link href="/kayit" className="font-medium text-blue-600 hover:text-blue-500">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
