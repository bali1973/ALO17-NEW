'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Kategoriler Slider */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-alo-dark mb-6">Popüler Kategoriler</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 8 },
            }}
            className="categories-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  className="group flex flex-col items-center p-4 rounded-lg hover:bg-alo-light transition-colors"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-alo-dark group-hover:text-alo-orange">
                    {category.name}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
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
            <div 
              key={listing.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="h-48 bg-alo-light-blue relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {listing.image && (
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
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
              </div>
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
    </main>
  );
}

// Örnek veriler
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
      { id: 'fotograf', name: 'Fotoğraf & Kamera', slug: 'fotograf' }
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
      { id: 'yukleyici', name: 'Yükleyici', slug: 'yukleyici' }
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
      { id: 'beyaz-esya', name: 'Beyaz Eşya', slug: 'beyaz-esya' }
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
      { id: 'tamir-malzeme', name: 'Tamir Malzemeleri', slug: 'tamir-malzeme' }
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
      { id: 'spor-urunleri', name: 'Spor Ürünleri', slug: 'spor-urunleri' }
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
      { id: 'takı', name: 'Takı', slug: 'taki' },
      { id: 'gozluk', name: 'Gözlük', slug: 'gozluk' },
      { id: 'diger-moda', name: 'Diğer', slug: 'diger-moda' }
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
      { id: 'diger-cocuk', name: 'Diğer', slug: 'diger-cocuk' }
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
      { id: 'diger-ticaret', name: 'Diğer', slug: 'diger-ticaret' }
    ]
  },
  {
    id: 10,
    name: 'İş İlanları',
    slug: 'is-ilanlari',
    icon: '💼',
    subCategories: [
      { id: 'tam-zamanli', name: 'Tam Zamanlı', slug: 'tam-zamanli' },
      { id: 'yarim-zamanli', name: 'Yarı Zamanlı', slug: 'yarim-zamanli' },
      { id: 'freelance', name: 'Freelance', slug: 'freelance' },
      { id: 'staj', name: 'Staj', slug: 'staj' }
    ]
  },
  {
    id: 11,
    name: 'Yedek Parça',
    slug: 'yedek-parca',
    icon: '🔧',
    subCategories: [
      { id: 'otomotiv', name: 'Otomotiv', slug: 'otomotiv' },
      { id: 'elektronik', name: 'Elektronik', slug: 'elektronik' },
      { id: 'makine', name: 'Makine', slug: 'makine' },
      { id: 'aksesuar', name: 'Aksesuar', slug: 'aksesuar' }
    ]
  },
  {
    id: 12,
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
      { id: 'diger-hizmet', name: 'Diğer Hizmetler', slug: 'diger-hizmet' }
    ]
  },
  {
    id: 13,
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

const featuredListings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max',
    price: '45.000',
    location: 'Konak, İzmir',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=iPhone+14+Pro+Max'
  },
  {
    id: 2,
    title: 'MacBook Pro M2',
    price: '65.000',
    location: 'Kadıköy, İstanbul',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=MacBook+Pro+M2'
  },
  {
    id: 3,
    title: 'Samsung 4K Smart TV',
    price: '32.000',
    location: 'Çankaya, Ankara',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Samsung+4K+TV'
  },
  {
    id: 4,
    title: 'Profesyonel Temizlik Hizmeti',
    price: '500',
    location: 'Karşıyaka, İzmir',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Temizlik+Hizmeti'
  },
  {
    id: 5,
    title: 'Özel Matematik Dersi',
    price: '300',
    location: 'Bornova, İzmir',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Matematik+Dersi'
  },
  {
    id: 6,
    title: 'Evden Eve Nakliyat',
    price: '2.500',
    location: 'İzmir',
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Nakliyat+Hizmeti'
  }
];

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