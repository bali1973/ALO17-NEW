'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Search, Filter, MapPin, Sparkles, Star, Clock, TrendingUp } from 'lucide-react';

export default function IlanlarPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Örnek ilan verileri - premium özelliklerle
  const ilanlar = [
    {
      id: 1,
      title: 'Sahibinden Satılık Lüks Daire',
      price: '2.500.000',
      location: 'Çanakkale',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'emlak',
      createdAt: '2024-03-20',
      isPremium: true,
      premiumFeatures: ['featured', 'urgent', 'highlighted'],
      views: 245,
      isUrgent: true,
      isFeatured: true
    },
    {
      id: 2,
      title: '2019 Model BMW 320i - Temiz',
      price: '850.000',
      location: 'İstanbul',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'arac',
      createdAt: '2024-03-19',
      isPremium: false,
      premiumFeatures: [],
      views: 89,
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 3,
      title: 'iPhone 14 Pro Max - Yeni Gibi',
      price: '45.000',
      location: 'Ankara',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'elektronik',
      createdAt: '2024-03-18',
      isPremium: true,
      premiumFeatures: ['featured', 'highlighted'],
      views: 156,
      isUrgent: false,
      isFeatured: true
    },
    {
      id: 4,
      title: 'Villa Kiralık - Deniz Manzaralı',
      price: '15.000',
      location: 'İzmir',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'emlak',
      createdAt: '2024-03-17',
      isPremium: true,
      premiumFeatures: ['urgent', 'top'],
      views: 312,
      isUrgent: true,
      isFeatured: false
    },
    {
      id: 5,
      title: 'MacBook Pro M2 - 16GB RAM',
      price: '65.000',
      location: 'Bursa',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'elektronik',
      createdAt: '2024-03-16',
      isPremium: false,
      premiumFeatures: [],
      views: 67,
      isUrgent: false,
      isFeatured: false
    },
    {
      id: 6,
      title: 'Audi A4 2.0 TDI - 2020 Model',
      price: '1.200.000',
      location: 'Antalya',
      image: '/images/listings/iphone-14-pro-max-1.jpg',
      category: 'arac',
      createdAt: '2024-03-15',
      isPremium: true,
      premiumFeatures: ['featured', 'urgent', 'top'],
      views: 423,
      isUrgent: true,
      isFeatured: true
    }
  ];

  const categories = [
    { id: 'arac', name: 'Araç' },
    { id: 'emlak', name: 'Emlak' },
    { id: 'elektronik', name: 'Elektronik' },
    { id: 'diger', name: 'Diğer' }
  ];

  // Filtreleme ve sıralama
  const filteredAndSortedIlanlar = ilanlar
    .filter(ilan => {
      if (showPremiumOnly && !ilan.isPremium) return false;
      if (selectedCategory && ilan.category !== selectedCategory) return false;
      if (searchQuery && !ilan.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''));
        case 'price-high':
          return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const handleIlanClick = (ilanId: number) => {
    router.push(`/ilan/${ilanId}`);
  };

  const handleNewIlan = () => {
    if (!session) {
      router.push('/giris?callbackUrl=/ilan-ver');
      return;
    }
    router.push('/ilan-ver');
  };

  const getPremiumFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'featured':
        return <Star className="w-3 h-3 text-yellow-500" />;
      case 'urgent':
        return <Clock className="w-3 h-3 text-red-500" />;
      case 'highlighted':
        return <Sparkles className="w-3 h-3 text-blue-500" />;
      case 'top':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getPremiumFeatureText = (feature: string) => {
    switch (feature) {
      case 'featured':
        return 'Öne Çıkan';
      case 'urgent':
        return 'Acil';
      case 'highlighted':
        return 'Vurgulanmış';
      case 'top':
        return 'Üst Sıralarda';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">İlanlar</h1>
        <button
          onClick={handleNewIlan}
          className="bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Yeni İlan Ver
        </button>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İlan ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
              <option value="premium-first">Premium Önce</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              <span>Filtreler</span>
            </button>
          </div>
        </div>

        {/* Premium Filtresi */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={(e) => setShowPremiumOnly(e.target.checked)}
              className="rounded border-gray-300 text-alo-orange focus:ring-alo-orange"
            />
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Sadece Premium İlanları Göster</span>
          </label>
        </div>
      </div>

      {/* Sonuç Sayısı */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredAndSortedIlanlar.length} ilan bulundu
          {showPremiumOnly && (
            <span className="ml-2 text-yellow-600 font-medium">
              (Premium ilanlar)
            </span>
          )}
        </p>
      </div>

      {/* İlan Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedIlanlar.map((ilan) => (
          <div
            key={ilan.id}
            onClick={() => handleIlanClick(ilan.id)}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 ${
              ilan.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
            } ${ilan.isUrgent ? 'border-l-4 border-red-500' : ''}`}
          >
            <div className="relative h-48">
              <img
                src={ilan.image}
                alt={ilan.title}
                className="w-full h-full object-cover"
              />
              
              {/* Premium Rozetleri */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {ilan.isPremium && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
                {ilan.isUrgent && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Acil
                  </span>
                )}
                {ilan.isFeatured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Öne Çıkan
                  </span>
                )}
              </div>

              {/* Görüntülenme Sayısı */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                {ilan.views} görüntülenme
              </div>
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{ilan.title}</h2>
              <p className="text-2xl font-bold text-alo-orange mb-2">
                {parseInt(ilan.price).toLocaleString('tr-TR')} ₺
              </p>
              
              <div className="flex items-center justify-between text-gray-500 mb-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{ilan.location}</span>
                </div>
                <span className="text-xs">
                  {new Date(ilan.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>

              {/* Premium Özellikler */}
              {ilan.premiumFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {ilan.premiumFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {getPremiumFeatureIcon(feature)}
                      <span className="ml-1">{getPremiumFeatureText(feature)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sonuç Bulunamadı */}
      {filteredAndSortedIlanlar.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            İlan Bulunamadı
          </h3>
          <p className="text-gray-600 mb-4">
            Seçtiğiniz kriterlere uygun ilan bulunamadı.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setShowPremiumOnly(false);
              setSortBy('newest');
            }}
            className="bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
} 