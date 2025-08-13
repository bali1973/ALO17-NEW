'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Mail, Apple } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { signIn } from '@/lib/auth';
import { useOAuthCallback } from '@/hooks/useOAuthCallback';
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

  // OAuth callback'leri işle
  const { oauthError } = useOAuthCallback();

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

    // OAuth callback parametrelerini kontrol et
    const oauthSuccess = searchParams.get('oauth_success');
    const oauthProvider = searchParams.get('provider');
    const oauthToken = searchParams.get('token');
    const oauthError = searchParams.get('error');

    if (oauthSuccess === 'true' && oauthToken && oauthProvider) {
      // OAuth girişi başarılı
      console.log(`✅ ${oauthProvider} ile giriş başarılı`);
      
      // Token'ı context'e kaydet
      const session = {
        user: {
          id: '', // Token'dan çıkarılacak
          email: '', // Token'dan çıkarılacak
          role: 'user' as const
        },
        accessToken: oauthToken
      };
      
      setSession(session);
      
      // Ana sayfaya yönlendir
      router.push('/');
    } else if (oauthError) {
      // OAuth hatası
      setError(decodeURIComponent(oauthError));
    }
  }, [searchParams, setSession, router]);

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

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`🔐 ${provider} ile giriş denemesi`);
      
      // OAuth provider'a yönlendir
      let authUrl = '';
      
      switch (provider.toLowerCase()) {
        case 'google':
          authUrl = `/api/auth/google`;
          break;
        case 'facebook':
          authUrl = `/api/auth/facebook`;
          break;
        case 'apple':
          authUrl = `/api/auth/apple`;
          break;
        default:
          throw new Error(`Desteklenmeyen provider: ${provider}`);
      }
      
      // OAuth provider'a yönlendir
      window.location.href = authUrl;
      
    } catch (error) {
      console.error(`💥 ${provider} giriş hatası:`, error);
      setError(`${provider} ile giriş yapılırken hata oluştu.`);
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
            {callbackUrl !== '/' && (
              <p className="mt-2 text-center text-xs text-blue-600">
                Giriş sonrası yönlendirilecek: {callbackUrl}
              </p>
            )}
          </div>

          {(error || oauthError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Giriş Hatası:</div>
                  <div className="text-sm mt-1">{error || decodeURIComponent(oauthError || '')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sosyal Medya Giriş Seçenekleri */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile giriş yap
            </button>



            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Apple className="w-5 h-5 mr-3" />
              Apple ile giriş yap
            </button>
          </div>

          {/* Ayırıcı */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">veya</span>
            </div>
          </div>

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
