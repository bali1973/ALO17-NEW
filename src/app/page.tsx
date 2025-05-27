'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Tip tanımları (örneğin, en üstte import'lardan sonra ekleyin)
type Subcategory = { id: number; name: string; slug: string; };
type Category = { id: number; name: string; icon: string; slug: string; subcategories: Subcategory[]; };
type Seller = { name: string; rating: number; memberSince: string; phone?: string; isVerified?: boolean; };
type PremiumFeature = { isActive: boolean; expiresAt: (string | null); isHighlighted: boolean; isFeatured: boolean; isUrgent: boolean; };
type Listing = {
  id: number;
  title: string;
  price: string;
  location: string;
  category: string;
  subcategory: string;
  description: string;
  images?: string[];
  image?: string; // (eski ilanlarda image kullanılıyor, images yoksa bu alan kullanılabilir)
  date: string;
  condition: string;
  type?: (typeof listingTypes)[keyof typeof listingTypes];
  status?: (typeof listingStatus)[keyof typeof listingStatus];
  showPhone?: boolean;
  isFavorite?: boolean;
  views?: number;
  favorites?: number;
  seller: Seller;
  premiumFeatures?: PremiumFeature;
};

// Kategoriler
const categories = [
  {
    id: 1,
    name: 'Elektronik',
    icon: '📱',
    slug: 'elektronik',
    subcategories: [
      { id: 101, name: 'Telefon', slug: 'telefon' },
      { id: 102, name: 'Tablet', slug: 'tablet' },
      { id: 103, name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 104, name: 'Televizyon', slug: 'televizyon' },
      { id: 105, name: 'Kamera', slug: 'kamera' },
      { id: 106, name: 'Kulaklık', slug: 'kulaklik' },
      { id: 107, name: 'Oyun Konsolu', slug: 'oyun-konsolu' },
      { id: 108, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 2,
    name: 'Ev ve Bahçe',
    icon: '🏡',
    slug: 'ev-ve-bahce',
    subcategories: [
      { id: 201, name: 'Mobilya', slug: 'mobilya' },
      { id: 202, name: 'Ev Tekstili', slug: 'ev-tekstili' },
      { id: 203, name: 'Bahçe', slug: 'bahce' },
      { id: 204, name: 'Mutfak Gereçleri', slug: 'mutfak-gerecleri' },
      { id: 205, name: 'Dekorasyon', slug: 'dekorasyon' },
      { id: 206, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 3,
    name: 'Spor',
    icon: '⚽',
    slug: 'spor',
    subcategories: [
      { id: 301, name: 'Fitness', slug: 'fitness' },
      { id: 302, name: 'Bisiklet', slug: 'bisiklet' },
      { id: 303, name: 'Kamp', slug: 'kamp' },
      { id: 304, name: 'Yüzme', slug: 'yuzme' },
      { id: 305, name: 'Spor Giyim', slug: 'spor-giyim' },
      { id: 306, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 4,
    name: 'Hobi & Sanat',
    icon: '🎨',
    slug: 'hobi-sanat',
    subcategories: [
      { id: 401, name: 'Müzik Aletleri', slug: 'muzik-aletleri' },
      { id: 402, name: 'Sanat Malzemeleri', slug: 'sanat-malzemeleri' },
      { id: 403, name: 'Koleksiyon', slug: 'koleksiyon' },
      { id: 404, name: 'El İşi', slug: 'el-isi' },
      { id: 405, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 5,
    name: 'Kitap',
    icon: '📚',
    slug: 'kitap',
    subcategories: [
      { id: 501, name: 'Roman', slug: 'roman' },
      { id: 502, name: 'Ders Kitabı', slug: 'ders-kitabi' },
      { id: 503, name: 'Çocuk Kitabı', slug: 'cocuk-kitabi' },
      { id: 504, name: 'Dergi', slug: 'dergi' },
      { id: 505, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 6,
    name: 'Turizm',
    icon: '✈️',
    slug: 'turizm',
    subcategories: [
      { id: 601, name: 'Tatil Paketleri', slug: 'tatil-paketleri' },
      { id: 602, name: 'Uçak Bileti', slug: 'ucak-bileti' },
      { id: 603, name: 'Otel', slug: 'otel' },
      { id: 604, name: 'Tur', slug: 'tur' },
      { id: 605, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 7,
    name: 'Hizmetler',
    icon: '🛠️',
    slug: 'hizmetler',
    subcategories: [
      { id: 701, name: 'Temizlik', slug: 'temizlik' },
      { id: 702, name: 'Nakliyat', slug: 'nakliyat' },
      { id: 703, name: 'Tadilat', slug: 'tadilat' },
      { id: 704, name: 'Tamir', slug: 'tamir' },
      { id: 705, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 8,
    name: 'Sağlık & Güzellik',
    icon: '💆‍♀️',
    slug: 'saglik-guzellik',
    subcategories: [
      { id: 801, name: 'Kozmetik', slug: 'kozmetik' },
      { id: 802, name: 'Parfüm', slug: 'parfum' },
      { id: 803, name: 'Cilt Bakımı', slug: 'cilt-bakimi' },
      { id: 804, name: 'Saç Bakımı', slug: 'sac-bakimi' },
      { id: 805, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 9,
    name: 'Eğitim & Kurslar',
    icon: '📝',
    slug: 'egitim-kurslar',
    subcategories: [
      { id: 901, name: 'Yabancı Dil', slug: 'yabanci-dil' },
      { id: 902, name: 'Müzik', slug: 'muzik' },
      { id: 903, name: 'Dans', slug: 'dans' },
      { id: 904, name: 'Spor', slug: 'spor' },
      { id: 905, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 10,
    name: 'Moda & Stil',
    icon: '👗',
    slug: 'moda-stil',
    subcategories: [
      { id: 1001, name: 'Kadın Giyim', slug: 'kadin-giyim' },
      { id: 1002, name: 'Erkek Giyim', slug: 'erkek-giyim' },
      { id: 1003, name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
      { id: 1004, name: 'Ayakkabı', slug: 'ayakkabi' },
      { id: 1005, name: 'Çanta', slug: 'canta' },
      { id: 1006, name: 'Aksesuar', slug: 'aksesuar' },
      { id: 1007, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 11,
    name: 'Çocuk Dünyası',
    icon: '🧸',
    slug: 'cocuk-dunyasi',
    subcategories: [
      { id: 1101, name: 'Oyuncak', slug: 'oyuncak' },
      { id: 1102, name: 'Bebek Giyim', slug: 'bebek-giyim' },
      { id: 1103, name: 'Bebek Arabası', slug: 'bebek-arabasi' },
      { id: 1104, name: 'Bebek Odası', slug: 'bebek-odasi' },
      { id: 1105, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 12,
    name: 'Catering & Ticaret',
    icon: '🍽️',
    slug: 'catering-ticaret',
    subcategories: [
      { id: 1201, name: 'Catering', slug: 'catering' },
      { id: 1202, name: 'Restoran', slug: 'restoran' },
      { id: 1203, name: 'Kafe', slug: 'kafe' },
      { id: 1204, name: 'Pastane', slug: 'pastane' },
      { id: 1205, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 13,
    name: 'Bilgisayarlar & Ofis Ekipmanları',
    icon: '💻',
    slug: 'bilgisayarlar-ofis-ekipmanlari',
    subcategories: [
      { id: 1301, name: 'Dizüstü Bilgisayar', slug: 'dizustu-bilgisayar' },
      { id: 1302, name: 'Masaüstü Bilgisayar', slug: 'masaustu-bilgisayar' },
      { id: 1303, name: 'Monitör', slug: 'monitor' },
      { id: 1304, name: 'Yazıcı', slug: 'yazici' },
      { id: 1305, name: 'Ofis Mobilyası', slug: 'ofis-mobilyasi' },
      { id: 1306, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 14,
    name: 'Ücretsiz Gel Al',
    icon: '🎁',
    slug: 'ucretsiz-gel-al',
    subcategories: [
      { id: 1401, name: 'Mobilya', slug: 'mobilya' },
      { id: 1402, name: 'Elektronik', slug: 'elektronik' },
      { id: 1403, name: 'Giyim', slug: 'giyim' },
      { id: 1404, name: 'Kitap', slug: 'kitap' },
      { id: 1405, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 15,
    name: 'Diğer',
    icon: '📦',
    slug: 'diger',
    subcategories: [
      { id: 1501, name: 'Diğer', slug: 'diger' },
    ],
  },
];

// İlan Tipleri
const listingTypes = {
  FREE: 'free',
  PREMIUM: 'premium',
};

// İlan Durumları
const listingStatus = {
  DRAFT: 'draft',
  PENDING_PAYMENT: 'pending_payment',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SOLD: 'sold',
};

// Örnek veriler
const featuredListings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256GB',
    price: '45.000',
    location: 'Konak, İzmir',
    category: 'Elektronik',
    subcategory: 'Telefon',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
    images: [
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+1',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+2',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+3',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+4',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max+5',
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
      phone: '0532 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-20',
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  {
    id: 2,
    title: 'MacBook Pro M2 16GB RAM',
    price: '65.000',
    location: 'Kadıköy, İstanbul',
    category: 'Bilgisayarlar & Ofis Ekipmanları',
    subcategory: 'Dizüstü Bilgisayar',
    description: '2023 model MacBook Pro M2, 16GB RAM, 512GB SSD. Faturalı ve garantili.',
    images: [
      'https://placehold.co/600x400/e2e8f0/1e293b?text=MacBook+Pro+M2+1',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=MacBook+Pro+M2+2',
      'https://placehold.co/600x400/e2e8f0/1e293b?text=MacBook+Pro+M2+3',
    ],
    date: '2024-03-19',
    condition: 'Sıfır',
    type: listingTypes.FREE,
    status: listingStatus.ACTIVE,
    showPhone: false,
    isFavorite: true,
    views: 189,
    favorites: 8,
    seller: {
      name: 'Mehmet Demir',
      rating: 4.9,
      memberSince: '2022-06-20',
      phone: '0533 765 4321',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: null,
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  {
    id: 3,
    title: 'Samsung 65" 4K Smart TV',
    price: '32.000',
    location: 'Çankaya, Ankara',
    category: 'Elektronik',
    subcategory: 'Televizyon',
    description: 'Samsung 65" 4K Smart TV, 2023 model. Faturalı ve garantili.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Samsung+4K+TV',
    date: '2024-03-18',
    condition: 'Sıfır',
    seller: {
      name: 'Ayşe Kaya',
      rating: 4.7,
      memberSince: '2023-03-10',
    },
  },
  {
    id: 4,
    title: 'Profesyonel Temizlik Hizmeti',
    price: '500',
    location: 'Karşıyaka, İzmir',
    category: 'Hizmetler',
    subcategory: 'Temizlik',
    description: 'Profesyonel temizlik hizmeti. Ev ve ofis temizliği. Referanslı ve deneyimli ekip.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Temizlik+Hizmeti',
    date: '2024-03-17',
    condition: 'Hizmet',
    seller: {
      name: 'Temizlik A.Ş.',
      rating: 4.9,
      memberSince: '2022-01-01',
    },
  },
  {
    id: 5,
    title: 'Özel Matematik Dersi',
    price: '300',
    location: 'Bornova, İzmir',
    category: 'Eğitim & Kurslar',
    subcategory: 'Diğer',
    description: 'Üniversite öğrencilerine özel matematik dersi. Online veya yüz yüze.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Matematik+Dersi',
    date: '2024-03-16',
    condition: 'Hizmet',
    seller: {
      name: 'Dr. Ali Öğretmen',
      rating: 5.0,
      memberSince: '2021-09-01',
    },
  },
  {
    id: 6,
    title: 'Evden Eve Nakliyat',
    price: '2.500',
    location: 'İzmir',
    category: 'Hizmetler',
    subcategory: 'Nakliyat',
    description: 'Profesyonel evden eve nakliyat hizmeti. Sigortalı ve güvenli taşıma.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Nakliyat+Hizmeti',
    date: '2024-03-15',
    condition: 'Hizmet',
    seller: {
      name: 'Güvenli Nakliyat',
      rating: 4.8,
      memberSince: '2022-03-15',
    },
  },
  {
    id: 7,
    title: 'Ücretsiz Koltuk Takımı',
    price: '0',
    location: 'Buca, İzmir',
    category: 'Ücretsiz Gel Al',
    subcategory: 'Mobilya',
    description: '3+2 koltuk takımı, 5 yıllık, temiz durumda. Ücretsiz gel al.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Koltuk+Takimi',
    date: '2024-03-14',
    condition: 'İkinci El',
    seller: {
      name: 'Can Yıldız',
      rating: 4.5,
      memberSince: '2023-05-20',
    },
  },
  {
    id: 8,
    title: 'Yazlık Kiralık Villa',
    price: '5.000',
    location: 'Çeşme, İzmir',
    category: 'Turizm',
    subcategory: 'Tatil Paketleri',
    description: 'Çeşme\'de 3+1 yazlık villa. Deniz manzaralı, havuzlu. Günlük, haftalık, aylık kiralık.',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Yazlik+Villa',
    date: '2024-03-13',
    condition: 'Hizmet',
    seller: {
      name: 'Çeşme Emlak',
      rating: 4.7,
      memberSince: '2021-04-15',
    },
  },
];

// Premium İlan Özellikleri
const premiumFeatures = {
  price: 149.00,
  duration: 30, // gün
  features: [
    '5 adet resim yükleme',
    'İlan öne çıkarma',
    'Premium rozeti',
    'Detaylı istatistikler',
    'Favori sayısı görüntüleme',
    'İlan görüntülenme sayısı',
    'Telefon görünürlüğü kontrolü',
    'Ön izleme özelliği',
    '7/24 destek',
  ],
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [previewListing, setPreviewListing] = useState<Listing | null>(null);

  const handleListingSubmit = (listing: Listing) => {
    if (listing.type === listingTypes.PREMIUM) {
      setShowPremiumModal(true);
      setPreviewListing(listing);
    } else {
      // Ücretsiz ilanı direkt yayınla (API çağrısı yapılacak)
    }
  };

  const handlePremiumPurchase = async (listing: Listing) => {
    // Ödeme sayfasına yönlendir (API çağrısı yapılacak)
  };

  const handleFavoriteToggle = (listingId: number) => {
    // Favori ekleme/çıkarma işlemi (API çağrısı yapılacak)
  };

  return (
    <main className="min-h-screen bg-alo-light">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-alo-blue via-alo-light-blue to-alo-blue">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              ALO17.TR
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90">
              Türkiye'nin En Büyük İlan Platformu
            </p>
            
            {/* Arama Kutusu */}
            <div className="bg-white rounded-xl p-2 shadow-xl">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ne aramıştınız?"
                  className="flex-1 px-6 py-4 rounded-lg text-alo-dark focus:outline-none focus:ring-2 focus:ring-alo-orange text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-alo-orange hover:bg-alo-light-orange px-8 py-4 rounded-lg font-semibold transition-colors text-lg whitespace-nowrap text-white">
                  İlan Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kategoriler */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Kategoriler</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md p-6 text-center transition-transform hover:scale-105">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Öne Çıkan İlanlar */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-alo-dark">Öne Çıkan İlanlar</h2>
          <Link 
            href="/ilanlar" 
            className="text-alo-orange hover:text-alo-light-orange font-semibold"
          >
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link 
              key={listing.id} 
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="h-48 bg-alo-light-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {listing.images ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : listing.image && (
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {listing.premiumFeatures?.isActive && (
                  <div className="absolute top-2 right-2 bg-alo-orange text-white px-2 py-1 rounded text-sm font-semibold">
                    Premium
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-alo-orange transition-colors">
                  {listing.title}
                </h3>
                <p className="text-alo-red font-bold text-xl mb-2">{listing.price} TL</p>
                <div className="flex items-center text-gray-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {listing.location}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {listing.views || 0} görüntülenme
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {listing.favorites || 0} favori
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Neden Biz */}
      <div className="bg-alo-light py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-alo-dark mb-12 text-center">Neden ALO17.TR?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="text-4xl mb-4 text-alo-blue">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-alo-orange to-alo-light-orange text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">İlanınızı Hemen Verin!</h2>
          <p className="text-xl mb-8 text-white/90">Binlerce potansiyel alıcıya ulaşın</p>
          <Link
            href="/ilan-ver"
            className="bg-white text-alo-orange px-8 py-4 rounded-lg font-semibold hover:bg-alo-light transition-colors inline-block text-lg"
          >
            Ücretsiz İlan Ver
          </Link>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && previewListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Premium İlan Özellikleri</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">İlan Önizleme</h3>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">{previewListing.title}</h4>
                <p className="text-gray-600">{previewListing.description}</p>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {previewListing.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${previewListing.title} - ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Premium Özellikler</h3>
              <ul className="space-y-2">
                {premiumFeatures.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-alo-orange">{premiumFeatures.price} TL</p>
                <p className="text-sm text-gray-600">{premiumFeatures.duration} gün geçerli</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => handlePremiumPurchase(previewListing)}
                  className="px-6 py-2 bg-alo-orange text-white rounded-lg hover:bg-alo-light-orange"
                >
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 

const features = [
  {
    id: 1,
    icon: '🔒',
    title: 'Güvenli Alışveriş',
    description: 'Güvenli ödeme sistemi ve doğrulanmış ilanlar ile güvenle alışveriş yapın.',
  },
  {
    id: 2,
    icon: '⚡',
    title: 'Hızlı İlan',
    description: 'Birkaç dakika içinde ilanınızı oluşturun ve binlerce alıcıya ulaşın.',
  },
  {
    id: 3,
    icon: '📱',
    title: 'Mobil Uyumlu',
    description: 'Tüm cihazlardan kolayca erişin ve ilanlarınızı yönetin.',
  },
]; 