'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';

export default function GirisPage() {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // URL'den callbackUrl'i al
    const urlParams = new URLSearchParams(window.location.search);
    const callback = urlParams.get('callbackUrl');
    if (callback) {
      setCallbackUrl(callback);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Giriş denemesi başladı:', { email });
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      console.log('📋 Giriş sonucu:', result);

      if (result?.error) {
        console.error('❌ Giriş hatası:', result.error);
        setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      } else if (result?.ok) {
        console.log('✅ Giriş başarılı, yönlendiriliyor...');
        
        // Kullanıcının role'üne göre yönlendirme
        // Admin kullanıcıları admin sayfasına yönlendir
        if (email === 'admin@alo17.com') {
          router.push('/admin');
        } else {
          router.push(callbackUrl);
        }
      } else {
        console.log('⚠️ Beklenmeyen sonuç:', result);
        setError('Beklenmeyen bir hata oluştu.');
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

  const handleTestLogin = (testUser: typeof testUsers[0]) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
    // Otomatik giriş yap
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 100);
  };

  // Client-side yüklenene kadar loading göster
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hesabınıza giriş yapın
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test kullanıcıları ile hızlı giriş yapabilirsiniz
          </p>
        </div>

        {/* Test Kullanıcıları */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Test Kullanıcıları:</h3>
          <div className="space-y-2">
            {testUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleTestLogin(user)}
                className="w-full text-left text-xs text-blue-700 hover:text-blue-900 p-2 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <strong>{user.label}:</strong> {user.email}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email adresi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="/sifremi-unuttum" className="font-medium text-blue-600 hover:text-blue-500">
                Şifremi unuttum
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
              <a href="/kayit" className="font-medium text-blue-600 hover:text-blue-500">
                Kayıt olun
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 