'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Sparkles, Star, Clock, TrendingUp, CheckCircle, Info, Upload, X, Eye, Send, Plus, AlertCircle } from 'lucide-react';
import { getPremiumPlans } from '@/lib/utils';
import { useCategories } from '@/lib/useCategories';

// İlan-ver sayfası için özel font ayarları
const pageStyles = `
  .ilan-ver-page * {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif !important;
  }
  .ilan-ver-page h1, .ilan-ver-page h2, .ilan-ver-page h3, .ilan-ver-page h4, .ilan-ver-page h5, .ilan-ver-page h6 {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif !important;
  }
  .ilan-ver-page p, .ilan-ver-page span, .ilan-ver-page div, .ilan-ver-page label {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif !important;
  }
  .ilan-ver-page input, .ilan-ver-page textarea, .ilan-ver-page select, .ilan-ver-page option {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif !important;
  }
  .ilan-ver-page button {
    font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif !important;
  }
`;

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
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
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

  // Form state'ini localStorage'dan yükle (sadece draft=1 ise)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('draft') === '1') {
      // Önce ilanDraftData'yı kontrol et (önizleme sayfasından gelen)
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
          
          // Resim önizlemelerini yükle
          if (parsed.images && Array.isArray(parsed.images)) {
            setImagePreviews(parsed.images);
          }
          
          // Taslak verilerini temizle
          localStorage.removeItem('ilanDraftData');
          
          setTimeout(() => {
            alert('Taslak verileriniz yüklendi! Resimler tekrar eklenmelidir.');
          }, 500);
        } catch (e) {
          console.error('Taslak veri yüklenirken hata:', e);
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
            // images alanı için uyarı ve base64 önizlemeleri yükle
            setImages([]);
            const previews = JSON.parse(localStorage.getItem('ilanImagePreviews') || '[]');
            setImagePreviews(previews);
            setTimeout(() => {
              alert('Resimler tarayıcı güvenliği nedeniyle tekrar eklenmelidir. Önizlemeleri aşağıda görebilirsiniz.');
            }, 500);
          } catch (e) { /* ignore */ }
        }
      }
    }
  }, []);

  // Form verileri değiştikçe localStorage'a kaydet
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
      console.error('Premium planları getirme hatası:', error);
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
      console.error('Özellik fiyatları getirme hatası:', error);
    } finally {
      setFeatureLoading(false);
    }
  };

  if (isLoading) {
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
  type ImgEvent = ChangeEvent<HTMLInputElement>;
  const handleImageUpload = async (e: ImgEvent) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Maksimum 5 resim yükleyebilirsiniz');
      return;
    }
    
    // Fotoğrafları işle
    const processedFiles = await Promise.all(files.map(processImage));
    setImages([...images, ...processedFiles]);
    
    // Yeni seçilenlerin base64 önizlemesini oluştur
    const previews = await Promise.all(processedFiles.map(fileToBase64));
    const newPreviews = [...imagePreviews, ...previews];
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
    
    // Input'u temizle
    e.target.value = '';
  };

  // Resim silme işlemi
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
  };

  // Seçili premium planın fiyatını hesapla
  const getSelectedPlanPrice = () => {
    if (selectedPremiumPlan === 'free') return 0;
    return premiumPlans[selectedPremiumPlan]?.price || 0;
  };

  // Özellik toplam fiyatı
  const getFeaturesTotal = () => selectedFeatures.reduce((sum, key) => {
    return sum + (featurePrices[key as keyof typeof featurePrices] || 0);
  }, 0);

  // Önizleme butonu işlevi
  const handlePreview = () => {
    console.log('formData:', formData);
    const selectedCat = categories.find(cat => cat.id === formData.category);
    const subCategoriesExist = !!selectedCat?.subCategories?.length;
    const isServiceCategory = formData.category === '13' || formData.category === 'hizmetler';
    const isJobCategory = formData.category === '11' || formData.category === 'is';
    const isHealthBeautyCategory = formData.category === '8' || formData.category === 'saglik-guzellik';
    const isTourismCategory = formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler';
    const isFoodDrinkCategory = formData.category === '6' || formData.category === 'yemek-icecek';
    const isEducationCategory = formData.category === '5' || formData.category === 'egitim-kurslar';
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      (!isJobCategory && (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0)) ||
      !formData.category.trim() ||
      (subCategoriesExist && (!formData.subcategory || !formData.subcategory.trim())) ||
      (!isServiceCategory && !isJobCategory && !isHealthBeautyCategory && !isTourismCategory && !isFoodDrinkCategory && !isEducationCategory && !formData.condition.trim()) ||
      !formData.location.trim()
    ) {
      alert('Önizleme için lütfen tüm mecburi alanları doldurun.');
      return;
    }

    // Resimleri URL'lere dönüştür
    const imageUrls = images.map(img => URL.createObjectURL(img));
    
    // Ön izleme sayfasına yönlendir
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

  // İlan yayınlama işlevi
  const handlePublish = async () => {
    if (!acceptedTerms) {
      alert('Kullanım koşullarını kabul etmeniz gerekiyor.');
      return;
    }
    const selectedCat = categories.find(cat => cat.id === formData.category);
    const subCategoriesExist = !!selectedCat?.subCategories?.length;
    const isServiceCategory = formData.category === '13' || formData.category === 'hizmetler';
    const isJobCategory = formData.category === '11' || formData.category === 'is';
    const isHealthBeautyCategory = formData.category === '8' || formData.category === 'saglik-guzellik';
    const isTourismCategory = formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler';
    const isFoodDrinkCategory = formData.category === '6' || formData.category === 'yemek-icecek';
    const isEducationCategory = formData.category === '5' || formData.category === 'egitim-kurslar';
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      (!isJobCategory && !formData.price.toString().trim()) ||
      !formData.category.trim() ||
      (subCategoriesExist && !formData.subcategory.trim()) ||
      (!isServiceCategory && !isJobCategory && !isHealthBeautyCategory && !isTourismCategory && !isFoodDrinkCategory && !isEducationCategory && !formData.condition.trim()) ||
      !formData.location.trim()
    ) {
      alert('Lütfen tüm mecburi alanları doldurun.');
      return;
    }
    // Admin kontrolü
    const isAdmin = session?.user?.role === 'admin';
    // Premium plan veya özellik seçiliyse ödeme sayfasına yönlendir
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
    // Ücretsiz ise doğrudan yayınla
    setIsPublishing(true);
    try {
      // Resimleri yükle (geçici, sadece tarayıcıda çalışır)
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
        
        // Başarı mesajı göster
        const successMessage = 'İlan başarıyla yayınlandı! Ana sayfada görünür.';
        
        // Toast notification göster (basit alert yerine)
        if (typeof window !== 'undefined') {
          // LocalStorage'a başarı mesajını kaydet
          localStorage.setItem('ilanYayinlandi', 'true');
          localStorage.setItem('ilanYayinlandiMesaji', successMessage);
        }
        
        // Ana sayfaya yönlendir
        router.push('/');
      } else {
        const error = await response.json();
        console.error('API Hatası:', error);
        alert(error.error || error.message || 'İlan yayınlanırken bir hata oluştu');
      }
    } catch (error) {
      console.error('İlan yayınlama hatası:', error);
      alert('İlan yayınlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Önizleme kartı bileşeni
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
           {(formData.category === '12' || formData.category === 'ucretsiz-gel-al') ? 'Ücretsiz Gel Al' : 
            (formData.category === '11' || formData.category === 'is') ? 'İş İlanı' : 
            (formData.price && !isNaN(Number(formData.price)) ? `${Number(formData.price).toLocaleString('tr-TR')} ₺` : 'Fiyat')}
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

        {/* Premium özellikler */}
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

  // Mobil cihaz kontrolü - Gelişmiş versiyon
  const isMobileDevice = () => {
    // User Agent kontrolü
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Touch desteği kontrolü
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Ekran boyutu kontrolü
    const isSmallScreen = window.innerWidth <= 768;
    
    // Mobil cihaz özellikleri kontrolü
    const hasMobileFeatures = 'getUserMedia' in navigator.mediaDevices || 'webkitGetUserMedia' in navigator;
    
    // En az 2 kriter sağlanıyorsa mobil kabul et
    const mobileScore = [isMobileUA, hasTouch, isSmallScreen, hasMobileFeatures].filter(Boolean).length;
    
    console.log('Mobil cihaz kontrolü:', {
      userAgent: isMobileUA,
      touch: hasTouch,
      screen: isSmallScreen,
      features: hasMobileFeatures,
      score: mobileScore
    });
    
    return mobileScore >= 2;
  };

  // Kamera izni kontrolü
  // Kamera izni kontrol et - Gelişmiş versiyon
  const checkCameraPermission = async () => {
    try {
      // Önce getUserMedia API'nin varlığını kontrol et
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia API desteklenmiyor');
        return false;
      }

      // Kamera erişimi iste
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'environment', // Arka kamera tercih et
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stream'i hemen kapat
      stream.getTracks().forEach(track => track.stop());
      
      console.log('Kamera izni verildi');
      return true;
    } catch (error: any) {
      console.error('Kamera izni hatası:', error);
      
      // Hata türüne göre kullanıcıya yardım et
      if (error.name === 'NotAllowedError') {
        console.warn('Kamera izni reddedildi');
      } else if (error.name === 'NotFoundError') {
        console.warn('Kamera bulunamadı');
      } else if (error.name === 'NotReadableError') {
        console.warn('Kamera başka uygulama tarafından kullanılıyor');
      } else if (error.name === 'OverconstrainedError') {
        console.warn('Kamera gereksinimleri karşılanamıyor');
      }
      
      return false;
    }
  };

  // Kamera ile fotoğraf çek
  const handleCameraCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Maksimum 5 resim yükleyebilirsiniz');
      return;
    }
    
    // Fotoğrafları işle
    const processedFiles = await Promise.all(files.map(processImage));
    setImages([...images, ...processedFiles]);
    
    const previews = await Promise.all(processedFiles.map(fileToBase64));
    const newPreviews = [...imagePreviews, ...previews];
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
    
    // Input'u temizle
    e.target.value = '';
  };

  // Galeri seçimi
  const handleGallerySelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      alert('Maksimum 5 resim yükleyebilirsiniz');
      return;
    }
    
    // Fotoğrafları işle
    const processedFiles = await Promise.all(files.map(processImage));
    setImages([...images, ...processedFiles]);
    
    const previews = await Promise.all(processedFiles.map(fileToBase64));
    const newPreviews = [...imagePreviews, ...previews];
    setImagePreviews(newPreviews);
    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
    
    // Input'u temizle
    e.target.value = '';
  };

  // Fotoğraf kırpma
  const cropImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Maksimum boyut
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;
        
        // Boyut oranını koru
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(croppedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Fotoğraf sıkıştırma
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, 0.7); // %70 kalite
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Gelişmiş fotoğraf işleme
  const processImage = async (file: File): Promise<File> => {
    try {
      // Önce sıkıştır
      let processedFile = await compressImage(file);
      
      // Eğer dosya hala büyükse kırp
      if (processedFile.size > 1024 * 1024) { // 1MB'dan büyükse
        processedFile = await cropImage(processedFile);
      }
      
      return processedFile;
    } catch (error) {
      console.error('Fotoğraf işleme hatası:', error);
      return file;
    }
  };

  // Mobil fotoğraf seçici - Gelişmiş versiyon
  const showMobileImagePicker = async () => {
    if (!isMobileDevice()) {
      // Desktop'ta normal input'u aç
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.click();
      return;
    }

    // Mobil cihazda gelişmiş seçenekler
    try {
      // Kamera izni kontrol et
      const hasCameraPermission = await checkCameraPermission();
      
      if (hasCameraPermission) {
        // Modern mobil cihazlarda native seçenekler
        if ('showActionSheet' in window || 'ActionSheet' in window) {
          // iOS ActionSheet benzeri
          const choice = window.confirm(
            'Fotoğraf eklemek için:\n\n' +
            '📷 Kamera ile çekmek için "Tamam"\n' +
            '🖼️ Galeriden seçmek için "İptal"\n\n' +
            'Kamera ile çekmek istiyor musunuz?'
          );
          
          if (choice) {
            const cameraInput = document.getElementById('camera-capture') as HTMLInputElement;
            if (cameraInput) cameraInput.click();
          } else {
            const galleryInput = document.getElementById('gallery-select') as HTMLInputElement;
            if (galleryInput) galleryInput.click();
          }
        } else {
          // Fallback: Basit confirm dialog
          const choice = window.confirm(
            '📷 Kamera ile çekmek için "Tamam"\n' +
            '🖼️ Galeriden seçmek için "İptal"'
          );
          
          if (choice) {
            const cameraInput = document.getElementById('camera-capture') as HTMLInputElement;
            if (cameraInput) cameraInput.click();
          } else {
            const galleryInput = document.getElementById('gallery-select') as HTMLInputElement;
            if (galleryInput) galleryInput.click();
          }
        }
      } else {
        // Kamera izni yoksa sadece galeri seçeneği
        alert('Kamera izni gerekli. Galeriden fotoğraf seçebilirsiniz.');
        const galleryInput = document.getElementById('gallery-select') as HTMLInputElement;
        if (galleryInput) galleryInput.click();
      }
    } catch (error) {
      console.error('Mobil fotoğraf seçici hatası:', error);
      // Hata durumunda galeri seçiciyi aç
      const galleryInput = document.getElementById('gallery-select') as HTMLInputElement;
      if (galleryInput) galleryInput.click();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
      <div className="min-h-screen bg-gray-50 ilan-ver-page">
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
                                         <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                       Fiyat (₺) {(formData.category === '12' || formData.category === 'ucretsiz-gel-al' || formData.category === '11' || formData.category === 'is') ? '' : '*'}
                     </label>
                     <div className="space-y-2">
                       <input
                         id="price"
                         type="number"
                         value={formData.price}
                         onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                         className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent ${
                           (formData.category === '12' || formData.category === 'ucretsiz-gel-al' || formData.category === '11' || formData.category === 'is') ? 'bg-gray-100 cursor-not-allowed' : ''
                         }`}
                         placeholder={(formData.category === '12' || formData.category === 'ucretsiz-gel-al' || formData.category === '11' || formData.category === 'is') ? 'Bu kategori için geçerli değil' : '0'}
                         required={formData.category !== '12' && formData.category !== 'ucretsiz-gel-al' && formData.category !== '11' && formData.category !== 'is'}
                         disabled={formData.category === '12' || formData.category === 'ucretsiz-gel-al' || formData.category === '11' || formData.category === 'is'}
                       />
                       {(formData.category === '12' || formData.category === 'ucretsiz-gel-al') && (
                         <p className="text-xs text-gray-500">Bu kategori için fiyat gerekmez</p>
                       )}
                       {(formData.category === '11' || formData.category === 'is') && (
                         <p className="text-xs text-gray-500">İş ilanları için fiyat gerekmez</p>
                       )}
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
                          const isFreeCategory = selectedCategory === '12' || selectedCategory === 'ucretsiz-gel-al';
                          const isJobCategory = selectedCategory === '11' || selectedCategory === 'is';
                          const isServiceCategory = selectedCategory === '13' || selectedCategory === 'hizmetler';
                          const isHealthBeautyCategory = selectedCategory === '8' || selectedCategory === 'saglik-guzellik';
                          const isTourismCategory = selectedCategory === '4' || selectedCategory === 'turizm-konaklama' || selectedCategory === '7' || selectedCategory === 'turizm-gecelemeler';
                          const isFoodDrinkCategory = selectedCategory === '6' || selectedCategory === 'yemek-icecek';
                          const isEducationCategory = selectedCategory === '5' || selectedCategory === 'egitim-kurslar';
                          setFormData({ 
                            ...formData, 
                            category: selectedCategory, 
                            subcategory: '',
                            price: (isFreeCategory || isJobCategory) ? '0' : formData.price,
                            condition: (isServiceCategory || isJobCategory || isHealthBeautyCategory || isTourismCategory || isFoodDrinkCategory || isEducationCategory) ? '' : formData.condition
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
                                               <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                          Durum {(formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar') ? '' : '*'}
                        </label>
                        <select
                          id="condition"
                          value={formData.condition}
                          onChange={e => setFormData({ ...formData, condition: e.target.value })}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent ${
                            (formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar') ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          required={formData.category !== '13' && formData.category !== 'hizmetler' && formData.category !== '11' && formData.category !== 'is' && formData.category !== '8' && formData.category !== 'saglik-guzellik' && formData.category !== '4' && formData.category !== 'turizm-konaklama' && formData.category !== '7' && formData.category !== 'turizm-gecelemeler' && formData.category !== '6' && formData.category !== 'yemek-icecek' && formData.category !== '5' && formData.category !== 'egitim-kurslar'}
                          disabled={formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar'}
                        >
                          <option value="">{(formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar') ? 'Bu kategori için geçerli değil' : 'Durum seçin'}</option>
                          <option value="Yeni" disabled={formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar'}>Yeni</option>
                          <option value="İkinci El" disabled={formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar'}>İkinci El</option>
                        </select>
                        {(formData.category === '13' || formData.category === 'hizmetler' || formData.category === '11' || formData.category === 'is' || formData.category === '8' || formData.category === 'saglik-guzellik' || formData.category === '4' || formData.category === 'turizm-konaklama' || formData.category === '7' || formData.category === 'turizm-gecelemeler' || formData.category === '6' || formData.category === 'yemek-icecek' || formData.category === '5' || formData.category === 'egitim-kurslar') && (
                          <p className="text-xs text-gray-500 mt-1">Bu kategori için durum seçimi gerekmez</p>
                        )}
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

                  {/* İsteğe Bağlı Özellikler */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">İsteğe Bağlı Özellikler</label>
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
                              {featureKey === 'featured' && 'Öne Çıkan'}
                              {featureKey === 'urgent' && 'Acil'}
                              {featureKey === 'highlighted' && 'Vurgulanmış'}
                              {featureKey === 'top' && 'Üstte Gösterim'}
                              {' '}(+{featurePrice}₺)
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div>Özellik bulunamadı</div>
                    )}
                    {selectedFeatures.length > 0 && !featureLoading && (
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
                        {isMobileDevice() 
                          ? 'Kamera ile çekin veya galeriden seçin'
                          : 'Resim yüklemek için tıklayın veya sürükleyin'
                        }
                      </p>
                      
                      {/* Desktop için normal input */}
                      {!isMobileDevice() && (
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                      )}
                      
                      {/* Mobil için kamera input */}
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                        id="camera-capture"
                      />
                      
                      {/* Mobil için galeri input */}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGallerySelect}
                        className="hidden"
                        id="gallery-select"
                      />
                      
                      {/* Desktop buton */}
                      {!isMobileDevice() && (
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-alo-orange text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                          Resim Seç
                        </label>
                      )}
                      
                      {/* Mobil butonlar - Gelişmiş versiyon */}
                      {isMobileDevice() && (
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const hasPermission = await checkCameraPermission();
                                if (hasPermission) {
                                  const cameraInput = document.getElementById('camera-capture') as HTMLInputElement;
                                  if (cameraInput) {
                                    cameraInput.click();
                                    // Kamera açıldığında kullanıcıya bilgi ver
                                    setTimeout(() => {
                                      if (document.activeElement === cameraInput) {
                                        // Kamera açıldı, kullanıcıya yardım et
                                        console.log('Kamera açıldı - Fotoğraf çekin');
                                      }
                                    }, 100);
                                  }
                                } else {
                                  // Kamera izni yoksa kullanıcıya yardım et
                                  const helpMessage = 
                                    'Kamera izni gerekli!\n\n' +
                                    '1. Tarayıcı adres çubuğundaki 🔒 simgesine tıklayın\n' +
                                    '2. "Kamera" iznini "İzin Ver" olarak ayarlayın\n' +
                                    '3. Sayfayı yenileyin\n\n' +
                                    'Şimdilik galeriden fotoğraf seçebilirsiniz.';
                                  
                                  alert(helpMessage);
                                }
                              } catch (error) {
                                console.error('Kamera açma hatası:', error);
                                alert('Kamera açılamadı. Galeriden fotoğraf seçebilirsiniz.');
                              }
                            }}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
                            title="📷 Kamera ile fotoğraf çekin"
                          >
                            📷 Kamera ile Çek
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const galleryInput = document.getElementById('gallery-select') as HTMLInputElement;
                                if (galleryInput) {
                                  galleryInput.click();
                                  console.log('Galeri seçici açıldı');
                                }
                              } catch (error) {
                                console.error('Galeri seçici hatası:', error);
                                alert('Galeri açılamadı. Lütfen tekrar deneyin.');
                              }
                            }}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                            title="🖼️ Galeriden fotoğraf seçin"
                          >
                            🖼️ Galeriden Seç
                          </button>
                          
                          {/* Kamera Yardım Butonu */}
                          <button
                            type="button"
                            onClick={() => {
                              const helpText = 
                                '📱 Mobil Kamera Kullanımı\n\n' +
                                '✅ Kamera ile Çek: Arka kamerayı kullanarak fotoğraf çekin\n' +
                                '✅ Galeriden Seç: Mevcut fotoğraflarınızdan seçin\n' +
                                '✅ Çoklu Seçim: Birden fazla fotoğraf seçebilirsiniz\n' +
                                '✅ Otomatik İşleme: Fotoğraflar otomatik sıkıştırılır\n\n' +
                                '💡 İpucu: En iyi sonuç için iyi aydınlatılmış ortamda çekim yapın!';
                              
                              alert(helpText);
                            }}
                            className="inline-flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors shadow-md text-sm"
                            title="📖 Kamera kullanımı hakkında yardım"
                          >
                            ❓ Yardım
                          </button>
                        </div>
                      )}
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
                            <div className="absolute top-1 right-1 flex gap-1">
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    const croppedFile = await cropImage(img);
                                    const newImages = [...images];
                                    newImages[index] = croppedFile;
                                    setImages(newImages);
                                    
                                    // Önizlemeyi güncelle
                                    const newPreview = await fileToBase64(croppedFile);
                                    const newPreviews = [...imagePreviews];
                                    newPreviews[index] = newPreview;
                                    setImagePreviews(newPreviews);
                                    localStorage.setItem('ilanImagePreviews', JSON.stringify(newPreviews));
                                  } catch (error) {
                                    console.error('Kırpma hatası:', error);
                                    alert('Fotoğraf kırpılırken bir hata oluştu.');
                                  }
                                }}
                                className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 text-xs"
                                title="Kırp"
                              >
                                ✂️
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                title="Sil"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resim yükleme alanı renderında, eğer imagePreviews varsa ve images.length === 0 ise önizlemeleri göster */}
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
                    <div className="flex flex-col items-center mb-2">
                      <Sparkles className="w-5 h-5 text-alo-orange mb-1" />
                      <h3 className="font-bold text-alo-orange text-lg text-center">{
                        plan.name === '90 Gün' ? '90 Günlük Premium'
                          : plan.name === '365 Gün' ? '365 Günlük Premium'
                          : plan.name
                      }</h3>
                      <span className="text-2xl font-extrabold text-gray-900 mt-1">{plan.price}₺</span>
                      <span className="text-sm text-gray-500">{plan.days} gün premium</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
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
    </>
  );
}
