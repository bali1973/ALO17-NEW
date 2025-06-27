'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function IlanVerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    phone: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [premiumFeatures, setPremiumFeatures] = useState({
    isPremium: false,
    isHighlighted: false,
    isUrgent: false,
    isFeatured: false,
  });
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/ilan-ver');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Kullanım koşullarını kabul etmeniz gerekiyor.');
      return;
    }
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.location) {
      alert('Lütfen tüm mecburi alanları doldurun.');
      return;
    }
    alert('İlan başarıyla oluşturuldu!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Ver</h1>
        <p className="text-gray-600 mt-2">İlanınızı yayınlamak için aşağıdaki formu doldurun</p>
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {previewMode ? 'Önizlemeyi Kapat' : 'Önizle'}
          </button>
        </div>
        {previewMode && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">İlan Önizlemesi</h2>
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{formData.title || 'İlan Başlığı'}</h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">{formData.price ? `${formData.price} TL` : 'Fiyat'}</p>
              <p className="text-gray-600 mb-2">{formData.location || 'Konum'}</p>
              <p className="text-sm text-gray-500 mb-4">{formData.description || 'İlan açıklaması'}</p>
              {premiumFeatures.isPremium && <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded mr-2">Premium</span>}
              {premiumFeatures.isUrgent && <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded mr-2">Acil</span>}
              {premiumFeatures.isHighlighted && <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded mr-2">Vurgulu</span>}
              {premiumFeatures.isFeatured && <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded">Öne Çıkan</span>}
              {showPhone && formData.phone && (
                <div className="mt-2 text-sm text-gray-700">Telefon: {formData.phone}</div>
              )}
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">İlan Başlığı *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="İlan başlığını girin"
                  maxLength={100}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Fiyat *</label>
                <input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Fiyatı girin"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
                placeholder="İlan açıklamasını detaylı bir şekilde girin"
                maxLength={1000}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  <option value="elektronik">Elektronik</option>
                  <option value="ev-bahce">Ev & Bahçe</option>
                  <option value="giyim">Giyim</option>
                  <option value="anne-bebek">Anne & Bebek</option>
                  <option value="sporlar-oyunlar-eglenceler">Spor & Oyunlar</option>
                  <option value="egitim-kurslar">Eğitim & Kurslar</option>
                  <option value="yemek-icecek">Yemek & İçecek</option>
                  <option value="turizm-gecelemeler">Turizm & Geceleme</option>
                  <option value="saglik-guzellik">Sağlık & Güzellik</option>
                  <option value="sanat-hobi">Sanat & Hobi</option>
                  <option value="is">İş İlanları</option>
                </select>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Konum *</label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Şehir, ilçe veya mahalle"
                />
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">İletişim Bilgileri (isteğe bağlı)</label>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="showPhone"
                  checked={showPhone}
                  onChange={e => setShowPhone(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showPhone" className="text-sm text-gray-700">Telefon numaramı göster</label>
              </div>
              {showPhone && (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Telefon numaranız (örn: 0555 123 45 67)"
                />
              )}
            </div>
            <div className="flex items-start border-t pt-4">
              <input
                type="checkbox"
                id="acceptedTerms"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="mr-2 mt-1"
                required
              />
              <label htmlFor="acceptedTerms" className="text-sm text-gray-700">
                <a href="/kullanim-kosullari" className="text-blue-600 hover:underline">Kullanım Koşulları</a> ve{' '}
                <a href="/gizlilik-politikasi" className="text-blue-600 hover:underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum. *
              </label>
            </div>
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-4 text-yellow-600">Premium Özellikler (isteğe bağlı)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPremium"
                    checked={premiumFeatures.isPremium}
                    onChange={e => setPremiumFeatures({ ...premiumFeatures, isPremium: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isPremium" className="text-sm">Premium İlan (+50 TL)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    checked={premiumFeatures.isUrgent}
                    onChange={e => setPremiumFeatures({ ...premiumFeatures, isUrgent: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isUrgent" className="text-sm">Acil İlan (+25 TL)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isHighlighted"
                    checked={premiumFeatures.isHighlighted}
                    onChange={e => setPremiumFeatures({ ...premiumFeatures, isHighlighted: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isHighlighted" className="text-sm">Vurgulanmış İlan (+30 TL)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={premiumFeatures.isFeatured}
                    onChange={e => setPremiumFeatures({ ...premiumFeatures, isFeatured: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isFeatured" className="text-sm">Öne Çıkan İlan (+40 TL)</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                İlanı Yayınla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
