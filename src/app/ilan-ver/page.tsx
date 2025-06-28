'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info, Upload, X } from 'lucide-react';
import { PREMIUM_PLANS } from '@/lib/utils';

const OPTIONAL_FEATURES = [
  { key: 'featured', label: 'Öne Çıkan', price: 50 },
  { key: 'urgent', label: 'Acil', price: 30 },
  { key: 'highlighted', label: 'Vurgulanmış', price: 25 },
  { key: 'top', label: 'Üstte', price: 40 },
];

export default function IlanVerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    condition: '',
    location: '',
    phone: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<string>('free');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

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

  // Resim yükleme işlemi
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Maksimum 5 resim yükleyebilirsiniz');
      return;
    }
    setImages([...images, ...files]);
  };

  // Resim silme işlemi
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Seçili premium planın fiyatını hesapla
  const getSelectedPlanPrice = () => {
    if (selectedPremiumPlan === 'free') return 0;
    return PREMIUM_PLANS[selectedPremiumPlan as keyof typeof PREMIUM_PLANS]?.price || 0;
  };

  // Özellik toplam fiyatı
  const getFeaturesTotal = () => selectedFeatures.reduce((sum, key) => {
    const f = OPTIONAL_FEATURES.find(f => f.key === key);
    return sum + (f ? f.price : 0);
  }, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Kullanım koşullarını kabul etmeniz gerekiyor.');
      return;
    }
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition || !formData.location) {
      alert('Lütfen tüm mecburi alanları doldurun.');
      return;
    }
    
    if (selectedPremiumPlan !== 'free') {
      const planPrice = getSelectedPlanPrice();
      const confirmPremium = confirm(`${PREMIUM_PLANS[selectedPremiumPlan as keyof typeof PREMIUM_PLANS]?.name} premium plan için ${planPrice}₺ ödeme yapılacak. Devam etmek istiyor musunuz?`);
      if (!confirmPremium) return;
    }
    
    try {
      // Resimleri yükle (gerçek uygulamada cloud storage kullanılır)
      const imageUrls = images.map(img => URL.createObjectURL(img));
      
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images: imageUrls,
          premiumPlan: selectedPremiumPlan,
          features: selectedFeatures,
        }),
      });

      if (response.ok) {
        alert('İlan başarıyla oluşturuldu!');
        router.push('/ilanlar');
      } else {
        const error = await response.json();
        alert(error.message || 'İlan oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      console.error('İlan oluşturma hatası:', error);
      alert('İlan oluşturulurken bir hata oluştu');
    }
  };

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
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{formData.title || 'İlan Başlığı'}</h3>
                {selectedPremiumPlan !== 'free' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-alo-orange mb-2">{formData.price ? `${parseInt(formData.price).toLocaleString('tr-TR')} ₺` : 'Fiyat'}</p>
              <p className="text-gray-600 mb-2">{formData.location || 'Konum'}</p>
              <p className="text-sm text-gray-500 mb-4">{formData.description || 'İlan açıklaması'}</p>
              {showPhone && formData.phone && (
                <div className="mt-2 text-sm text-gray-700">Telefon: {formData.phone}</div>
              )}
              {images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Resimler ({images.length}/5):</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <div key={index} className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Resim ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      placeholder="İlan başlığını girin"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺) *</label>
                    <input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                    placeholder="İlan açıklamasını girin"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      required
                    >
                      <option value="">Kategori seçin</option>
                      <option value="elektronik">Elektronik</option>
                      <option value="ev-bahce">Ev & Bahçe</option>
                      <option value="giyim">Giyim</option>
                      <option value="sporlar-oyunlar-eglenceler">Spor & Oyun</option>
                      <option value="hizmetler">Hizmetler</option>
                      <option value="is">İş</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
                    <select
                      id="condition"
                      value={formData.condition}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      required
                    >
                      <option value="">Durum seçin</option>
                      <option value="Yeni">Yeni</option>
                      <option value="İkinci El">İkinci El</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Konum *</label>
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      placeholder="Şehir"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">İsteğe Bağlı Özellikler</label>
                  <div className="flex flex-wrap gap-4">
                    {OPTIONAL_FEATURES.map(f => (
                      <label key={f.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(f.key)}
                          onChange={e => {
                            setSelectedFeatures(prev =>
                              e.target.checked
                                ? [...prev, f.key]
                                : prev.filter(k => k !== f.key)
                            );
                          }}
                          className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                        />
                        <span className="text-sm">{f.label} (+{f.price}₺)</span>
                      </label>
                    ))}
                  </div>
                  {selectedFeatures.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      Seçili özellikler toplamı: <span className="font-semibold">{getFeaturesTotal()}₺</span>
                    </div>
                  )}
                </div>

                {/* Resim Yükleme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resimler ({images.length}/5)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Resim yüklemek için tıklayın veya sürükleyin
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-alo-orange text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
                    >
                      Resim Seç
                    </label>
                  </div>
                  
                  {/* Yüklenen Resimler */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Resim ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    <a href="/kullanim-kosullari" className="text-alo-orange hover:underline">Kullanım koşullarını</a> kabul ediyorum
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-alo-orange text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  İlanı Yayınla
                </button>
              </form>
            </div>
          </div>

          {/* Premium Planlar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Premium Planlar</h2>
              <p className="text-gray-600 mb-6">
                İlanınızı daha fazla kişiye ulaştırmak için premium plan seçin
              </p>

              {/* Ücretsiz Plan */}
              <div className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                selectedPremiumPlan === 'free' 
                  ? 'border-alo-orange bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setSelectedPremiumPlan('free')}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Ücretsiz Plan</h3>
                  <span className="text-2xl font-bold text-green-600">0₺</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    30 gün ücretsiz premium
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Maksimum 5 resim
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Temel özellikler
                  </li>
                </ul>
              </div>

              {/* Premium Planlar */}
              {Object.entries(PREMIUM_PLANS).map(([key, plan]) => (
                <div key={key} className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                  selectedPremiumPlan === key 
                    ? 'border-alo-orange bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`} onClick={() => setSelectedPremiumPlan(key)}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <span className="text-2xl font-bold text-alo-orange">{plan.price}₺</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {plan.days} gün premium
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Maksimum 5 resim
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Öne çıkan rozet
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Öncelikli sıralama
                    </li>
                  </ul>
                </div>
              ))}

              {/* Toplam Fiyat */}
              {selectedPremiumPlan !== 'free' && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Toplam:</span>
                    <span className="text-xl font-bold text-alo-orange">
                      {getSelectedPlanPrice()}₺
                    </span>
                  </div>
                </div>
              )}

              {/* Bilgi Kutusu */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Premium Avantajları:</p>
                    <ul className="space-y-1">
                      <li>• İlanınız öne çıkarılır</li>
                      <li>• Daha fazla görüntülenme</li>
                      <li>• Öncelikli sıralama</li>
                      <li>• Premium rozet</li>
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
