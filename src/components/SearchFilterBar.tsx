import React, { useState, useEffect } from 'react';
import { useCategories } from '@/lib/useCategories';
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';

interface SearchFilterBarProps {
  value?: string;
  onSearch?: (query: string) => void;
  filters?: {
    category?: string;
    subcategory?: string;
    priceMin?: string;
    priceMax?: string;
    location?: string;
    premium?: boolean;
    sortBy?: string;
  };
  onFiltersChange?: (filters: any) => void;
  showPremium?: boolean;
  showSort?: boolean;
  showLocation?: boolean;
  showPrice?: boolean;
  showCategory?: boolean;
  showSubcategory?: boolean;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  value = '',
  onSearch,
  filters = {},
  onFiltersChange,
  showPremium = true,
  showSort = true,
  showLocation = true,
  showPrice = true,
  showCategory = true,
  showSubcategory = true,
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [search, setSearch] = useState(value);
  const [localFilters, setLocalFilters] = useState(filters);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (localFilters.category) {
      const cat = categories.find(c => c.slug === localFilters.category);
      setSubcategories(cat?.subCategories || []);
    } else {
      setSubcategories([]);
    }
  }, [localFilters.category, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    if (onFiltersChange) onFiltersChange(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center w-full">
      {/* Arama kutusu */}
      <div className="relative flex-1 w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Ürün, hizmet veya ilan ara..."
          value={search}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {/* Kategori */}
      {showCategory && (
        <select
          value={localFilters.category || ''}
          onChange={e => handleFilterChange('category', e.target.value)}
          className="min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={categoriesLoading}
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      )}
      {/* Alt Kategori */}
      {showSubcategory && subcategories.length > 0 && (
        <select
          value={localFilters.subcategory || ''}
          onChange={e => handleFilterChange('subcategory', e.target.value)}
          className="min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Tüm Alt Kategoriler</option>
          {subcategories.map((sub: any) => (
            <option key={sub.slug} value={sub.slug}>{sub.name}</option>
          ))}
        </select>
      )}
      {/* Fiyat aralığı */}
      {showPrice && (
        <div className="flex items-center gap-1">
          <input
            type="number"
            placeholder="Min ₺"
            value={localFilters.priceMin || ''}
            onChange={e => handleFilterChange('priceMin', e.target.value)}
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={0}
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max ₺"
            value={localFilters.priceMax || ''}
            onChange={e => handleFilterChange('priceMax', e.target.value)}
            className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={0}
          />
        </div>
      )}
      {/* Konum */}
      {showLocation && (
        <div className="relative">
          <MapPinIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Konum"
            value={localFilters.location || ''}
            onChange={e => handleFilterChange('location', e.target.value)}
            className="pl-8 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
          />
        </div>
      )}
      {/* Premium */}
      {showPremium && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!localFilters.premium}
            onChange={e => handleFilterChange('premium', e.target.checked)}
            className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
          />
          <StarIcon className="w-4 h-4 text-yellow-500" />
          <span className="text-xs text-gray-700">Sadece Premium</span>
        </label>
      )}
      {/* Sıralama */}
      {showSort && (
        <select
          value={localFilters.sortBy || 'newest'}
          onChange={e => handleFilterChange('sortBy', e.target.value)}
          className="min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
          <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
          <option value="premium-first">Premium Önce</option>
        </select>
      )}
    </div>
  );
}; 