'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Kategori yapısı
const categories = [
  {
    id: 1,
    name: 'Elektronik',
    slug: 'elektronik',
    icon: '📱',
    subCategories: [
      { id: 'telefon', name: 'Telefon', slug: 'telefon' },
      { id: 'bilgisayar', name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'tv-ses', name: 'TV & Ses Sistemleri', slug: 'tv-ses' },
      { id: 'fotograf', name: 'Fotoğraf & Kamera', slug: 'fotograf' },
      { id: 'tablet', name: 'Tablet', slug: 'tablet' },
      { id: 'akilli-saat', name: 'Akıllı Saat & Bileklik', slug: 'akilli-saat' },
      { id: 'aksesuarlar', name: 'Aksesuarlar', slug: 'aksesuarlar' },
      { id: 'diger-elektronik', name: 'Diğer Elektronik', slug: 'diger-elektronik' }
    ]
  },
  {
    id: 2,
    name: 'İş Makineleri',
    slug: 'is-makineleri',
    icon: '🚜',
    subCategories: [
      { id: 'ekskavator', name: 'Ekskavatör', slug: 'ekskavator' },
      { id: 'forklift', name: 'Forklift', slug: 'forklift' },
      { id: 'beton-pompa', name: 'Beton Pompa', slug: 'beton-pompa' },
      { id: 'yukleyici', name: 'Yükleyici', slug: 'yukleyici' },
      { id: 'vinc', name: 'Vinç', slug: 'vinc' },
      { id: 'dozer', name: 'Dozer', slug: 'dozer' },
      { id: 'greyder', name: 'Greyder', slug: 'greyder' },
      { id: 'diger-is-mak', name: 'Diğer İş Makineleri', slug: 'diger-is-mak' }
    ]
  },
  {
    id: 3,
    name: 'Ev Eşyaları',
    slug: 'ev-esyalari',
    icon: '🛋️',
    subCategories: [
      { id: 'mobilya', name: 'Mobilya', slug: 'mobilya' },
      { id: 'ev-tekstili', name: 'Ev Tekstili', slug: 'ev-tekstili' },
      { id: 'mutfak', name: 'Mutfak Gereçleri', slug: 'mutfak' },
      { id: 'beyaz-esya', name: 'Beyaz Eşya', slug: 'beyaz-esya' },
      { id: 'aydinlatma', name: 'Aydınlatma', slug: 'aydinlatma' },
      { id: 'hali-kilim', name: 'Halı & Kilim', slug: 'hali-kilim' },
      { id: 'dekorasyon', name: 'Dekorasyon', slug: 'dekorasyon' },
      { id: 'diger-ev-esya', name: 'Diğer Ev Eşyaları', slug: 'diger-ev-esya' }
    ]
  },
  {
    id: 4,
    name: 'Ev ve Bahçe',
    slug: 'ev-ve-bahce',
    icon: '🏡',
    subCategories: [
      { id: 'bahce-mobilya', name: 'Bahçe Mobilyası', slug: 'bahce-mobilya' },
      { id: 'bahce-ekipman', name: 'Bahçe Ekipmanları', slug: 'bahce-ekipman' },
      { id: 'bitki', name: 'Bitki & Tohum', slug: 'bitki' },
      { id: 'havuz', name: 'Havuz & Spa', slug: 'havuz' },
      { id: 'yapi-malzeme', name: 'Yapı Malzemeleri', slug: 'yapi-malzeme' },
      { id: 'tamir-malzeme', name: 'Tamir Malzemeleri', slug: 'tamir-malzeme' },
      { id: 'bahce-dekor', name: 'Bahçe Dekorasyonu', slug: 'bahce-dekor' },
      { id: 'diger-ev-bahce', name: 'Diğer Ev ve Bahçe', slug: 'diger-ev-bahce' }
    ]
  },
  {
    id: 5,
    name: 'Sağlık ve Güzellik',
    slug: 'saglik-ve-guzellik',
    icon: '💅',
    subCategories: [
      { id: 'kozmetik', name: 'Kozmetik', slug: 'kozmetik' },
      { id: 'parfum', name: 'Parfüm', slug: 'parfum' },
      { id: 'cilt-bakim', name: 'Cilt Bakımı', slug: 'cilt-bakim' },
      { id: 'sac-bakim', name: 'Saç Bakımı', slug: 'sac-bakim' },
      { id: 'makyaj', name: 'Makyaj', slug: 'makyaj' },
      { id: 'diyet', name: 'Diyet & Beslenme', slug: 'diyet' },
      { id: 'spor-urunleri', name: 'Spor Ürünleri', slug: 'spor-urunleri' },
      { id: 'kisisel-bakim', name: 'Kişisel Bakım Aletleri', slug: 'kisisel-bakim' },
      { id: 'diger-saglik', name: 'Diğer Sağlık & Güzellik', slug: 'diger-saglik' }
    ]
  },
  {
    id: 6,
    name: 'Eğitim ve Kurslar',
    slug: 'egitim-ve-kurslar',
    icon: '📚',
    subCategories: [
      { id: 'yabanci-dil', name: 'Yabancı Dil Kursları', slug: 'yabanci-dil' },
      { id: 'bilgisayar', name: 'Bilgisayar Kursları', slug: 'bilgisayar-kurslari' },
      { id: 'muzik', name: 'Müzik Kursları', slug: 'muzik' },
      { id: 'spor', name: 'Spor Kursları', slug: 'spor-kurslari' },
      { id: 'sanat', name: 'Sanat Kursları', slug: 'sanat' },
      { id: 'mesleki', name: 'Mesleki Kurslar', slug: 'mesleki' },
      { id: 'ozel-ders', name: 'Özel Dersler', slug: 'ozel-ders' },
      { id: 'surucu', name: 'Sürücü Kursları', slug: 'surucu' },
      { id: 'diger-kurs', name: 'Diğer Kurslar', slug: 'diger-kurs' }
    ]
  },
  {
    id: 7,
    name: 'Moda ve Stil',
    slug: 'moda-ve-stil',
    icon: '👗',
    subCategories: [
      { id: 'kadin-giyim', name: 'Kadın Giyim', slug: 'kadin-giyim' },
      { id: 'erkek-giyim', name: 'Erkek Giyim', slug: 'erkek-giyim' },
      { id: 'cocuk-giyim', name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
      { id: 'ayakkabi', name: 'Ayakkabı', slug: 'ayakkabi' },
      { id: 'canta', name: 'Çanta', slug: 'canta' },
      { id: 'aksesuar', name: 'Aksesuar', slug: 'aksesuar' },
      { id: 'taki', name: 'Takı', slug: 'taki' },
      { id: 'gozluk', name: 'Gözlük', slug: 'gozluk' },
      { id: 'diger-moda', name: 'Diğer Moda', slug: 'diger-moda' }
    ]
  },
  {
    id: 8,
    name: 'Çocukların Dünyası',
    slug: 'cocuklarin-dunyasi',
    icon: '🧸',
    subCategories: [
      { id: 'oyuncak', name: 'Oyuncak', slug: 'oyuncak' },
      { id: 'bebek-giyim', name: 'Bebek Giyim', slug: 'bebek-giyim' },
      { id: 'bebek-bakim', name: 'Bebek Bakım', slug: 'bebek-bakim' },
      { id: 'cocuk-odasi', name: 'Çocuk Odası', slug: 'cocuk-odasi' },
      { id: 'cocuk-kitap', name: 'Çocuk Kitapları', slug: 'cocuk-kitap' },
      { id: 'cocuk-ayakkabi', name: 'Çocuk Ayakkabı', slug: 'cocuk-ayakkabi' },
      { id: 'cocuk-aksesuar', name: 'Çocuk Aksesuar', slug: 'cocuk-aksesuar' },
      { id: 'anne-bebek', name: 'Anne & Bebek', slug: 'anne-bebek' },
      { id: 'diger-cocuk', name: 'Diğer Çocuk', slug: 'diger-cocuk' }
    ]
  },
  {
    id: 9,
    name: 'Ticaret ve Catering',
    slug: 'ticaret-ve-catering',
    icon: '🍽️',
    subCategories: [
      { id: 'restoran', name: 'Restoran', slug: 'restoran' },
      { id: 'kafe', name: 'Kafe', slug: 'kafe' },
      { id: 'pastane', name: 'Pastane', slug: 'pastane' },
      { id: 'catering', name: 'Catering', slug: 'catering' },
      { id: 'gida-urunleri', name: 'Gıda Ürünleri', slug: 'gida-urunleri' },
      { id: 'mutfak-ekipman', name: 'Mutfak Ekipmanları', slug: 'mutfak-ekipman' },
      { id: 'toplu-siparis', name: 'Toplu Sipariş', slug: 'toplu-siparis' },
      { id: 'diger-ticaret', name: 'Diğer Ticaret', slug: 'diger-ticaret' }
    ]
  },
  {
    id: 10,
    name: 'Sporlar, Oyunlar ve Eğlenceler',
    slug: 'sporlar-oyunlar-eglenceler',
    icon: '🎮',
    subCategories: [
      { id: 'spor-ekipman', name: 'Spor Ekipmanları', slug: 'spor-ekipman' },
      { id: 'takim-sporlari', name: 'Takım Sporları', slug: 'takim-sporlari' },
      { id: 'bireysel-sporlar', name: 'Bireysel Sporlar', slug: 'bireysel-sporlar' },
      { id: 'oyun-konsol', name: 'Oyun Konsolları', slug: 'oyun-konsol' },
      { id: 'video-oyun', name: 'Video Oyunları', slug: 'video-oyun' },
      { id: 'masa-oyun', name: 'Masa Oyunları', slug: 'masa-oyun' },
      { id: 'eglence-hobi', name: 'Eğlence & Hobi', slug: 'eglence-hobi' },
      { id: 'outdoor', name: 'Outdoor Aktiviteler', slug: 'outdoor' },
      { id: 'diger-spor-oyun', name: 'Diğer Spor & Eğlence', slug: 'diger-spor-oyun' }
    ]
  },
  {
    id: 11,
    name: 'İş İlanları',
    slug: 'is-ilanlari',
    icon: '💼',
    subCategories: [
      { id: 'tam-zamanli', name: 'Tam Zamanlı', slug: 'tam-zamanli' },
      { id: 'yarim-zamanli', name: 'Yarı Zamanlı', slug: 'yarim-zamanli' },
      { id: 'freelance', name: 'Freelance', slug: 'freelance' },
      { id: 'staj', name: 'Staj', slug: 'staj' },
      { id: 'gecici', name: 'Geçici İşler', slug: 'gecici' },
      { id: 'yonetici', name: 'Yönetici Pozisyonları', slug: 'yonetici' },
      { id: 'diger-is', name: 'Diğer İş İlanları', slug: 'diger-is' }
    ]
  },
  {
    id: 12,
    name: 'Yedek Parça',
    slug: 'yedek-parca',
    icon: '🔧',
    subCategories: [
      { id: 'otomotiv', name: 'Otomotiv', slug: 'otomotiv' },
      { id: 'elektronik', name: 'Elektronik', slug: 'elektronik' },
      { id: 'makine', name: 'Makine', slug: 'makine' },
      { id: 'aksesuar', name: 'Aksesuar', slug: 'aksesuar' },
      { id: 'beyaz-esya-parca', name: 'Beyaz Eşya Parçaları', slug: 'beyaz-esya-parca' },
      { id: 'bisiklet-moto-parca', name: 'Bisiklet & Motosiklet Parçaları', slug: 'bisiklet-moto-parca' },
      { id: 'diger-yedek', name: 'Diğer Yedek Parça', slug: 'diger-yedek' }
    ]
  },
  {
    id: 13,
    name: 'Hizmetler',
    slug: 'hizmetler',
    icon: '🛠️',
    subCategories: [
      { id: 'tadilat', name: 'Tadilat & Dekorasyon', slug: 'tadilat' },
      { id: 'nakliyat', name: 'Nakliyat', slug: 'nakliyat' },
      { id: 'temizlik', name: 'Temizlik', slug: 'temizlik' },
      { id: 'tamir', name: 'Tamir & Bakım', slug: 'tamir' },
      { id: 'ozel-ders', name: 'Özel Ders', slug: 'ozel-ders' },
      { id: 'organizasyon', name: 'Organizasyon', slug: 'organizasyon' },
      { id: 'danismanlik', name: 'Danışmanlık', slug: 'danismanlik' },
      { id: 'saglik-hizmet', name: 'Sağlık Hizmetleri', slug: 'saglik-hizmet' },
      { id: 'diger-hizmet', name: 'Diğer Hizmetler', slug: 'diger-hizmet' }
    ]
  },
  {
    id: 14,
    name: 'Diğer',
    slug: 'diger',
    icon: '📦',
    subCategories: [
      { id: 'spor', name: 'Spor & Outdoor', slug: 'spor' },
      { id: 'hobi', name: 'Hobi & Koleksiyon', slug: 'hobi' },
      { id: 'sanat', name: 'Sanat & Antika', slug: 'sanat' },
      { id: 'diger', name: 'Diğer', slug: 'diger' }
    ]
  }
];

export default function AddListingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    condition: 'new',
    brand: '',
    model: '',
    year: '',
    phone: '',
    email: '',
    isPremium: false,
    showPhone: true,
  });

  // Seçili kategorinin alt kategorilerini bul
  const currentCategory = categories.find(cat => cat.slug === selectedCategory);
  const subCategories = currentCategory?.subCategories || [];

  // Form verilerini güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Resim yükleme işlemi
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('En fazla 5 resim yükleyebilirsiniz');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Önizleme URL'lerini oluştur
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Resmi kaldır
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      return newUrls.filter((_, i) => i !== index);
    });
  };

  // Form gönderimi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!selectedCategory || !selectedSubCategory) {
      alert('Lütfen kategori ve alt kategori seçin');
      return;
    }

    if (images.length === 0) {
      alert('Lütfen en az bir resim yükleyin');
      return;
    }

    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    // TODO: API'ye gönder
    console.log('Form verileri:', {
      ...formData,
      category: selectedCategory,
      subCategory: selectedSubCategory,
      images
    });

    // Başarılı gönderim sonrası yönlendirme
    router.push('/ilanlarim');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-alo-dark mb-8">Yeni İlan Ver</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Kategori Seçimi */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">Kategori Seçimi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory('');
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Kategori
                </label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  required
                  disabled={!selectedCategory}
                >
                  <option value="">Alt Kategori Seçin</option>
                  {subCategories.map((subCat) => (
                    <option key={subCat.id} value={subCat.slug}>
                      {subCat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* İlan Detayları */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">İlan Detayları</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlan Başlığı *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  placeholder="İlanınız için açıklayıcı bir başlık girin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  placeholder="İlanınız hakkında detaylı bilgi verin"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                      placeholder="0"
                      required
                    />
                    <span className="absolute right-4 top-2 text-gray-500">TL</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  >
                    <option value="new">Yeni</option>
                    <option value="used">İkinci El</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                    placeholder="Marka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                    placeholder="Model"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                  placeholder="İl, İlçe"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fotoğraflar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">Fotoğraflar</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={previewUrls[index]}
                      alt={`İlan fotoğrafı ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-alo-orange cursor-pointer flex items-center justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        Fotoğraf Ekle
                      </span>
                    </div>
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500">
                En fazla 5 fotoğraf yükleyebilirsiniz. Her fotoğraf en fazla 5MB olabilir.
              </p>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                    placeholder="05XX XXX XX XX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-alo-orange focus:border-alo-orange"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              {/* Telefon Görünürlüğü Seçeneği */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mt-4">
                <div className="flex items-center space-x-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, showPhone: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-alo-orange/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-alo-orange"></div>
                  </label>
                  <div>
                    <span className="text-sm font-medium text-gray-900">Telefon Numarası Görünürlüğü</span>
                    <p className="text-sm text-gray-500">Telefon numaranız ilan detay sayfasında görünsün mü?</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${formData.showPhone ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.showPhone ? 'Görünür' : 'Gizli'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Premium İlan Seçeneği */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">Premium İlan Seçenekleri</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="premium"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPremium: e.target.checked }))}
                    className="h-5 w-5 text-alo-orange focus:ring-alo-orange border-gray-300 rounded"
                  />
                  <div>
                    <label htmlFor="premium" className="text-lg font-medium text-alo-dark">
                      Premium İlan
                    </label>
                    <p className="text-sm text-gray-500">
                      İlanınızı öne çıkarın ve daha fazla görüntülenme elde edin
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-alo-orange">₺99<span className="text-sm text-gray-500">/ay</span></p>
                  <p className="text-sm text-green-600">İlk 30 gün ücretsiz!</p>
                </div>
              </div>

              {formData.isPremium && (
                <div className="bg-alo-light rounded-lg p-4">
                  <h3 className="font-semibold text-alo-dark mb-2">Premium İlan Avantajları:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-alo-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      İlanınız kategori sayfasında en üstte gösterilir
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-alo-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Arama sonuçlarında öne çıkarılır
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-alo-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Premium rozeti ile güven artırın
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-alo-orange mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      İstatistik ve analiz raporlarına erişim
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Gönder Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-alo-orange hover:bg-alo-light-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {formData.isPremium ? 'Premium İlanı Yayınla' : 'İlanı Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 