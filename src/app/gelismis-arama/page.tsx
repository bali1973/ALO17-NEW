'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Star, 
  X, 
  SlidersHorizontal,
  Heart,
  Eye,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCategories } from '@/lib/useCategories';


interface SearchFilters {
  query: string;
  category: string;
  subcategory: string;
  location: string;
  priceMin: string;
  priceMax: string;
  condition: string;
  sortBy: string;
  dateRange: string;
  premium: boolean;
  featured: boolean;
  urgent: boolean;
  withImages: boolean;
  verified: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  category: string;
  subcategory: string;
  condition: string;
  createdAt: string;
  isPremium: boolean;
  isFeatured: boolean;
  isUrgent: boolean;
  hasImages: boolean;
  isVerified: boolean;
  viewCount: number;
  favoriteCount: number;
}

const CONDITION_OPTIONS = [
  { value: '', label: 'Tümü' },
  { value: 'new', label: 'Yeni' },
  { value: 'like_new', label: 'Az Kullanılmış' },
  { value: 'good', label: 'İyi' },
  { value: 'fair', label: 'Orta' },
  { value: 'poor', label: 'Kötü' }
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'İlgi Sırası' },
  { value: 'price_low', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price_high', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'date_new', label: 'Tarih (Yeniden Eskiye)' },
  { value: 'date_old', label: 'Tarih (Eskiden Yeniye)' },
  { value: 'popularity', label: 'Popülerlik' },
  { value: 'views', label: 'Görüntülenme' }
];

const DATE_RANGE_OPTIONS = [
  { value: '', label: 'Tüm Tarihler' },
  { value: 'today', label: 'Bugün' },
  { value: 'week', label: 'Son 7 Gün' },
  { value: 'month', label: 'Son 30 Gün' },
  { value: '3months', label: 'Son 3 Ay' }
];

