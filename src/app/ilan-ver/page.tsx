﻿'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info, Upload, X, Eye, Send } from 'lucide-react';
import { getPremiumPlans } from '@/lib/utils';

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
  const [isPublishing, setIsPublishing] = useState(false);
  const [premiumPlans, setPremiumPlans] = useState<Record<string, { name: string; price: number; days: number }>>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/giris?callbackUrl=/ilan-ver');
    } else if (status === 'authenticated') {
      fetchPremiumPlans();
    }
  }, [status, router]);

  const fetchPremiumPlans = async () => {
    try {
      const plans = await getPremiumPlans();
      setPremiumPlans(plans);
    } catch (error) {
      console.error('Premium planları getirme hatası:', error);
    }
  };

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
    return premiumPlans[selectedPremiumPlan]?.price || 0;
  };

  // Özellik toplam fiyatı
  const getFeaturesTotal = () => selectedFeatures.reduce((sum, key) => {
    const f = OPTIONAL_FEATURES.find(f => f.key === key);
    return sum + (f ? f.price : 0);
  }, 0);

  // Önizleme butonu işlevi
  const handlePreview = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition || !formData.location) {
      alert('Önizleme için lütfen tüm mecburi alanları doldurun.');
      return;
    }
    setPreviewMode(true);
  };

  // İlan yayınlama işlevi
  const handlePublish = async () => {
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
      const planName = premiumPlans[selectedPremiumPlan]?.name || selectedPremiumPlan;
      const confirmPremium = confirm(`${planName} premium plan için ${planPrice}₺ ödeme yapılacak. Devam etmek istiyor musunuz?`);
      if (!confirmPremium) return;
    }
    
    setIsPublishing(true);
    
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
        const listing = await response.json();
        alert('İlan başarıyla yayınlandı! Onay için bekliyor.');
        // Anasayfaya yönlendir
        router.push('/');
      } else {
        const error = await response.json();
        alert(error.message || 'İlan yayınlanırken bir hata oluştu');
      }
    } catch (error) {
      console.error('İlan yayınlama hatası:', error);
      alert('İlan yayınlanırken bir hata oluştu');
    } finally {
      setIsPublishing(false);
    }
  };

  // Önizleme kartı bileşeni
  const PreviewCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200">
      <div className="relative h-48">
        {images.length > 0 ? (
          <img
            src={URL.createObjectURL(images[0])}
            alt={formData.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Resim Yok</span>
          </div>
        )}
        
        {/* Premium Rozetleri */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {selectedPremiumPlan !== 'free' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </span>
          )}
          {selectedFeatures.includes('urgent') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <Clock className="w-3 h-3 mr-1" />
              Acil
            </span>
          )}
          {selectedFeatures.includes('featured') && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Star className="w-3 h-3 mr-1" />
              Öne Çıkan
            </span>
          )}
        </div>

        {/* Görüntülenme Sayısı */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          0 görüntülenme
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{formData.title || 'İlan Başlığı'}</h3>
        <p className="text-xl font-bold text-alo-orange mb-2">
          {formData.price ? `${parseInt(formData.price).toLocaleString('tr-TR')} ₺` : 'Fiyat'}
        </p>
        
        <div className="flex items-center justify-between text-gray-500 mb-2">
          <div className="flex items-center">
            <span className="text-sm">{formData.location || 'Konum'}</span>
          </div>
          <span className="text-xs">
            {new Date().toLocaleDateString('tr-TR')}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{formData.description || 'İlan açıklaması'}</p>

        {/* Premium Özellikler */}
        {selectedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedFeatures.map((feature, index) => {
              const featureInfo = OPTIONAL_FEATURES.find(f => f.key === feature);
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {feature === 'featured' && <Star className="w-3 h-3 mr-1 text-yellow-500" />}
                  {feature === 'urgent' && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                  {feature === 'highlighted' && <Sparkles className="w-3 h-3 mr-1 text-blue-500" />}
                  {feature === 'top' && <TrendingUp className="w-3 h-3 mr-1 text-green-500" />}
                  <span>{featureInfo?.label || feature}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Ver</h1>
        <p className="text-gray-600 mt-2">İlanınızı yayınlamak için aşağıdaki formu doldurun</p>

        {/* Önizleme Modu */}
        {previewMode && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">İlan Önizlemesi</h2>
              <button
                onClick={() => setPreviewMode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-md mx-auto">
              <PreviewCard />
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              İlanınız anasayfada bu şekilde görünecek
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form className="space-y-6">
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

                {/* Önizleme ve Yayınlama Butonları - Form Altında */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="px-6 py-3 border border-alo-orange text-alo-orange rounded-md hover:bg-orange-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Önizle
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-8 py-3 bg-alo-orange text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isPublishing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Yayınlanıyor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        İlanı Yayınla
                      </>
                    )}
                  </button>
                </div>
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
              {Object.entries(premiumPlans).map(([key, plan]) => (
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
