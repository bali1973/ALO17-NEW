'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { listingTypes, listingStatus, type Listing, type CategorySlug, type SubCategorySlug } from '@/types/listings';

// Boş ilan listesi oluşturucu
const createEmptyListings = (): Record<SubCategorySlug, Listing[]> => ({
  telefon: [],
  bilgisayar: [],
  fitness: [],
  tenis: [],
  mobilya: [],
  'beyaz-esya': [],
  'ozel-ders': [],
  temizlik: []
});

// Örnek veriler
const categoryListings: Record<CategorySlug, Record<SubCategorySlug, Listing[]>> = {
  'elektronik': {
    ...createEmptyListings(),
    telefon: [
      {
        id: 1,
        title: 'iPhone 14 Pro Max 256GB',
        price: '45.000',
        location: 'Konak, İzmir',
        category: 'Elektronik',
        subcategory: 'Telefon',
        description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-20',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: true,
        isFavorite: false,
        views: 245,
        favorites: 12,
        seller: {
          name: 'Ahmet Yılmaz',
          rating: 4.8,
          memberSince: '2023-01-15',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-20',
          isHighlighted: true,
          isFeatured: true,
          isUrgent: false,
        },
      }
    ]
  },
  'spor': createEmptyListings(),
  'ev-yasam': createEmptyListings(),
  'hizmetler': createEmptyListings()
};

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

const filters = {
  priceRange: [
    { label: 'Tümü', value: 'all' },
    { label: '0 - 10.000 TL', value: '0-10000' },
    { label: '10.000 - 25.000 TL', value: '10000-25000' },
    { label: '25.000 - 50.000 TL', value: '25000-50000' },
    { label: '50.000 TL ve üzeri', value: '50000+' },
  ],
  condition: [
    { label: 'Tümü', value: 'all' },
    { label: 'Yeni', value: 'new' },
    { label: 'İkinci El', value: 'used' },
  ],
  sortBy: [
    { label: 'En Yeni', value: 'newest' },
    { label: 'Fiyat (Artan)', value: 'price-asc' },
    { label: 'Fiyat (Azalan)', value: 'price-desc' },
    { label: 'En Çok Görüntülenen', value: 'most-viewed' },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const categorySlug = params.slug as CategorySlug;
  
  // Kategori ismini formatla
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatSlug(categorySlug);
  
  // Mevcut kategorideki tüm ilanları birleştir
  const currentListings = Object.values(categoryListings[categorySlug] || {}).flat();
  const totalListings = currentListings.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-alo-orange">Ana Sayfa</Link>
        <span>/</span>
        <span className="text-alo-dark font-medium">{categoryName}</span>
      </div>

      {/* Başlık ve Filtreler */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-alo-dark">{categoryName}</h1>
          <p className="text-gray-600 mt-1">{totalListings} ilan bulundu</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:border-alo-orange"
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtreler</span>
          </button>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:border-alo-orange focus:outline-none focus:border-alo-orange"
          >
            {filters.sortBy.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Alt Kategoriler ve Filtreler Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Alt Kategoriler */}
            {categories.find(cat => cat.slug === categorySlug) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-alo-dark mb-4">Alt Kategoriler</h2>
                <div className="space-y-2">
                  {categories.find(cat => cat.slug === categorySlug)?.subCategories.map((subCat) => (
                    <Link
                      key={subCat.id}
                      href={`/kategori/${categorySlug}/${subCat.slug}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{subCat.name}</span>
                      <span className="text-gray-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Filtreler */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-alo-dark">Filtreler</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-alo-red lg:hidden"
                  >
                    <AdjustmentsHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Fiyat Aralığı */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h3>
                    <div className="space-y-2">
                      {filters.priceRange.map((range) => (
                        <label key={range.value} className="flex items-center">
                          <input
                            type="radio"
                            name="priceRange"
                            value={range.value}
                            checked={selectedPriceRange === range.value}
                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                            className="w-4 h-4 text-alo-orange border-gray-300 focus:ring-alo-orange"
                          />
                          <span className="ml-2 text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Durum */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Durum</h3>
                    <div className="space-y-2">
                      {filters.condition.map((condition) => (
                        <label key={condition.value} className="flex items-center">
                          <input
                            type="radio"
                            name="condition"
                            value={condition.value}
                            checked={selectedCondition === condition.value}
                            onChange={(e) => setSelectedCondition(e.target.value)}
                            className="w-4 h-4 text-alo-orange border-gray-300 focus:ring-alo-orange"
                          />
                          <span className="ml-2 text-gray-700">{condition.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* İlan Listesi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {currentListings.map((listing: Listing) => (
            <Link
              key={listing.id}
              href={`/ilan/${listing.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {listing.condition === 'Yeni' && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Yeni
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-alo-dark line-clamp-2 mb-2">{listing.title}</h3>
                <p className="text-xl font-bold text-alo-red mb-2">{listing.price} TL</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{listing.location}</span>
                  <span>{new Date(listing.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{listing.seller.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sayfalama */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange">
            Önceki
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === 1
                  ? 'bg-alo-orange text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange">
            Sonraki
          </button>
        </nav>
      </div>
    </div>
  );
} 