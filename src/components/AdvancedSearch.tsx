'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  FunnelIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { FunnelIcon as FunnelIconSolid } from '@heroicons/react/24/solid';
import OptimizedImage from './OptimizedImage';

interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  condition?: 'new' | 'used' | 'refurbished';
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular' | 'premium';
  premium?: boolean;
  dateRange?: 'today' | 'week' | 'month' | 'all';
}

interface SearchResult {
  id: string | number;
  title: string;
  price: number;
  image?: string;
  location: string;
  category: string;
  subcategory?: string;
  condition: string;
  createdAt: string;
  views: number;
  premium: boolean;
  type: 'listing' | 'category';
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

export default function AdvancedSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches] = useState([
    'iPhone', 'Araba', 'Ev', 'Bilgisayar', 'Telefon', 'Tablet', 'Laptop'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Kategorileri yükle
  useEffect(() => {
    loadCategories();
    loadSearchHistory();
  }, []);

  // Arama yap
  useEffect(() => {
    if (!query.trim() && Object.keys(filters).length === 0) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, filters]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const loadSubcategories = async (categorySlug: string) => {
    try {
      const response = await fetch(`/api/categories/${categorySlug}/subcategories`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Alt kategoriler yüklenemedi:', error);
    }
  };

  const loadSearchHistory = () => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  };

  const saveSearchHistory = (searchTerm: string) => {
    if (typeof window !== 'undefined') {
      const history = searchHistory.filter(item => item !== searchTerm);
      const newHistory = [searchTerm, ...history].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('search_history', JSON.stringify(newHistory));
    }
  };

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (query.trim()) {
        params.append('search', query.trim());
      }
      
      if (filters.category) params.append('category', filters.category);
      if (filters.subcategory) params.append('subcategory', filters.subcategory);
      if (filters.priceMin) params.append('priceMin', filters.priceMin.toString());
      if (filters.priceMax) params.append('priceMax', filters.priceMax.toString());
      if (filters.location) params.append('location', filters.location);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.premium) params.append('premium', 'true');
      if (filters.dateRange) params.append('dateRange', filters.dateRange);

      const response = await fetch(`/api/listings?${params.toString()}`);
      const data = await response.json();
      
      setResults(data.listings || []);
    } catch (error) {
      console.error('Arama hatası:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setFilters(prev => ({ ...prev, category: categorySlug, subcategory: undefined }));
    if (categorySlug) {
      loadSubcategories(categorySlug);
    } else {
      setSubcategories([]);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSubcategories([]);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'listing') {
      router.push(`/ilan/${result.id}`);
    } else {
      router.push(`/kategori/${result.category}`);
    }
    
    if (query.trim()) {
      saveSearchHistory(query.trim());
    }
    
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleSearchSubmit = () => {
    if (query.trim() || Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      
      if (query.trim()) {
        params.append('q', query.trim());
        saveSearchHistory(query.trim());
      }
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      router.push(`/arama?${params.toString()}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Bugün';
    if (diffDays === 2) return 'Dün';
    if (diffDays <= 7) return `${diffDays - 1} gün önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 ml-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Ne arıyorsunuz?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 mr-1 rounded-md transition-colors ${
              showFilters || Object.keys(filters).length > 0
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {showFilters || Object.keys(filters).length > 0 ? (
              <FunnelIconSolid className="h-5 w-5" />
            ) : (
              <FunnelIcon className="h-5 w-5" />
            )}
          </button>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Kategori
              </label>
              <select
                value={filters.subcategory || ''}
                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!filters.category}
              >
                <option value="">Tüm Alt Kategoriler</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.slug}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konum
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Şehir veya ilçe"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fiyat Aralığı
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <CurrencyDollarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-gray-400 self-center">-</span>
                <div className="relative flex-1">
                  <CurrencyDollarIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax || ''}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                value={filters.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tümü</option>
                <option value="new">Yeni</option>
                <option value="used">Kullanılmış</option>
                <option value="refurbished">Yenilenmiş</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sıralama
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Varsayılan</option>
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="price_low">Fiyat (Düşük-Yüksek)</option>
                <option value="price_high">Fiyat (Yüksek-Düşük)</option>
                <option value="popular">Popüler</option>
                <option value="premium">Premium Öncelik</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Filtreleri Temizle
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Kapat
              </button>
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Aranıyor...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                    {result.image ? (
                      <OptimizedImage
                        src={result.image}
                        alt={result.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <TagIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="font-semibold text-green-600">
                        {formatPrice(result.price)} ₺
                      </span>
                      <span className="mx-1">•</span>
                      <span>{result.location}</span>
                      {result.premium && (
                        <>
                          <span className="mx-1">•</span>
                          <StarIcon className="h-3 w-3 text-yellow-500" />
                          <span className="text-yellow-600">Premium</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-500">
              <p>Sonuç bulunamadı</p>
            </div>
          ) : (
            <div className="p-4">
              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Son Aramalar</h3>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 5).map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Popüler Aramalar</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 