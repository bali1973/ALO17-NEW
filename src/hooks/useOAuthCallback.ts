import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';

export const useOAuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
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
          name: '', // Token'dan çıkarılacak
          role: 'user' as const
        },
        accessToken: oauthToken
      };
      
      setSession(session);
      
      // Ana sayfaya yönlendir
      router.push('/');
    } else if (oauthError) {
      // OAuth hatası - giriş sayfasında gösterilecek
      console.error('OAuth Error:', decodeURIComponent(oauthError));
    }
  }, [searchParams, setSession, router]);

  return {
    oauthSuccess: searchParams.get('oauth_success') === 'true',
    oauthProvider: searchParams.get('provider'),
    oauthError: searchParams.get('error')
  };
};
