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
      { id: 1, name: 'Telefon', slug: 'telefon' },
      { id: 2, name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 3, name: 'Tablet', slug: 'tablet' },
      { id: 4, name: 'Televizyon', slug: 'televizyon' },
      { id: 5, name: 'Kamera', slug: 'kamera' },
      { id: 6, name: 'Oyun Konsolu', slug: 'oyun-konsolu' },
    ]
  },
  {
    id: 2,
    name: 'İş Makineleri',
    slug: 'is-makineleri',
    icon: '🚜',
    subCategories: [
      { id: 1, name: 'Ekskavatör', slug: 'ekskavator' },
      { id: 2, name: 'Beko Loder', slug: 'beko-loder' },
      { id: 3, name: 'Forklift', slug: 'forklift' },
      { id: 4, name: 'Kamyon', slug: 'kamyon' },
      { id: 5, name: 'Kepçe', slug: 'kepce' },
    ]
  },
  {
    id: 3,
    name: 'Ev Eşyaları',
    slug: 'ev-esyalari',
    icon: '🏠',
    subCategories: [
      { id: 1, name: 'Mobilya', slug: 'mobilya' },
      { id: 2, name: 'Beyaz Eşya', slug: 'beyaz-esya' },
      { id: 3, name: 'Mutfak Gereçleri', slug: 'mutfak-gerecleri' },
      { id: 4, name: 'Dekorasyon', slug: 'dekorasyon' },
    ]
  },
  {
    id: 4,
    name: 'İş İlanları',
    slug: 'is-ilanlari',
    icon: '💼',
    subCategories: [
      { id: 1, name: 'Tam Zamanlı', slug: 'tam-zamanli' },
      { id: 2, name: 'Yarı Zamanlı', slug: 'yarim-zamanli' },
      { id: 3, name: 'Freelance', slug: 'freelance' },
      { id: 4, name: 'Staj', slug: 'staj' },
    ]
  },
  {
    id: 5,
    name: 'Yedek Parça',
    slug: 'yedek-parca',
    icon: '🔧',
    subCategories: [
      { id: 1, name: 'Otomotiv', slug: 'otomotiv' },
      { id: 2, name: 'İş Makinesi', slug: 'is-makinesi' },
      { id: 3, name: 'Elektronik', slug: 'elektronik' },
      { id: 4, name: 'Beyaz Eşya', slug: 'beyaz-esya' },
    ]
  },
  {
    id: 6,
    name: 'Diğer',
    slug: 'diger',
    icon: '📦',
    subCategories: [
      { id: 1, name: 'Koleksiyon', slug: 'koleksiyon' },
      { id: 2, name: 'Hobi', slug: 'hobi' },
      { id: 3, name: 'Spor', slug: 'spor' },
      { id: 4, name: 'Bahçe', slug: 'bahce' },
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
    if (files.length + images.length > 10) {
      alert('En fazla 10 resim yükleyebilirsiniz');
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Resim Yükleme Alanı */}
                <label className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-alo-orange group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <PhotoIcon className="w-8 h-8 text-gray-400 group-hover:text-alo-orange mx-auto mb-2" />
                    <span className="text-sm text-gray-500">Fotoğraf Ekle</span>
                  </div>
                </label>

                {/* Yüklenen Fotoğraflar */}
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                En fazla 10 fotoğraf yükleyebilirsiniz. Her fotoğraf en fazla 5MB olabilir.
              </p>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-alo-dark mb-4">İletişim Bilgileri</h2>
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
          </div>

          {/* Gönder Butonu */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-alo-orange hover:bg-alo-light-orange text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              İlanı Yayınla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 