export default function GelismisAramaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, loading: categoriesLoading } = useCategories();
  
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    subcategory: '',
    location: '',
    priceMin: '',
    priceMax: '',
    condition: '',
    sortBy: 'relevance',
    dateRange: '',
    premium: false,
    featured: false,
    urgent: false,
    withImages: false,
    verified: false
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // URL'den filtreleri yükle
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const location = searchParams.get('location') || '';
    const priceMin = searchParams.get('priceMin') || '';
    const priceMax = searchParams.get('priceMax') || '';
    const condition = searchParams.get('condition') || '';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const dateRange = searchParams.get('dateRange') || '';
    const premium = searchParams.get('premium') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const urgent = searchParams.get('urgent') === 'true';
    const withImages = searchParams.get('withImages') === 'true';
    const verified = searchParams.get('verified') === 'true';

    setFilters({
      query,
      category,
      subcategory,
      location,
      priceMin,
      priceMax,
      condition,
      sortBy,
      dateRange,
      premium,
      featured,
      urgent,
      withImages,
      verified
    });

    if (query || category || location) {
      performSearch({
        query,
        category,
        subcategory,
        location,
        priceMin,
        priceMax,
        condition,
        sortBy,
        dateRange,
        premium,
        featured,
        urgent,
        withImages,
        verified
      });
    }
  }, [searchParams]);

  const performSearch = async (searchFilters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/search/advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchFilters),
      });

      if (!response.ok) {
        throw new Error('Arama sırasında bir hata oluştu');
      }

      const data = await response.json();
      setResults(data.results || []);
      setTotalResults(data.total || 0);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Arama sırasında bir hata oluştu');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== false) {
        params.set(key, value.toString());
      }
    });

    router.push(`/gelismis-arama?${params.toString()}`);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      subcategory: '',
      location: '',
      priceMin: '',
      priceMax: '',
      condition: '',
      sortBy: 'relevance',
      dateRange: '',
      premium: false,
      featured: false,
      urgent: false,
      withImages: false,
      verified: false
    });
    router.push('/gelismis-arama');
  };

  const getSubcategories = () => {
    if (!filters.category) return [];
    const category = categories.find(cat => cat.slug === filters.category);
    return category?.subCategories || [];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getConditionLabel = (condition: string) => {
    const option = CONDITION_OPTIONS.find(opt => opt.value === condition);
    return option?.label || condition;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gelişmiş Arama</h1>
          <p className="text-gray-600">
            Detaylı filtrelerle istediğiniz ilanı bulun
          </p>
        </div>

        {/* Ana Arama */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama Kutusu */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => {
                  handleFilterChange('query', e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                placeholder="Ne arıyorsunuz?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Öneriler */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleFilterChange('query', suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Arama Butonu */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Aranıyor...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Ara
                </>
              )}
            </button>

            {/* Filtreler Butonu */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <SlidersHorizontal size={20} />
              Filtreler
            </button>
          </div>
        </div>

        {/* Gelişmiş Filtreler */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => {
                    handleFilterChange('category', e.target.value);
                    handleFilterChange('subcategory', '');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Kategori
                </label>
                <select
                  value={filters.subcategory}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!filters.category}
                >
                  <option value="">Tüm Alt Kategoriler</option>
                  {getSubcategories().map((subcategory) => (
                    <option key={subcategory.slug} value={subcategory.slug}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Konum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Konum
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Şehir, ilçe..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Fiyat Aralığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Fiyat Aralığı
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="Max"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Durum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durum
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {CONDITION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarih Aralığı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Tarih Aralığı
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Özel Filtreler */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Özel Filtreler</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.premium}
                    onChange={(e) => handleFilterChange('premium', e.target.checked)}
                    className="rounded"
                  />
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm">Premium</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="rounded"
                  />
                  <TrendingUp size={16} className="text-blue-500" />
                  <span className="text-sm">Öne Çıkan</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.urgent}
                    onChange={(e) => handleFilterChange('urgent', e.target.checked)}
                    className="rounded"
                  />
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-sm">Acil</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.withImages}
                    onChange={(e) => handleFilterChange('withImages', e.target.checked)}
                    className="rounded"
                  />
                  <Eye size={16} className="text-green-500" />
                  <span className="text-sm">Fotoğraflı</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="rounded"
                  />
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm">Doğrulanmış</span>
                </label>
              </div>
            </div>

            {/* Filtre Butonları */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtreleri Uygula
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}

        {/* Sonuçlar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Sonuç Başlığı */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {loading ? 'Aranıyor...' : `${totalResults} sonuç bulundu`}
            </h2>
            {results.length > 0 && (
              <div className="text-sm text-gray-600">
                {filters.query && `"${filters.query}" için arama sonuçları`}
              </div>
            )}
          </div>

          {/* Hata Mesajı */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">{error}</div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {/* Sonuç Listesi */}
          {!loading && !error && results.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Sonuç bulunamadı</h3>
              <p className="text-gray-500">
                Arama kriterlerinizi değiştirerek tekrar deneyin
              </p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Resim */}
                  <div className="relative h-48 bg-gray-100">
                    {result.images && result.images.length > 0 ? (
                      <img
                        src={result.images[0]}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Eye size={32} />
                      </div>
                    )}
                    
                    {/* Premium Badge */}
                    {result.isPremium && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        <Star size={12} className="inline mr-1" />
                        Premium
                      </div>
                    )}

                    {/* Acil Badge */}
                    {result.isUrgent && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        <AlertCircle size={12} className="inline mr-1" />
                        Acil
                      </div>
                    )}
                  </div>

                  {/* İçerik */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {result.title}
                    </h3>
                    
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      {formatPrice(result.price)}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {result.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(result.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{getConditionLabel(result.condition)}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {result.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={14} />
                          {result.favoriteCount}
                        </span>
                      </div>
                    </div>

                    {/* Butonlar */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => router.push(`/ilan/${result.id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        İncele
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors">
                        <Heart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
