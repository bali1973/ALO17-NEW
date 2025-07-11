'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
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

export default function Register() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      // Email kontrolü
      const users = getStoredUsers();
      const existingUser = users.find((u: any) => u.email === formData.email);

      if (existingUser) {
        setError('Bu email adresi zaten kullanılıyor');
        setLoading(false);
        return;
      }

      // Yeni kullanıcı oluştur
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Kullanıcıyı kaydet
      saveUser(newUser);

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
            Yeni Hesap Oluşturun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <a href="/giris" className="font-medium text-alo-orange hover:text-alo-dark-orange">
              Giriş Yapın
            </a>
          </p>
        </div>

        {/* Bilgi Kutusu */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Client-side Kayıt Sistemi:</h3>
          <p className="text-xs text-blue-700 mb-2">
            Bu sistem kullanıcıları tarayıcınızın localStorage'ında saklar. 
            Veriler sadece sizin cihazınızda tutulur.
          </p>
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            <strong>✅ Güvenli:</strong> Verileriniz sadece sizin cihazınızda saklanır.
          </div>
        </div>

          {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Kayıt Hatası:</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
            </div>
          )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                placeholder="Adınız ve soyadınız"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
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
              <a href="/giris" className="font-medium text-alo-orange hover:text-alo-dark-orange">
                Giriş yapın
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 