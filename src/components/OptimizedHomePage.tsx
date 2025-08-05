'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Heart, Eye, Search, Filter } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { Sidebar } from '@/components/Sidebar';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { Category } from '@/lib/types';
import { 
  useMemoryEfficientList, 
  useImagePreloader, 
  useIntersectionObserver,
  useCache,
  usePerformanceMonitor,
  debounce,
  throttle
} from '@/lib/performance-optimizations';
import { OptimizedImage } from '@/components/optimized-image';

interface Listing {
  id: string | number;
  title: string;
  price: string | number;
  location: string;
  city: string;
  description: string;
  category: string;
  subcategory: string;
  isPremium: boolean;
  imageUrl?: string;
  images?: string[] | string;
  createdAt: string;
  views: number;
  condition: string;
  status: "active" | "pending" | "sold" | "expired" | "approved" | undefined;
  premium?: boolean;
  premiumFeatures?: string[];
}

// Renk paleti
const colors = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-red-500 to-red-600',
  'from-yellow-500 to-yellow-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
];

function getColor(slug: string, index: number) {
  const hash = slug.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return colors[Math.abs(hash) % colors.length];
}

function renderIcon(iconData: string | null, slug: string, index: number) {
  if (iconData) {
    try {
      const icon = JSON.parse(iconData);
      return (
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColor(slug, index)} flex items-center justify-center text-white text-xl font-bold`}>
          {icon.emoji || '📦'}
        </div>
      );
    } catch {
      return (
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColor(slug, index)} flex items-center justify-center text-white text-xl font-bold`}>
          📦
        </div>
      );
    }
  }
  
  return (
    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getColor(slug, index)} flex items-center justify-center text-white text-xl font-bold`}>
      📦
    </div>
  );
}

export default function OptimizedHomePage() {
  const { session } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('premium');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor('OptimizedHomePage');
  
  // Cache for listings and categories
  const { data: cachedListings, setCachedData: setCachedListings } = useCache<Listing[]>('home_listings', []);
  const { data: cachedCategories, setCachedData: setCachedCategories } = useCache<Category[]>('home_categories', []);
  
  // Memory efficient list management
  const itemsPerPage = 12;
  const { visibleItems, loadMore, hasMore, currentPage: listPage, totalItems } = useMemoryEfficientList(
    listings,
    100,
    itemsPerPage
  );
  
  // Image preloading for visible items
  const imageUrls = useMemo(() => 
    visibleItems
      .map(item => item.imageUrl || item.images)
      .filter(Boolean)
      .flat()
      .slice(0, 20), // Preload first 20 images
    [visibleItems]
  );
  
  const { preloadImages, isImageLoaded } = useImagePreloader(imageUrls);
  
  // Intersection observer for infinite scroll
  const { elementRef: loadMoreRef, hasIntersected } = useIntersectionObserver({
    rootMargin: '100px',
    threshold: 0.1
  });

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Throttled scroll handler
  const throttledScrollHandler = useMemo(
    () => throttle(() => {
      if (hasIntersected && hasMore && !loading) {
        loadMore();
      }
    }, 100),
    [hasIntersected, hasMore, loading, loadMore]
  );

  // Fetch listings with performance monitoring
  const fetchListings = useCallback(async () => {
    performanceMetrics.startTimer?.();
    
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      setListings(data);
      setCachedListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      performanceMetrics.endTimer?.();
      setLoading(false);
    }
  }, [setCachedListings, performanceMetrics]);

  // Fetch categories with caching
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
      setCachedCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [setCachedCategories]);

  // Initialize data
  useEffect(() => {
    // Use cached data if available
    if (cachedListings.length > 0) {
      setListings(cachedListings);
      setLoading(false);
    } else {
      fetchListings();
    }
    
    if (cachedCategories.length > 0) {
      setCategories(cachedCategories);
    } else {
      fetchCategories();
    }
  }, [cachedListings, cachedCategories, fetchListings, fetchCategories]);

  // Preload images when visible items change
  useEffect(() => {
    if (imageUrls.length > 0) {
      preloadImages();
    }
  }, [imageUrls, preloadImages]);

  // Handle infinite scroll
  useEffect(() => {
    if (hasIntersected && hasMore && !loading) {
      throttledScrollHandler();
    }
  }, [hasIntersected, hasMore, loading, throttledScrollHandler]);

  // Optimized favorite toggle
  const handleToggleFavorite = useCallback((listingId: string | number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  }, []);

  // Filtered and sorted listings
  const filteredListings = useMemo(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(item => item.subcategory === selectedSubcategory);
    }

    // Price filter
    if (priceRange.min || priceRange.max) {
      filtered = filtered.filter(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'premium':
          return (b.premium ? 1 : 0) - (a.premium ? 1 : 0);
        case 'price-low':
          return (typeof a.price === 'string' ? parseFloat(a.price) : a.price) - 
                 (typeof b.price === 'string' ? parseFloat(b.price) : b.price);
        case 'price-high':
          return (typeof b.price === 'string' ? parseFloat(b.price) : b.price) - 
                 (typeof a.price === 'string' ? parseFloat(a.price) : a.price);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [listings, searchQuery, selectedCategory, selectedSubcategory, priceRange, sortBy]);

  // Use filtered listings for memory efficient list
  const { visibleItems, loadMore, hasMore } = useMemoryEfficientList(
    filteredListings,
    100,
    itemsPerPage
  );

  // Memoized listing card component
  const ListingCard = useCallback(({ item }: { item: Listing }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <OptimizedImage
          src={item.imageUrl || (Array.isArray(item.images) ? item.images[0] : item.images) || '/images/placeholder.jpg'}
          alt={item.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          priority={false}
          quality={75}
        />
        {item.premium && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            PREMIUM
          </div>
        )}
        <button
          onClick={() => handleToggleFavorite(item.id)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            favorites.has(item.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
          }`}
        >
          <Heart size={16} fill={favorites.has(item.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-green-600">
            ₺{typeof item.price === 'string' ? parseFloat(item.price).toLocaleString() : item.price.toLocaleString()}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Eye size={14} className="mr-1" />
            {item.views}
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-2">{item.location}</p>
        <p className="text-gray-500 text-xs">{item.condition}</p>
      </div>
    </div>
  ), [favorites, handleToggleFavorite]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hoş geldiniz{session?.user?.name ? `, ${session.user.name}` : ''}!
          </h1>
          <p className="text-gray-600">En iyi fırsatları keşfedin</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Ne arıyorsunuz?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              Filtreler
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="premium">Premium Önce</option>
                  <option value="date">En Yeni</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Min Fiyat"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                
                <input
                  type="number"
                  placeholder="Max Fiyat"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category, index) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-center"
              >
                {renderIcon(category.icon, category.slug, index)}
                <h3 className="mt-2 font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.listingsCount || 0} ilan</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              İlanlar ({filteredListings.length})
            </h2>
            {loading && <div className="text-gray-500">Yükleniyor...</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleItems.map((item) => (
              <Link key={item.id} href={`/ilan/${item.id}`}>
                <ListingCard item={item} />
              </Link>
            ))}
          </div>

          {/* Load More Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="flex justify-center mt-8">
              <div className="animate-pulse">Daha fazla yükleniyor...</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
        
        {/* Recently Viewed */}
        <RecentlyViewed />
      </div>
    </div>
  );
} 