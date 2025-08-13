'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface OAuthSetting {
  id: string;
  provider: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  isEnabled: boolean;
  teamId?: string;
  keyId?: string;
  scope: string;
}

export default function OAuthSettingsPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [oauthSettings, setOauthSettings] = useState<OAuthSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Admin kontrolü
  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push('/giris');
      return;
    }

    if (session?.user && session.user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isLoading, session, router]);

  // OAuth ayarlarını yükle
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      loadOAuthSettings();
    }
  }, [session]);

  const loadOAuthSettings = async () => {
    try {
      const response = await fetch('/api/admin/oauth-settings');
      if (response.ok) {
        const data = await response.json();
        setOauthSettings(data.oauthSettings || []);
      }
    } catch (error) {
      console.error('OAuth ayarları yüklenemedi:', error);
    }
  };

  const handleSave = async (provider: string, data: Partial<OAuthSetting>) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/oauth-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...data })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        loadOAuthSettings();
      } else {
        setError(result.error || 'Kaydetme hatası');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (provider: string) => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/oauth-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        // Test URL'ini yeni sekmede aç
        window.open(result.testUrl, '_blank');
      } else {
        setError(result.error || 'Test hatası');
      }
    } catch (error) {
      setError('Test hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (provider: string) => {
    if (!confirm(`${provider} OAuth ayarlarını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/oauth-settings?provider=${provider}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        loadOAuthSettings();
      } else {
        setError(result.error || 'Silme hatası');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const toggleSecretVisibility = (provider: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'facebook':
        return <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">f</div>;
      case 'apple':
        return <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs font-bold">🍎</div>;
      default:
        return <ShieldCheckIcon className="w-6 h-6" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'facebook': return 'Facebook';
      case 'apple': return 'Apple';
      default: return provider;
    }
  };

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">OAuth ayarları yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Admin değilse veya giriş yapmamışsa boş div döndür
  if (!session || session.user.role !== 'admin') {
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OAuth Ayarları</h1>
          <p className="mt-2 text-gray-600">
            Google, Facebook ve Apple ile giriş özelliklerini yapılandırın
          </p>
        </div>

        {/* Mesajlar */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <div className="text-green-800">{message}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {/* OAuth Provider'ları */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {['google', 'facebook', 'apple'].map((provider) => {
            const setting = oauthSettings.find(s => s.provider === provider);
            const isVisible = showSecrets[provider] || false;

            return (
              <div key={provider} className="bg-white rounded-lg shadow-md p-6">
                {/* Provider Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getProviderIcon(provider)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getProviderName(provider)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${setting?.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm text-gray-500">
                          {setting?.isEnabled ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSave(provider, {
                    clientId: formData.get('clientId') as string,
                    clientSecret: formData.get('clientSecret') as string,
                    redirectUri: formData.get('redirectUri') as string,
                    isEnabled: formData.get('isEnabled') === 'on',
                    teamId: formData.get('teamId') as string,
                    keyId: formData.get('keyId') as string,
                    scope: formData.get('scope') as string
                  });
                }}>
                  <div className="space-y-4">
                    {/* Client ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client ID
                      </label>
                      <input
                        type="text"
                        name="clientId"
                        defaultValue={setting?.clientId || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`${getProviderName(provider)} Client ID`}
                        required
                      />
                    </div>

                    {/* Client Secret */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Secret
                      </label>
                      <div className="relative">
                        <input
                          type={isVisible ? "text" : "password"}
                          name="clientSecret"
                          defaultValue={setting?.clientSecret || ''}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`${getProviderName(provider)} Client Secret`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecretVisibility(provider)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                        >
                          {isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Redirect URI */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Redirect URI
                      </label>
                      <input
                        type="text"
                        name="redirectUri"
                        defaultValue={setting?.redirectUri || `http://localhost:3004/api/auth/${provider}/callback`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Redirect URI"
                        required
                      />
                    </div>

                    {/* Apple-specific fields */}
                    {provider === 'apple' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team ID
                          </label>
                          <input
                            type="text"
                            name="teamId"
                            defaultValue={setting?.teamId || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Apple Team ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Key ID
                          </label>
                          <input
                            type="text"
                            name="keyId"
                            defaultValue={setting?.keyId || ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Apple Key ID"
                          />
                        </div>
                      </>
                    )}

                    {/* Scope */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scope
                      </label>
                      <input
                        type="text"
                        name="scope"
                        defaultValue={setting?.scope || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="OAuth scope'ları"
                      />
                    </div>

                    {/* Enable/Disable */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isEnabled"
                        defaultChecked={setting?.isEnabled || false}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Bu provider'ı etkinleştir
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                      
                      {setting && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTest(provider)}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            Test Et
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleDelete(provider)}
                            disabled={loading}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            Sil
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            );
          })}
        </div>

        {/* Bilgi Kutusu */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <h4 className="font-medium text-blue-800">OAuth Kurulum Bilgileri</h4>
              <div className="mt-2 text-sm text-blue-700 space-y-1">
                <p>• Google: Google Cloud Console'dan OAuth 2.0 Client ID ve Secret alın</p>
                <p>• Facebook: Facebook Developers'dan App ID ve App Secret alın</p>
                <p>• Apple: Apple Developer'dan Team ID, Key ID ve Client ID alın</p>
                <p>• Tüm provider'lar için redirect URI'ları doğru ayarlayın</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
