'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { AlertCircle } from 'lucide-react';

export default function GirisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
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

  // Eğer kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('✅ Kullanıcı zaten giriş yapmış, yönlendiriliyor...', session.user);
      
      // Kullanıcının role'üne göre yönlendirme
      if (session.user?.email === 'admin@alo17.com') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    } else if (status === 'unauthenticated') {
      console.log('❌ Kullanıcı giriş yapmamış');
    } else if (status === 'loading') {
      console.log('⏳ Session yükleniyor...');
    }
  }, [status, session, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Giriş denemesi başladı:', { email, callbackUrl });
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      console.log('📋 Giriş sonucu:', result);

      if (result?.error) {
        console.error('❌ Giriş hatası:', result.error);
        if (result.error === 'CredentialsSignin') {
          setError('Email veya şifre yanlış. Lütfen test kullanıcılarını kullanın veya npm run seed komutunu çalıştırın.');
        } else {
          setError(`Giriş yapılamadı: ${result.error}. Lütfen email ve şifrenizi kontrol edin.`);
        }
      } else if (result?.ok) {
        console.log('✅ Giriş başarılı, yönlendiriliyor...');
        
        // Kullanıcının role'üne göre yönlendirme
        if (email === 'admin@alo17.com') {
          router.push('/admin');
        } else {
          router.push(callbackUrl);
        }
      } else {
        console.log('⚠️ Beklenmeyen sonuç:', result);
        setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
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
      
      const result = await signIn('credentials', {
        email: testUser.email,
        password: testUser.password,
        redirect: false,
        callbackUrl,
      });

      console.log('📋 Test giriş sonucu:', result);

      if (result?.error) {
        console.error('❌ Test giriş hatası:', result.error);
        setError(`Test giriş yapılamadı: ${result.error}. Lütfen veritabanını kontrol edin.`);
      } else if (result?.ok) {
        console.log('✅ Test giriş başarılı, yönlendiriliyor...');
        
        // Kullanıcının role'üne göre yönlendirme
        if (testUser.email === 'admin@alo17.com') {
          router.push('/admin');
        } else {
          router.push(callbackUrl);
        }
      } else {
        console.log('⚠️ Test giriş beklenmeyen sonuç:', result);
        setError('Test girişinde beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
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

  // Eğer kullanıcı zaten giriş yapmışsa loading göster
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Giriş kontrol ediliyor...</p>
          <p className="text-xs text-gray-500 mt-2">Oturum durumu kontrol ediliyor</p>
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
            Test kullanıcıları ile hızlı giriş yapabilirsiniz. Bu kullanıcılar veritabanında mevcuttur.
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
              Giriş yapılamıyorsa: npm run seed
            </span>
          </div>
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            <strong>Not:</strong> Test kullanıcıları veritabanında mevcut olmalıdır. 
            Giriş yapılamıyorsa terminal'de "npm run seed" komutunu çalıştırın.
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Giriş Hatası:</div>
              <div className="text-sm mt-1">{error}</div>
              <div className="text-xs text-red-500 mt-2">
                <strong>Çözüm:</strong> npm run seed komutunu çalıştırın ve tekrar deneyin.
              </div>
            </div>
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