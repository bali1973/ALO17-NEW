'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { 
  listingTypes, 
  listingStatus, 
  type Listing, 
  type Category, 
  type Subcategory,
  type Seller,
  type PremiumFeature 
} from '@/types/listings';

// Kategoriler
const categories: Category[] = [
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
      { id: 108, name: 'Akıllı Saat', slug: 'akilli-saat' },
      { id: 109, name: 'Ses Sistemleri', slug: 'ses-sistemleri' },
      { id: 110, name: 'Elektronik Aksesuar', slug: 'elektronik-aksesuar' },
      { id: 111, name: 'Diğer', slug: 'diger' },
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
      { id: 206, name: 'Aydınlatma', slug: 'aydinlatma' },
      { id: 207, name: 'Banyo', slug: 'banyo' },
      { id: 208, name: 'Ev Aletleri', slug: 'ev-aletleri' },
      { id: 209, name: 'Beyaz Eşya', slug: 'beyaz-esya' },
      { id: 210, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 3,
    name: 'Hobi & Sanat',
    icon: '🎨',
    slug: 'hobi-sanat',
    subcategories: [
      { id: 301, name: 'Müzik Aletleri', slug: 'muzik-aletleri' },
      { id: 302, name: 'Sanat Malzemeleri', slug: 'sanat-malzemeleri' },
      { id: 303, name: 'Koleksiyon', slug: 'koleksiyon' },
      { id: 304, name: 'El İşi', slug: 'el-isi' },
      { id: 305, name: 'Fotoğrafçılık', slug: 'fotografcilik' },
      { id: 306, name: 'Bahçe & Bitki', slug: 'bahce-bitki' },
      { id: 307, name: 'Balıkçılık', slug: 'balikcilik' },
      { id: 308, name: 'Spor Malzemeleri', slug: 'spor-malzemeleri' },
      { id: 309, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 4,
    name: 'Turizm & Konaklama',
    icon: '🏨',
    slug: 'turizm-konaklama',
    subcategories: [
      { id: 401, name: 'Otel', slug: 'otel' },
      { id: 402, name: 'Apart', slug: 'apart' },
      { id: 403, name: 'Pansiyon', slug: 'pansiyon' },
      { id: 404, name: 'Villa', slug: 'villa' },
      { id: 405, name: 'Kamp Alanı', slug: 'kamp-alani' },
      { id: 406, name: 'Butik Otel', slug: 'butik-otel' },
      { id: 407, name: 'Termal Tesis', slug: 'termal-tesis' },
      { id: 408, name: 'Dağ Evi', slug: 'dag-evi' },
      { id: 409, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 5,
    name: 'Hizmetler',
    icon: '🛠️',
    slug: 'hizmetler',
    subcategories: [
      { id: 501, name: 'Temizlik', slug: 'temizlik' },
      { id: 502, name: 'Nakliyat', slug: 'nakliyat' },
      { id: 503, name: 'Tadilat', slug: 'tadilat' },
      { id: 504, name: 'Tamir', slug: 'tamir' },
      { id: 505, name: 'Özel Ders', slug: 'ozel-ders' },
      { id: 506, name: 'Güzellik & Bakım', slug: 'guzellik-bakim' },
      { id: 507, name: 'Organizasyon', slug: 'organizasyon' },
      { id: 508, name: 'Danışmanlık', slug: 'danismanlik' },
      { id: 509, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 6,
    name: 'Sağlık & Güzellik',
    icon: '💆‍♀️',
    slug: 'saglik-guzellik',
    subcategories: [
      { id: 601, name: 'Kozmetik', slug: 'kozmetik' },
      { id: 602, name: 'Parfüm', slug: 'parfum' },
      { id: 603, name: 'Cilt Bakımı', slug: 'cilt-bakimi' },
      { id: 604, name: 'Saç Bakımı', slug: 'sac-bakimi' },
      { id: 605, name: 'Makyaj', slug: 'makyaj' },
      { id: 606, name: 'Kişisel Bakım', slug: 'kisisel-bakim' },
      { id: 607, name: 'Sağlık Ürünleri', slug: 'saglik-urunleri' },
      { id: 608, name: 'Güzellik Aletleri', slug: 'guzellik-aletleri' },
      { id: 609, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 7,
    name: 'Eğitim & Kurslar',
    icon: '📝',
    slug: 'egitim-kurslar',
    subcategories: [
      { id: 701, name: 'Yabancı Dil', slug: 'yabanci-dil' },
      { id: 702, name: 'Müzik', slug: 'muzik' },
      { id: 703, name: 'Dans', slug: 'dans' },
      { id: 704, name: 'Spor', slug: 'spor' },
      { id: 705, name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 706, name: 'Sanat', slug: 'sanat' },
      { id: 707, name: 'Kişisel Gelişim', slug: 'kisisel-gelisim' },
      { id: 708, name: 'Sürücü Kursu', slug: 'surucu-kursu' },
      { id: 709, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 8,
    name: 'Moda & Stil',
    icon: '👗',
    slug: 'moda-stil',
    subcategories: [
      { id: 801, name: 'Kadın Giyim', slug: 'kadin-giyim' },
      { id: 802, name: 'Erkek Giyim', slug: 'erkek-giyim' },
      { id: 803, name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
      { id: 804, name: 'Ayakkabı', slug: 'ayakkabi' },
      { id: 805, name: 'Çanta', slug: 'canta' },
      { id: 806, name: 'Aksesuar', slug: 'aksesuar' },
      { id: 807, name: 'Takı & Mücevher', slug: 'taki-mucevher' },
      { id: 808, name: 'Gözlük', slug: 'gozluk' },
      { id: 809, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 9,
    name: 'Çocuk Dünyası',
    icon: '🧸',
    slug: 'cocuk-dunyasi',
    subcategories: [
      { id: 901, name: 'Oyuncak', slug: 'oyuncak' },
      { id: 902, name: 'Bebek Giyim', slug: 'bebek-giyim' },
      { id: 903, name: 'Bebek Arabası', slug: 'bebek-arabasi' },
      { id: 904, name: 'Bebek Odası', slug: 'bebek-odasi' },
      { id: 905, name: 'Bebek Bakım', slug: 'bebek-bakim' },
      { id: 906, name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
      { id: 907, name: 'Çocuk Odası', slug: 'cocuk-odasi' },
      { id: 908, name: 'Eğitici Oyuncaklar', slug: 'egitici-oyuncaklar' },
      { id: 909, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 10,
    name: 'Catering & Ticaret',
    icon: '🍽️',
    slug: 'catering-ticaret',
    subcategories: [
      { id: 1001, name: 'Catering', slug: 'catering' },
      { id: 1002, name: 'Restoran', slug: 'restoran' },
      { id: 1003, name: 'Kafe', slug: 'kafe' },
      { id: 1004, name: 'Pastane', slug: 'pastane' },
      { id: 1005, name: 'Yemek', slug: 'yemek' },
      { id: 1006, name: 'İçecek', slug: 'icecek' },
      { id: 1007, name: 'Toptan Satış', slug: 'toptan-satis' },
      { id: 1008, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 11,
    name: 'Bilgisayarlar & Ofis Ekipmanları',
    icon: '💻',
    slug: 'bilgisayarlar-ofis-ekipmanlari',
    subcategories: [
      { id: 1101, name: 'Dizüstü Bilgisayar', slug: 'dizustu-bilgisayar' },
      { id: 1102, name: 'Masaüstü Bilgisayar', slug: 'masaustu-bilgisayar' },
      { id: 1103, name: 'Monitör', slug: 'monitor' },
      { id: 1104, name: 'Yazıcı', slug: 'yazici' },
      { id: 1105, name: 'Ofis Mobilyası', slug: 'ofis-mobilyasi' },
      { id: 1106, name: 'Ofis Malzemeleri', slug: 'ofis-malzemeleri' },
      { id: 1107, name: 'Ağ Ekipmanları', slug: 'ag-ekipmanlari' },
      { id: 1108, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 12,
    name: 'İş',
    icon: '💼',
    slug: 'is',
    subcategories: [
      { id: 1201, name: 'Tam Zamanlı', slug: 'tam-zamanli' },
      { id: 1202, name: 'Yarı Zamanlı', slug: 'yari-zamanli' },
      { id: 1203, name: 'Freelance', slug: 'freelance' },
      { id: 1204, name: 'Staj', slug: 'staj' },
      { id: 1205, name: 'Günlük İş', slug: 'gunluk-is' },
      { id: 1206, name: 'Evden Çalışma', slug: 'evden-calisma' },
      { id: 1207, name: 'Part Time', slug: 'part-time' },
      { id: 1208, name: 'Sezonluk İş', slug: 'sezonluk-is' },
      { id: 1209, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 13,
    name: 'Ücretsiz Gel Al',
    icon: '🎁',
    slug: 'ucretsiz-gel-al',
    subcategories: [
      { id: 1301, name: 'Mobilya', slug: 'mobilya' },
      { id: 1302, name: 'Elektronik', slug: 'elektronik' },
      { id: 1303, name: 'Giyim', slug: 'giyim' },
      { id: 1304, name: 'Kitap', slug: 'kitap' },
      { id: 1305, name: 'Ev Eşyası', slug: 'ev-esyasi' },
      { id: 1306, name: 'Oyuncak', slug: 'oyuncak' },
      { id: 1307, name: 'Bahçe', slug: 'bahce' },
      { id: 1308, name: 'Diğer', slug: 'diger' },
    ],
  },
  {
    id: 14,
    name: 'Diğer',
    icon: '📦',
    slug: 'diger',
    subcategories: [
      { id: 1401, name: 'Diğer', slug: 'diger' },
    ],
  },
];

// Örnek veriler
const featuredListings: Listing[] = [
  // Elektronik - Telefon
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256GB',
    price: '45.000',
    location: 'Konak, İzmir',
    category: 'Elektronik',
    subcategory: 'Telefon',
    description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
    images: [
      'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+1&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+2&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=iPhone+14+Pro+Max+3&font=roboto'
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
  // Spor - Fitness
  {
    id: 2,
    title: 'Profesyonel Fitness Ekipmanları Seti',
    price: '25.000',
    location: 'Karşıyaka, İzmir',
    category: 'Spor',
    subcategory: 'Fitness',
    description: 'Tam donanımlı fitness ekipmanları seti. Dumbbell seti, bench press, squat rack ve ağırlık plakaları dahil.',
    images: [
      'https://placehold.co/800x600/1e293b/ffffff?text=Fitness+Set+1&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=Fitness+Set+2&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=Fitness+Set+3&font=roboto'
    ],
    date: '2024-03-19',
    condition: 'İkinci El',
    type: listingTypes.PREMIUM,
    status: listingStatus.ACTIVE,
    showPhone: true,
    isFavorite: false,
    views: 180,
    favorites: 8,
    seller: {
      name: 'Mehmet Demir',
      rating: 4.5,
      memberSince: '2023-03-10',
      phone: '0533 456 7890',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-19',
      isHighlighted: false,
      isFeatured: false,
      isUrgent: true,
    },
  },
  // Ev & Yaşam - Mobilya
  {
    id: 3,
    title: 'Modern L Koltuk Takımı',
    price: '12.000',
    location: 'Bornova, İzmir',
    category: 'Ev & Yaşam',
    subcategory: 'Mobilya',
    description: 'Yeni, kullanılmamış L koltuk takımı. Gri renk, modern tasarım. Faturalı ve garantili.',
    images: [
      'https://placehold.co/800x600/1e293b/ffffff?text=L+Koltuk+1&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=L+Koltuk+2&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=L+Koltuk+3&font=roboto'
    ],
    date: '2024-03-18',
    condition: 'Yeni',
    type: listingTypes.PREMIUM,
    status: listingStatus.ACTIVE,
    showPhone: true,
    isFavorite: false,
    views: 320,
    favorites: 15,
    seller: {
      name: 'Ayşe Kaya',
      rating: 4.9,
      memberSince: '2023-02-01',
      phone: '0535 789 1234',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: '2024-04-18',
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  // Hizmetler - Özel Ders
  {
    id: 4,
    title: 'Özel Matematik Dersi',
    price: '300',
    location: 'Çankaya, Ankara',
    category: 'Hizmetler',
    subcategory: 'Özel Ders',
    description: 'Üniversite öğrencilerine özel matematik dersi. Calculus, lineer cebir ve diferansiyel denklemler konularında uzman.',
    images: [
      'https://placehold.co/800x600/1e293b/ffffff?text=Matematik+Dersi+1&font=roboto',
      'https://placehold.co/800x600/1e293b/ffffff?text=Matematik+Dersi+2&font=roboto'
    ],
    date: '2024-03-17',
    condition: 'Hizmet',
    type: listingTypes.FREE,
    status: listingStatus.ACTIVE,
    showPhone: true,
    isFavorite: false,
    views: 150,
    favorites: 5,
    seller: {
      name: 'Dr. Ali Yıldız',
      rating: 5.0,
      memberSince: '2023-01-01',
      phone: '0536 123 4567',
      isVerified: true,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: null,
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  }
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/listing/${listing.id}`}>
                <div className="relative aspect-[4/3]">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Görsel yok</span>
                    </div>
                  )}
                  {listing.condition === 'Yeni' && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                      Yeni
                    </span>
                  )}
                  {listing.premiumFeatures?.isActive && (
                    <span className="absolute top-2 left-2 bg-alo-orange text-white px-2 py-1 rounded-full text-xs">
                      Premium
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
            </div>
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