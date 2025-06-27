'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info } from 'lucide-react';

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
    isTop: false,
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Premium özellik fiyatları
  const premiumPricing = {
    featured: 50,
    urgent: 30,
    highlighted: 25,
    top: 40,
  };

  // Toplam premium ücret hesaplama
  const calculatePremiumTotal = () => {
    let total = 0;
    if (premiumFeatures.isFeatured) total += premiumPricing.featured;
    if (premiumFeatures.isUrgent) total += premiumPricing.urgent;
    if (premiumFeatures.isHighlighted) total += premiumPricing.highlighted;
    if (premiumFeatures.isTop) total += premiumPricing.top;
    return total;
  };

  const premiumTotal = calculatePremiumTotal();

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
    
    if (premiumTotal > 0) {
      const confirmPremium = confirm(`Premium özellikler için toplam ${premiumTotal}₺ ödeme yapılacak. Devam etmek istiyor musunuz?`);
      if (!confirmPremium) return;
    }
    
    alert('İlan başarıyla oluşturuldu!');
  };

  const premiumFeaturesList = [
    {
      id: 'featured',
      name: 'Öne Çıkan İlan',
      price: premiumPricing.featured,
      description: 'İlanınız ana sayfada öne çıkarılır',
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      benefits: ['Ana sayfada üst sıralarda görünür', 'Daha fazla görüntülenme', '7 gün boyunca aktif'],
      checked: premiumFeatures.isFeatured,
      onChange: (checked: boolean) => setPremiumFeatures({ ...premiumFeatures, isFeatured: checked })
    },
    {
      id: 'urgent',
      name: 'Acil İlan',
      price: premiumPricing.urgent,
      description: 'İlanınız acil olarak işaretlenir',
      icon: <Clock className="w-5 h-5 text-red-500" />,
      benefits: ['Acil rozeti ile işaretlenir', 'Arama sonuçlarında öne çıkar', '5 gün boyunca aktif'],
      checked: premiumFeatures.isUrgent,
      onChange: (checked: boolean) => setPremiumFeatures({ ...premiumFeatures, isUrgent: checked })
    },
    {
      id: 'highlighted',
      name: 'Vurgulanmış İlan',
      price: premiumPricing.highlighted,
      description: 'İlanınız renkli çerçeve ile vurgulanır',
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
      benefits: ['Renkli çerçeve ile vurgulanır', 'Arama sonuçlarında öne çıkar', '10 gün boyunca aktif'],
      checked: premiumFeatures.isHighlighted,
      onChange: (checked: boolean) => setPremiumFeatures({ ...premiumFeatures, isHighlighted: checked })
    },
    {
      id: 'top',
      name: 'Üst Sıralarda',
      price: premiumPricing.top,
      description: 'İlanınız kategoride üst sıralarda görünür',
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      benefits: ['Kategori sayfalarında üst sıralarda', 'Daha fazla tıklama', '14 gün boyunca aktif'],
      checked: premiumFeatures.isTop,
      onChange: (checked: boolean) => setPremiumFeatures({ ...premiumFeatures, isTop: checked })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
            <div className={`border rounded-lg p-4 ${premiumFeatures.isHighlighted ? 'ring-2 ring-blue-200' : ''} ${premiumFeatures.isUrgent ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{formData.title || 'İlan Başlığı'}</h3>
                <div className="flex flex-wrap gap-1">
                  {premiumFeatures.isFeatured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Star className="w-3 h-3 mr-1" />
                      Öne Çıkan
                    </span>
                  )}
                  {premiumFeatures.isUrgent && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Acil
                    </span>
                  )}
                  {premiumFeatures.isHighlighted && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Vurgulanmış
                    </span>
                  )}
                  {premiumFeatures.isTop && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Üst Sıralarda
                    </span>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-alo-orange mb-2">{formData.price ? `${parseInt(formData.price).toLocaleString('tr-TR')} ₺` : 'Fiyat'}</p>
              <p className="text-gray-600 mb-2">{formData.location || 'Konum'}</p>
              <p className="text-sm text-gray-500 mb-4">{formData.description || 'İlan açıklaması'}</p>
              {showPhone && formData.phone && (
                <div className="mt-2 text-sm text-gray-700">Telefon: {formData.phone}</div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">İlan Başlığı *</label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
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
                    <a href="/kullanim-kosullari" className="text-alo-orange hover:underline">Kullanım Koşulları</a> ve{' '}
                    <a href="/gizlilik-politikasi" className="text-alo-orange hover:underline">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum. *
                  </label>
                </div>
                
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-alo-orange text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    İlanı Yayınla
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Premium Özellikler Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-lg font-semibold text-gray-900">Premium Özellikler</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                İlanınızı daha görünür hale getirin ve satışlarınızı artırın
              </p>

              <div className="space-y-4 mb-6">
                {premiumFeaturesList.map((feature) => (
                  <div
                    key={feature.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      feature.checked
                        ? 'border-alo-orange bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => feature.onChange(!feature.checked)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={feature.checked}
                          onChange={(e) => feature.onChange(e.target.checked)}
                          className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                        />
                        <div className="flex items-center space-x-2">
                          {feature.icon}
                          <span className="font-medium text-gray-900">{feature.name}</span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-alo-orange">{feature.price} ₺</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    
                    <div className="space-y-1">
                      {feature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Toplam Premium Ücret */}
              {premiumTotal > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Toplam Premium Ücret:</span>
                    <span className="text-xl font-bold text-alo-orange">{premiumTotal} ₺</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Premium özellikler ilanınızın görünürlüğünü artırır ve daha hızlı satış yapmanızı sağlar.
                  </p>
                </div>
              )}

              {/* Premium Bilgi */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">Premium Avantajları:</p>
                    <ul className="space-y-1">
                      <li>• 3x daha fazla görüntülenme</li>
                      <li>• 2.5x daha hızlı satış</li>
                      <li>• Öncelikli destek</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
