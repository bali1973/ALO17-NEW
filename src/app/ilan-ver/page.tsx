'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info, Upload, X, Eye, Send, Plus, AlertCircle } from 'lucide-react';
import { getPremiumPlans } from '@/lib/utils';
import { useCategories } from '@/lib/useCategories';

// OPTIONAL_FEATURES dizisini kald�r

// Cloudinary upload fonksiyonu ve ilgili kodlar� kald�r

const FORM_STORAGE_KEY = 'ilanVerForm';

export default function IlanVerPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDraft = searchParams.get('draft') === '1';
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
    phoneVisibility: 'public', // 'public', 'private', 'message_only'
  });
  const [images, setImages] = useState<File[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<string>('free');
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [premiumPlans, setPremiumPlans] = useState<Record<string, { name: string; price: number; days: number }>>({});
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [featurePrices, setFeaturePrices] = useState({
    featured: 0,
    urgent: 0,
    highlighted: 0,
    top: 0,
  });
  const [featureLoading, setFeatureLoading] = useState(true);

  // File to base64 helper
  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Form state'ini localStorage'dan y�kle (sadece draft=1 ise)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('draft') === '1') {
      // �nce ilanDraftData'y� kontrol et (�nizleme sayfas�ndan gelen)
      const draftData = localStorage.getItem('ilanDraftData');
      if (draftData) {
        try {
          const parsed = JSON.parse(draftData);
          setFormData({
            title: parsed.title || '',
            description: parsed.description || '',
            price: parsed.price || '',
            category: parsed.category || '',
            subcategory: parsed.subcategory || '',
            condition: parsed.condition || '',
            location: parsed.location || '',
            phone: parsed.contactPhone || '',
            phoneVisibility: parsed.phoneVisibility || 'public',
          });
          
          // Resim �nizlemelerini y�kle
          if (parsed.images && Array.isArray(parsed.images)) {
            setImagePreviews(parsed.images);
          }
          
          // Taslak verilerini temizle
          localStorage.removeItem('ilanDraftData');
          
          setTimeout(() => {
            alert('Taslak verileriniz y�klendi! Resimler tekrar eklenmelidir.');
          }, 500);
        } catch (e) {
          console.error('Taslak veri y�klenirken hata:', e);
        }
      } else {
        // Eski taslak sistemi
        const savedDraft = localStorage.getItem('ilanTaslak');
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            if (parsed.formData) setFormData(parsed.formData);
            if (parsed.selectedPremiumPlan) setSelectedPremiumPlan(parsed.selectedPremiumPlan);
            if (parsed.selectedFeatures) setSelectedFeatures(parsed.selectedFeatures);
            if (parsed.acceptedTerms) setAcceptedTerms(parsed.acceptedTerms);
            // images alan� i�in uyar� ve base64 �nizlemeleri y�kle
            setImages([]);
            const previews = JSON.parse(localStorage.getItem('ilanImagePreviews') || '[]');
            setImagePreviews(previews);
            setTimeout(() => {
              alert('Resimler taray�c� g�venli�i nedeniyle tekrar eklenmelidir. �nizlemeleri a�a��da g�rebilirsiniz.');
            }, 500);
          } catch (e) { /* ignore */ }
        }
      }
    }
  }, []);

  // Form verileri de�i�tik�e localStorage'a kaydet
  useEffect(() => {
    const draft = {
      formData,
      images,
      selectedPremiumPlan,
      selectedFeatures,
      acceptedTerms,
    };
    localStorage.setItem('ilanTaslak', JSON.stringify(draft));
    localStorage.setItem('ilanImagePreviews', JSON.stringify(imagePreviews));
  }, [formData, images, selectedPremiumPlan, selectedFeatures, acceptedTerms, imagePreviews]);

  useEffect(() => {
    if (!session) {
      router.push('/giris?callbackUrl=/ilan-ver');
    } else {
      fetchPremiumPlans();
      fetchFeaturePrices();
    }
  }, [session, router]);

  const fetchPremiumPlans = async () => {
    try {
      const plans = await getPremiumPlans();
      setPremiumPlans(plans);
    } catch (error) {
      console.error('Premium planlar� getirme hatas�:', error);
    }
  };

  const fetchFeaturePrices = async () => {
    try {
      const response = await fetch('/api/premium-feature-prices');
      if (response.ok) {
        const data = await response.json();
        setFeaturePrices(data);
      }
    } catch (error) {
      console.error('�zellik fiyatlar� getirme hatas�:', error);
    } finally {
      setFeatureLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Y�kleniyor...</p>
        </div>
      </div>
    );
  }

  // Resim y�kleme i�lemi
  type ImgEvent = ChangeEvent<HTMLInputElement>;
  const handleImageUpload = async (e: ImgEvent) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Maksimum 5 resim y�kleyebilirsiniz');
      return;
    }
    setImages([...images, ...files]);
    // Yeni se�ilenlerin base64 �nizlemesini olu�tur
    const previews = await Promise.all(files.map(fileToBase64));
    const newPreviews = [...imagePreviews, ...previews];
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
  };

  // Resim silme i�lemi
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
  };

  // Se�ili premium plan�n fiyat�n� hesapla
  const getSelectedPlanPrice = () => {
    if (selectedPremiumPlan === 'free') return 0;
    return premiumPlans[selectedPremiumPlan]?.price || 0;
  };

  // �zellik toplam fiyat�
  const getFeaturesTotal = () => selectedFeatures.reduce((sum, key) => {
    return sum + (featurePrices[key as keyof typeof featurePrices] || 0);
  }, 0);

  // �nizleme butonu i�levi
  const handlePreview = () => {
    console.log('formData:', formData);
    const selectedCat = categories.find(cat => cat.id === formData.category);
    const subCategoriesExist = !!selectedCat?.subCategories?.length;
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0 ||
      !formData.category.trim() ||
      (subCategoriesExist && (!formData.subcategory || !formData.subcategory.trim())) ||
      !formData.condition.trim() ||
      !formData.location.trim()
    ) {
      alert('�nizleme i�in l�tfen t�m mecburi alanlar� doldurun.');
      return;
    }

    // Resimleri URL'lere d�n��t�r
    const imageUrls = images.map(img => URL.createObjectURL(img));
    
    // �n izleme sayfas�na y�nlendir
    const params = new URLSearchParams({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      subcategory: formData.subcategory,
      condition: formData.condition,
      location: formData.location,
      contactPhone: formData.phone,
      phoneVisibility: formData.phoneVisibility,
      contactEmail: session?.user?.email || '',
      sellerName: session?.user?.name || '',
      images: JSON.stringify(imageUrls)
    });

    router.push(`/ilan-onizleme?${params.toString()}`);
  };

  // �lan yay�nlama i�levi
  const handlePublish = async () => {
    if (!acceptedTerms) {
      alert('Kullan�m ko�ullar�n� kabul etmeniz gerekiyor.');
      return;
    }
    const selectedCat = categories.find(cat => cat.id === formData.category);
    const subCategoriesExist = !!selectedCat?.subCategories?.length;
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price.toString().trim() ||
      !formData.category.trim() ||
      (subCategoriesExist && !formData.subcategory.trim()) ||
      !formData.condition.trim() ||
      !formData.location.trim()
    ) {
      alert('L�tfen t�m mecburi alanlar� doldurun.');
      return;
    }
    // Admin kontrol�
    const isAdmin = session?.user?.role === 'admin';
    // Premium plan veya �zellik se�iliyse �deme sayfas�na y�nlendir
    if (selectedPremiumPlan !== 'free' || selectedFeatures.length > 0) {
      localStorage.setItem('pendingListing', JSON.stringify({
        formData,
        images: [],
        selectedPremiumPlan,
        selectedFeatures,
        acceptedTerms,
        user: session?.user?.name || 'Anonim',
        email: session?.user?.email || '',
        userRole: session?.user?.role || 'user',
      }));
      router.push('/ilan-odeme');
      return;
    }
    // �cretsiz ise do�rudan yay�nla
    setIsPublishing(true);
    try {
      // Resimleri y�kle (ge�ici, sadece taray�c�da �al���r)
      const imageUrls = images
        .map(img => img ? URL.createObjectURL(img) : null)
        .filter(Boolean);
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: imageUrls,
        premiumPlan: selectedPremiumPlan,
        features: selectedFeatures,
        subcategory: formData.subcategory || null,
        user: session?.user?.name || 'Anonim',
        email: session?.user?.email || '',
        userRole: session?.user?.role || 'user',
      };
      
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('alo17-session') : null;
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      
              if (response.ok) {
          localStorage.removeItem('ilanTaslak');
          localStorage.removeItem('ilanImagePreviews');
          const listing = await response.json();
          
          alert('�lan ba�ar�yla yay�nland�! Ana sayfada g�r�n�r.');
          router.push('/');
        } else {
          const error = await response.json();
          console.error('API Hatas�:', error);
          alert(error.error || error.message || '�lan yay�nlan�rken bir hata olu�tu');
        }
      } catch (error) {
        console.error('�lan yay�nlama hatas�:', error);
        alert('�lan yay�nlan�rken bir hata olu�tu. L�tfen tekrar deneyin.');
      } finally {
      setIsPublishing(false);
    }
  };

  // �nizleme kart� bile�eni
  const PreviewCard = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200">
      <div className="relative h-48">
        {images.length > 0 && images[0] ? (
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
              �ne ��kan
            </span>
          )}
        </div>

        {/* G�r�nt�lenme Say�s� */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          0 g�r�nt�lenme
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{formData.title || 'İlan Başlığı'}</h3>
        <p className="text-xl font-bold text-alo-orange mb-2">
          {formData.category === 'ucretsiz-gel-al' ? '�cretsiz Gel Al' : (formData.price && !isNaN(Number(formData.price)) ? `${Number(formData.price).toLocaleString('tr-TR')} ₺` : 'Fiyat')}
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

        {/* Premiumzellikler */}
        {selectedFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedFeatures.map((feature, index) => {
              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {feature === 'featured' && <Star className="w-3 h-3 mr-1 text-yellow-500" />}
                  {feature === 'urgent' && <Clock className="w-3 h-3 mr-1 text-red-500" />}
                  {feature === 'highlighted' && <Sparkles className="w-3 h-3 mr-1 text-blue-500" />}
                  {feature === 'top' && <TrendingUp className="w-3 h-3 mr-1 text-green-500" />}
                  <span>
                    {feature === 'featured' ? 'Öne Çıkan' :
                     feature === 'urgent' ? 'Acil' :
                     feature === 'highlighted' ? 'Vurgulanmış' :
                     feature === 'top' ? 'Üst Sırada' : feature} ({featurePrices[feature as keyof typeof featurePrices] || 0}₺)
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <div className="space-y-2">
                      <input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                        placeholder="0"
                        required={formData.category !== 'ucretsiz-gel-al'}
                        disabled={formData.category === 'ucretsiz-gel-al'}
                      />
                    </div>
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
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const selectedCategory = e.target.value;
                        const isFreeCategory = selectedCategory === 'ucretsiz-gel-al';
                        setFormData({ 
                          ...formData, 
                          category: selectedCategory, 
                          subcategory: '',
                          price: isFreeCategory ? '0' : formData.price
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      required
                      disabled={categoriesLoading}
                    >
                      <option value="">Kategori seçin</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category && (
                    <div>
                      <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori *</label>
                      <select
                        id="subcategory"
                        value={formData.subcategory}
                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                        required={!!(categories.find(cat => cat.id === formData.category)?.subCategories?.length)}
                        disabled={categoriesLoading || !formData.category}
                      >
                        <option value="">Alt kategori seçin</option>
                        {(categories.find(cat => cat.id === formData.category)?.subCategories || []).length === 0 ? (
                          <option value="" disabled>Bu kategoriye ait alt kategori yok</option>
                        ) : (
                          (categories.find(cat => cat.id === formData.category)?.subCategories || []).map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))
                        )}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">Durum *</label>
                    <select
                      id="condition"
                      value={formData.condition}
                      onChange={e => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      required
                    >
                      <option value="">Durum seçin</option>
                      <option value="Yeni">Yeni</option>
                      <option value="�kinci El">�kinci El</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Lokasyon *</label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      required
                      placeholder="Şehir veya semt girin"
                    />
                  </div>
                </div>

                {/* Telefon Bilgileri */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Telefon Numarası</label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                      placeholder="0555 123 45 67"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneVisibility" className="block text-sm font-medium text-gray-700 mb-2">Telefon Görünürlüğü</label>
                    <select
                      id="phoneVisibility"
                      value={formData.phoneVisibility}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, phoneVisibility: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
                    >
                      <option value="public">Herkese Açık</option>
                      <option value="private">Gizli</option>
                      <option value="message_only">Sadece Mesaj Yoluyla</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.phoneVisibility === 'public' && 'Telefon numaranız ilan sayfasında görünecek'}
                      {formData.phoneVisibility === 'private' && 'Telefon numaranız hiçbir yerde görünmeyecek'}
                      {formData.phoneVisibility === 'message_only' && 'Telefon numaranız sadece mesaj gönderenlere iletilecek'}
                    </p>
                  </div>
                </div>

                {/* �ste�e Ba�l� �zellikler */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">�ste�e Ba�l� �zellikler</label>
                  {featureLoading ? (
                    <div>Yükleniyor...</div>
                  ) : featurePrices && Object.keys(featurePrices).length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(featurePrices).map(([featureKey, featurePrice]) => (
                        <label key={featureKey} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(featureKey)}
                            onChange={e => {
                              setSelectedFeatures(prev =>
                                e.target.checked
                                  ? [...prev, featureKey]
                                  : prev.filter(k => k !== featureKey)
                              );
                            }}
                            className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                          />
                          <span className="text-sm">
                            {featureKey === 'featured' && '�ne ��kan'}
                            {featureKey === 'urgent' && 'Acil'}
                            {featureKey === 'highlighted' && 'Vurgulanm��'}
                            {featureKey === 'top' && '�stte G�sterim'}
                            {' '}(+{featurePrice}₺)
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div>zellik bulunamad</div>
                  )}
                  {selectedFeatures.length > 0 && !featureLoading && (
                    <div className="mt-2 text-sm text-gray-700">
                      Se�ili �zellikler toplam�: <span className="font-semibold">{getFeaturesTotal()}₺</span>
                    </div>
                  )}
                </div>

                {/* Resim Ykleme */}
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
                  
                  {/* Yklenen Resimler */}
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

                {/* Resim y�kleme alan� render�nda, e�er imagePreviews varsa ve images.length === 0 ise �nizlemeleri g�ster */}
                {imagePreviews.length > 0 && images.length === 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative">
                        <img src={src} alt={`Önizleme ${idx+1}`} className="w-full h-24 object-cover rounded-lg opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-white bg-black bg-opacity-60 rounded-lg">
                          Resmi tekrar seçin
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                    <a href="/kullanim-kosullari" className="text-alo-orange hover:underline">Kullan�m ko�ullar�n�</a> kabul ediyorum
                  </label>
                </div>

                {/* Kategori ve Alt Kategori Se�imi */}
                {/* This block is now redundant as category and subcategory are in the same grid row */}
                {/* {formData.category && (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Alt Kategori</label>
                    <select
                      value={formData.subcategory}
                      onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                      className="border rounded px-3 py-2 w-full"
                      required
                      disabled={categoriesLoading}
                    >
                      <option value="">Alt kategori seçin</option>
                      {(categories.find(cat => cat.slug === formData.category)?.subCategories || []).map(sub => (
                        <option key={sub.id} value={sub.slug}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )} */}

                {/*nizleme ve Yaynlama Butonlar - Form Altnda */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="px-6 py-3 border border-alo-orange text-alo-orange rounded-md hover:bg-orange-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    �nizle
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
                        Yay�nlan�yor...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        �lan� Yay�nla
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
                �lan�n�z� daha fazla ki�iye ula�t�rmak i�in premium plan se�in
              </p>

              {/* �cretsiz Plan */}
              <div className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${
                selectedPremiumPlan === 'free' 
                  ? 'border-alo-orange bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setSelectedPremiumPlan('free')}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">�cretsiz Plan</h3>
                  <span className="text-2xl font-bold text-green-600">0₺</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    30 gncretsiz premium
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Maksimum 5 resim
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Temel �zellikler
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
                  <div className="flex flex-col items-center mb-2">
                    <Sparkles className="w-5 h-5 text-alo-orange mb-1" />
                    <h3 className="font-bold text-alo-orange text-lg text-center">{
                      plan.name === '90 G�n' ? '90 G�nl�k Premium'
                        : plan.name === '365 G�n' ? '365 G�nl�k Premium'
                        : plan.name
                    }</h3>
                    <span className="text-2xl font-extrabold text-gray-900 mt-1">{plan.price}₺</span>
                    <span className="text-sm text-gray-500">{plan.days} gn premium</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mt-2">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Maksimum 5 resim
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      �ne ��kan rozet
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      �ncelikli s�ralama
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
                    <p className="font-medium mb-1">Premium Avantajlar�:</p>
                    <ul className="space-y-1">
                      <li>� �lan�n�z �ne ��kar�l�r</li>
                      <li>� Daha fazla g�r�nt�lenme</li>
                      <li>� �ncelikli s�ralama</li>
                      <li>� Premium rozet</li>
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
