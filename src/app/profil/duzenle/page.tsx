'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    birthdate: '',
  });
  const [avatar, setAvatar] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  // Şifre değiştirme state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  // Hesap silme modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // E-posta doğrulama
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [emailCode, setEmailCode] = useState('');
  // Bildirim tercihleri
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    push: false,
  });
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    if (session?.user) {
      // Mevcut kullanıcı bilgilerini yükle
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '', // Session'da telefon yok, API'den alınacak
        location: '', // Session'da konum yok, API'den alınacak
        birthdate: '', // Session'da doğum tarihi yok, API'den alınacak
      });
      setAvatar('/images/placeholder.jpg');
    }
    // DEBUG: Session ve expires logla
    console.log('Session:', session);
    if (session) {
      console.log('Session expires:', session.expires, 'Şu an:', new Date().toISOString());
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    if (passwordData.new !== passwordData.confirm) {
      setPasswordMessage('Yeni şifreler eşleşmiyor.');
      return;
    }
    // Şimdilik mock
    setTimeout(() => {
      setPasswordMessage('Şifre başarıyla değiştirildi!');
      setPasswordData({ current: '', new: '', confirm: '' });
    }, 1000);
  };
  const handleSendEmailCode = () => {
    setEmailVerificationSent(true);
    setTimeout(() => {
      alert('Doğrulama kodu e-posta adresinize gönderildi (mock).');
    }, 500);
  };
  const handleVerifyEmailCode = () => {
    if (emailCode === '123456') {
      alert('E-posta doğrulandı! (mock)');
      setEmailVerificationSent(false);
      setEmailCode('');
    } else {
      alert('Kod yanlış! (mock)');
    }
  };
  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert('Hesabınız kalıcı olarak silindi (mock).');
    // Burada logout ve yönlendirme yapılabilir.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Form verilerini hazırla
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('location', formData.location);
      submitData.append('birthdate', formData.birthdate);
      
      if (avatarFile) {
        submitData.append('avatar', avatarFile);
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profil başarıyla güncellendi!' });
        // Session'ı yenile
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: data.error || 'Profil güncellenirken hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (!session) {
    router.push('/giris');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Düzenle</h1>

          {message.text && (
            <div className={`mb-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Bölümü */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={avatar}
                    alt="Profil fotoğrafı"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-alo-orange text-white rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <CameraIcon className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Profil fotoğrafınızı değiştirmek için tıklayın</p>
            </div>

            {/* Form Alanları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ad Soyad */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>
              {/* E-posta + doğrulama */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                    placeholder="ornek@email.com"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendEmailCode}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    disabled={emailVerificationSent}
                  >
                    Doğrulama Kodu Gönder
                  </button>
                </div>
                {emailVerificationSent && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Kod"
                      value={emailCode}
                      onChange={e => setEmailCode(e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailCode}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Doğrula
                    </button>
                  </div>
                )}
              </div>
              {/* Telefon */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                  placeholder="+90 555 123 4567"
                />
              </div>
              {/* Konum */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                  placeholder="İl, İlçe"
                />
              </div>
              {/* Doğum Tarihi */}
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                />
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-alo-orange text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/profil')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>

          {/* Şifre Değiştirme */}
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setShowPasswordForm(f => !f)}
              className="text-alo-orange font-medium hover:underline"
            >
              {showPasswordForm ? 'Şifre Değiştirmeyi Kapat' : 'Şifre Değiştir'}
            </button>
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="mt-4 bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                  <input
                    type="password"
                    name="current"
                    value={passwordData.current}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    name="new"
                    value={passwordData.new}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    name="confirm"
                    value={passwordData.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange"
                    required
                  />
                </div>
                {passwordMessage && (
                  <div className="text-sm text-green-600">{passwordMessage}</div>
                )}
                <button
                  type="submit"
                  className="w-full bg-alo-orange text-white py-2 rounded-lg hover:bg-orange-600"
                >
                  Şifreyi Değiştir
                </button>
              </form>
            )}
          </div>

          {/* Bildirim Tercihleri */}
          <div className="mt-10 bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Bildirim Tercihleri</h2>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="email"
                  checked={notificationPrefs.email}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">E-posta ile bildirim almak istiyorum</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="sms"
                  checked={notificationPrefs.sms}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">SMS ile bildirim almak istiyorum</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="push"
                  checked={notificationPrefs.push}
                  onChange={handleNotificationChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Push (anlık) bildirim almak istiyorum</span>
              </label>
            </div>
          </div>

          {/* Hesap Silme */}
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
            >
              Hesabımı Kalıcı Olarak Sil
            </button>
          </div>
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-red-600">Hesabınızı silmek üzeresiniz!</h2>
                <p className="mb-6">Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecek. Devam etmek istiyor musunuz?</p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Evet, Hesabımı Sil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 