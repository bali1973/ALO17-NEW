'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '@/components/Providers';
import { Sidebar } from '@/components/Sidebar';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { Category } from '@/lib/types';


interface Listing {
  id: string | number
  title: string
  price: string | number
  location: string
  city: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  imageUrl?: string
  images?: string[] | string
  createdAt: string
  views: number
  condition: string
  status: "active" | "pending" | "sold" | "expired" | "approved" | undefined
  premium?: boolean
  premiumFeatures?: string[]
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

export default function Home() {
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
  const itemsPerPage = 12;

  const handleToggleFavorite = (listingId: string | number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        console.log('Fetching listings from API...');
        const response = await fetch('/api/listings/');
        console.log('API Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('API Data:', data);
          console.log('Data type:', typeof data);
          console.log('Is array:', Array.isArray(data));
          console.log('Data length:', data.length);
          
          if (Array.isArray(data)) {
            setListings(data);
            console.log('Listings set successfully:', data.length, 'items');
          } else {
            console.error('API did not return an array');
            setListings([]);
          }
        } else {
          console.error('API response not ok:', response.status);
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories/');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        // Kategoriler yüklenirken hata
      }
    };

    fetchListings();
    fetchCategories();
  }, []);

  const getVisibilityScore = (listing: Listing) => {
    let score = 0;
    if (listing.isPremium || listing.premium) score += 100;
    if (listing.premiumFeatures?.includes('featured')) score += 50;
    if (listing.premiumFeatures?.includes('urgent')) score += 30;
    if (listing.premiumFeatures?.includes('highlighted')) score += 20;
    if (listing.premiumFeatures?.includes('top')) score += 10;
    score += listing.views || 0;
    return score;
  };

  const filteredListings = Array.isArray(listings) ? listings
    .filter((listing: Listing) => 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(listing => !selectedCategory || listing.category === selectedCategory)
    .filter(listing => !selectedSubcategory || listing.subcategory === selectedSubcategory)
    .filter(listing => {
      const price = typeof listing.price === 'number' ? listing.price : parseFloat(String(listing.price));
      const min = priceRange.min ? parseFloat(priceRange.min) : 0;
      const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      return price >= min && price <= max;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-low':
          return (typeof a.price === 'number' ? a.price : parseFloat(String(a.price))) - 
                 (typeof b.price === 'number' ? b.price : parseFloat(String(b.price)));
        case 'price-high':
          return (typeof b.price === 'number' ? b.price : parseFloat(String(b.price))) - 
                 (typeof a.price === 'number' ? a.price : parseFloat(String(a.price)));
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'premium':
          return getVisibilityScore(b) - getVisibilityScore(a);
        default:
          return getVisibilityScore(b) - getVisibilityScore(a); // Varsayılan olarak premium skoruna göre sırala
      }
    }) : [];

  const premiumListings = filteredListings.filter((listing: Listing) => listing.isPremium || listing.premium).slice(0, 3)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentListings = filteredListings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Arama ve Filtreleme Bölümü */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Arama Kutusu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <input
                type="text"
                placeholder="Ne arıyorsunuz?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Kategori Filtresi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories?.map((category: Category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fiyat Aralığı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sıralama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="premium">Öncelikli</option>
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                <option value="views">En Çok Görüntülenen</option>
              </select>
            </div>
          </div>

          {/* Filtreleri Temizle */}
          {(searchQuery || selectedCategory || priceRange.min || priceRange.max || sortBy !== 'premium') && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredListings.length} ilan bulundu
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedSubcategory('');
                  setPriceRange({ min: '', max: '' });
                  setSortBy('premium');
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content: İlanlar */}
          <div className="flex-1">
            {/* Son Baktıkların */}
            {session && <RecentlyViewed allListings={listings} />}
            
            {/* Premium İlanlar */}
            {premiumListings.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-yellow-500 mr-2">⭐</span>
                  Öncelikli İlanlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumListings.slice(0, 3).map((listing: Listing) => (
                    <Link key={listing.id} href={`/ilan/${listing.id}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
                      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                        {listing.images && (Array.isArray(listing.images) ? listing.images.length > 0 : listing.images) ? (
                          <Image
                            src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
                            alt={listing.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="text-gray-400 text-4xl">📷</div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleFavorite(listing.id);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              favorites.has(listing.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                            }`}
                          />
                        </button>
                        {listing.premium && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                            ÖNCELİKLİ
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            {typeof listing.price === 'number' ? listing.price.toLocaleString('tr-TR') : listing.price} ₺
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Eye className="w-4 h-4 mr-1" />
                            {listing.views || 0}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {listing.location} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tüm İlanlar */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tüm İlanlar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentListings.map((listing: Listing) => (
                  <Link key={listing.id} href={`/ilan/${listing.id}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                      {listing.images && (Array.isArray(listing.images) ? listing.images.length > 0 : listing.images) ? (
                        <Image
                          src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="text-gray-400 text-4xl">📷</div>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleFavorite(listing.id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(listing.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                          }`}
                        />
                      </button>
                      {listing.premium && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                          ÖNCELİKLİ
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          {typeof listing.price === 'number' ? listing.price.toLocaleString('tr-TR') : listing.price} ₺
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {listing.views || 0}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {listing.location} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
