'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PencilIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [avatar, setAvatar] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Mevcut kullanıcı bilgilerini yükle
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '', // Session'da telefon yok, API'den alınacak
        location: '', // Session'da konum yok, API'den alınacak
      });
      setAvatar(session.user.image || '/images/placeholder.jpg');
    }
  }, [session, status]);

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

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (status !== 'authenticated') {
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

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
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
              </div>

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
        </div>
      </div>
    </div>
  );
} 