'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ListingsDisplay from '@/components/ListingsDisplay';
import AdvancedSearch from '@/components/AdvancedSearch';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';

import { Search, Filter, MapPin, Calendar, Eye, Heart } from 'lucide-react';

interface SearchFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  condition?: string;
  sortBy?: string;
  premium?: boolean;
  dateRange?: string;
}

interface SearchSuggestion {
  listings: any[];
  categories: any[];
  history: string[];
}

export default function SearchPage() {
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autocompleteResults, setAutocompleteResults] = useState<SearchSuggestion>({ listings: [], categories: [], history: [] });
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const location = searchParams.get('location') || '';
  const condition = searchParams.get('condition') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const premium = searchParams.get('premium') === 'true';
  const dateRange = searchParams.get('dateRange') || '';

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, category, subcategory, priceMin, priceMax, location, condition, sortBy, premium, dateRange]);

  useEffect(() => {
    // Aktif filtreleri güncelle
    const filters: SearchFilters = {};
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (priceMin) filters.priceMin = Number(priceMin);
    if (priceMax) filters.priceMax = Number(priceMax);
    if (location) filters.location = location;
    if (condition) filters.condition = condition;
    if (sortBy) filters.sortBy = sortBy;
    if (premium) filters.premium = premium;
    if (dateRange) filters.dateRange = dateRange;
    
    setActiveFilters(filters);
  }, [category, subcategory, priceMin, priceMax, location, condition, sortBy, premium, dateRange]);

  // Autocomplete için debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchAutocomplete(searchQuery);
      } else {
        setShowAutocomplete(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAutocomplete = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`);
      if (response.ok) {
        const data = await response.json();
        setAutocompleteResults(data);
        setShowAutocomplete(true);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: any = {};
      if (category) filters.category = category;
      if (subcategory) filters.subcategory = subcategory;
      if (priceMin) filters.priceMin = Number(priceMin);
      if (priceMax) filters.priceMax = Number(priceMax);
      if (location) filters.location = location;
      if (condition) filters.condition = condition;
      if (sortBy) filters.sortBy = sortBy;
      if (premium) filters.premium = premium;
      if (dateRange) filters.dateRange = dateRange;

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          filters
        }),
      });

      if (!response.ok) {
        throw new Error('Arama sırasında bir hata oluştu');
      }

      const data = await response.json();
      setListings(data.listings || []);
      setCategories(data.categories || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Arama sırasında bir hata oluştu');
      setListings([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      
      // Mevcut filtreleri koru
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, value.toString());
        }
      });
      
      router.push(`/arama?${params.toString()}`);
      setShowAutocomplete(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    const params = new URLSearchParams();
    params.set('q', suggestion);
    
    // Mevcut filtreleri koru
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
    
    router.push(`/arama?${params.toString()}`);
    setShowAutocomplete(false);
  };

  const removeFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    
    // URL'yi güncelle
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, v.toString());
      }
    });
    
    router.push(`/arama?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    router.push(`/arama?${params.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const getFilterLabel = (key: string, value: any): string => {
    switch (key) {
      case 'category':
        return `Kategori: ${value}`;
      case 'subcategory':
        return `Alt Kategori: ${value}`;
      case 'priceMin':
        return `Min Fiyat: ${formatPrice(value)} ₺`;
      case 'priceMax':
        return `Max Fiyat: ${formatPrice(value)} ₺`;
      case 'location':
        return `Konum: ${value}`;
      case 'condition':
        return `Durum: ${value === 'new' ? 'Yeni' : value === 'used' ? 'Kullanılmış' : 'Yenilenmiş'}`;
      case 'sortBy':
        const sortLabels: Record<string, string> = {
          'newest': 'En Yeni',
          'oldest': 'En Eski',
          'price_low': 'Fiyat (Düşük-Yüksek)',
          'price_high': 'Fiyat (Yüksek-Düşük)',
          'popular': 'Popüler',
          'premium': 'Premium',
          'relevance': 'İlgi Düzeyi'
        };
        return `Sıralama: ${sortLabels[value] || value}`;
      case 'premium':
        return 'Premium İlanlar';
      case 'dateRange':
        const dateLabels: Record<string, string> = {
          'today': 'Bugün',
          'week': 'Bu Hafta',
          'month': 'Bu Ay'
        };
        return `Tarih: ${dateLabels[value] || value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Arama Sonuçları
          </h1>
          
          {/* Search Bar */}
          <div className="mb-6 relative" ref={autocompleteRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ne arıyorsunuz?"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onFocus={() => {
                    if (searchQuery.length >= 2) {
                      setShowAutocomplete(true);
                    }
                  }}
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Ara
                </button>
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                {/* Arama Geçmişi */}
                {autocompleteResults.history.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <ClockIcon className="h-4 w-4" />
                      Son Aramalar
                    </div>
                    {autocompleteResults.history.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(term)}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                )}

                {/* Kategori Önerileri */}
                {autocompleteResults.categories.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <SparklesIcon className="h-4 w-4" />
                      Kategoriler
                    </div>
                    {autocompleteResults.categories.map((category) => (
                      <a
                        key={category.id}
                        href={`/kategori/${category.slug}`}
                        className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {category.icon && <span>{category.icon}</span>}
                        {category.name}
                      </a>
                    ))}
                  </div>
                )}

                {/* İlan Önerileri */}
                {autocompleteResults.listings.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <SparklesIcon className="h-4 w-4" />
                      İlanlar
                    </div>
                    {autocompleteResults.listings.map((listing) => (
                      <a
                        key={listing.id}
                        href={`/ilan/${listing.id}`}
                        className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {listing.images && (
                          <img
                            src={JSON.parse(listing.images)[0] || '/images/placeholder.svg'}
                            alt={listing.title}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{listing.title}</div>
                          <div className="text-xs text-gray-500">{listing.category}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">
                          {formatPrice(listing.price)} ₺
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Aktif Filtreler:</span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {getFilterLabel(key, value)}
                  <button
                    onClick={() => removeFilter(key as keyof SearchFilters)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Tümünü Temizle
              </button>
            </div>
          )}

          {/* Results Summary */}
          {!loading && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-semibold">{listings.length}</span> ilan bulundu
                {query && (
                  <span> "{query}" için</span>
                )}
              </p>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4" />
                Filtreler
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
            <AdvancedSearch />
          </div>
        )}

        {/* Search Suggestions */}
        {suggestions.length > 0 && !loading && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Önerilen Aramalar:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Results */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategoriler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="text-center">
                    {category.icon && (
                      <div className="text-2xl mb-2">{category.icon}</div>
                    )}
                    <h3 className="font-medium text-gray-900 text-sm">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Listings Results */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">İlanlar</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Aranıyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 text-lg font-medium mb-2">Hata Oluştu</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={performSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tekrar Dene
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                "{query}" için arama sonucu bulunamadı. Farklı anahtar kelimeler deneyin.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Öneriler:</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Farklı anahtar kelimeler kullanın</li>
                  <li>• Daha genel terimler deneyin</li>
                  <li>• Filtreleri temizleyin</li>
                  <li>• Yazım hatalarını kontrol edin</li>
                </ul>
              </div>
            </div>
          ) : (
            <ListingsDisplay
              listings={listings}
              loading={false}
              error={null}
              showPagination={false}
            />
          )}
        </div>
      </div>
    </div>
  );
} 
