import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useCategories } from '@/lib/useCategories';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  condition: string;
  city: string;
  isPremium: boolean;
  createdAt: Date;
  views: number;
  imageUrl: string;
  score: number;
}

interface SearchFilters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
  city?: string;
  premiumOnly?: boolean;
  sortBy?: string;
}

export const SearchComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useCategories();

  // State
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    city: '',
    premiumOnly: false,
    sortBy: 'date_desc',
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams();
        params.append('q', searchQuery);
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.condition) params.append('condition', filters.condition);
        if (filters.city) params.append('city', encodeURIComponent(filters.city));
        if (filters.premiumOnly) params.append('premiumOnly', 'true');
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();

        if (data.success) {
          setResults(data.results);
        } else {
          console.error('Search failed:', data.error);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [filters]
  );

  // Handle search input change
  const handleSearch = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (query) {
        debouncedSearch(query);
      }
      return newFilters;
    });
  };

  // Clear filters
  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      city: '',
      premiumOnly: false,
      sortBy: 'date_desc',
    };
    setFilters(emptyFilters);
    if (query) {
      debouncedSearch(query);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Search input */}
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Ne aramıştınız?"
          className="w-full px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label="Filtre"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8" role="status" aria-label="Yükleniyor">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-hidden="true"></div>
        </div>
      )}

      {/* Results */}
      <div>
        {!isLoading && results.length === 0 && query && (
          <div className="text-center py-8">
            <p className="text-gray-500">Sonuç bulunamadı</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={result.imageUrl}
                  alt={result.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                <p className="text-gray-600 mb-2">{result.description}</p>
                <p className="text-xl font-bold text-blue-600">
                  {result.price.toLocaleString('tr-TR')} ₺
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Tüm Kategoriler</option>
                {categories?.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price range filters */}
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Fiyat
              </label>
              <input
                type="number"
                id="minPrice"
                min="0"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="Min"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Fiyat
              </label>
              <input
                type="number"
                id="maxPrice"
                min="0"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="Max"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Condition filter */}
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                id="condition"
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Tümü</option>
                <option value="new">Yeni</option>
                <option value="used">İkinci El</option>
              </select>
            </div>

            {/* City filter */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Şehir
              </label>
              <input
                type="text"
                id="city"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Şehir ara..."
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Premium only filter */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="premiumOnly"
                checked={filters.premiumOnly}
                onChange={(e) => handleFilterChange('premiumOnly', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="premiumOnly" className="ml-2 text-sm text-gray-700">
                Sadece Premium İlanlar
              </label>
            </div>
          </div>

          {/* Sort options */}
          <div className="mt-4">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sıralama
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="date_desc">En Yeni</option>
              <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="views_desc">En Çok Görüntülenen</option>
            </select>
          </div>

          {/* Clear filters button */}
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 