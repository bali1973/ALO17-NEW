'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { Search, Filter, MapPin, Sparkles, Star, Clock, TrendingUp } from 'lucide-react';
import { useCategories } from '@/lib/useCategories';

// İlan tipi
interface Ilan {
  id: string;
  title: string;
  price: number | string;
  location: string;
  imageUrl?: string;
  images?: string;
  category: string;
  subcategory?: string;
  isPremium?: boolean;
  premiumFeatures?: string[];
  views?: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  condition?: string;
  brand?: string;
  model?: string;
  year?: number;
}

export default function IlanlarPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [ilanlar, setIlanlar] = useState<Ilan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => {
        if (!res.ok) throw new Error('API Hatası');
        return res.json();
      })
      .then(data => {
        // Only show active listings to regular users
        const activeListings = data.filter((listing: any) => listing.status === 'active');
        setIlanlar(activeListings);
        setLoading(false);
      })
      .catch(e => {
        setError('İlanlar yüklenemedi.');
        setLoading(false);
      });
  }, []);

  // Filtreleme ve sıralama
  const filteredAndSortedIlanlar = ilanlar
    .filter((ilan: Ilan) => {
      if (showPremiumOnly && !ilan.isPremium) return false;
      if (selectedCategory && ilan.category !== selectedCategory) return false;
      if (searchQuery && !ilan.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a: Ilan, b: Ilan) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return parseInt(b.price as string) - parseInt(a.price as string);
        case 'price-high':
          return parseInt(a.price as string) - parseInt(b.price as string);
        case 'premium-first':
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return <div className="text-center py-12">İlanlar yükleniyor...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

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
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İlan ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent h-12"
              />
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Kategori</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="border rounded px-3 py-2 w-full min-w-[150px] h-12"
                disabled={categoriesLoading}
              >
                <option value="">Tümü</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-alo-orange focus:border-transparent w-full min-w-[150px] h-12"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
                <option value="premium-first">Premium Önce</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 h-12">
                <Filter className="w-5 h-5" />
                <span>Filtreler</span>
              </button>
            </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredAndSortedIlanlar.map((ilan) => (
          <div
            key={ilan.id}
            onClick={() => handleIlanClick(parseInt(ilan.id))}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col h-full ${
              ilan.isPremium ? 'ring-2 ring-yellow-200 hover:ring-yellow-300' : ''
            } ${ilan.isUrgent ? 'border-l-4 border-red-500' : ''}`}
          >
            <div className="relative h-48">
              <img
                src={ilan.imageUrl || ilan.images?.[0]}
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
                {parseInt(ilan.price as string).toLocaleString('tr-TR')} ₺
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
              {ilan.premiumFeatures && ilan.premiumFeatures.length > 0 && (
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