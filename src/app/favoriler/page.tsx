'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Search, Eye, Trash2, ArrowLeft } from 'lucide-react';

interface FavoriteListing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[] | string;
  category: string;
  subcategory: string;
  location: string;
  createdAt: string;
  views: number;
  premium: boolean;
}

interface FavoriteItem {
  id: string;
  createdAt: string;
  listing: FavoriteListing;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function FavorilerPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  // Filtreleme ve arama
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  // Favori kaldırma
  const [removingFavorite, setRemovingFavorite] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push('/giris?redirect=/favoriler');
      return;
    }
    loadFavorites();
  }, [session, isLoading, router, loadFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [searchQuery, selectedCategory, currentPage, loadFavorites]);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`/api/favorites?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFavorites(data.favorites);
        setPagination(data.pagination);
        
        // Kategorileri topla
        const uniqueCategories = [...new Set(data.favorites.map((f: FavoriteItem) => f.listing.category))];
        setCategories(uniqueCategories);
      } else {
        setError(data.error || 'Favoriler yüklenirken hata oluştu');
      }
    } catch {
      setError('Favoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  const removeFavorite = async (favoriteId: string, listingId: string) => {
    try {
      setRemovingFavorite(favoriteId);
      
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });

      if (response.ok) {
        // Favoriyi listeden kaldır
        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
        
        // Sayfa yeniden yükle
        if (favorites.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          loadFavorites();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Favori kaldırılamadı');
      }
    } catch {
      setError('Favori kaldırılırken hata oluştu');
    } finally {
      setRemovingFavorite(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Router zaten yönlendiriyor
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/profil" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Favorilerim</h1>
              <p className="text-gray-600">
                {pagination ? `${pagination.total} favori ilan` : 'Favori ilanlarınız'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtreler ve Arama */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Arama */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Favori ilanlarınızda arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Kategori Filtresi */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Filtreleri Temizle */}
            {(searchQuery || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span className="text-red-600">{error}</span>
            </div>
          </div>
        )}

        {/* Favori Listesi */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory ? "Filtreleme sonucu bulunamadı" : "Henüz favori ilanınız yok"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory 
                ? "Farklı arama terimleri veya kategoriler deneyin"
                : "Beğendiğiniz ilanları favorilere ekleyerek burada görebilirsiniz"
              }
            </p>
            {!searchQuery && !selectedCategory && (
              <Link
                href="/tum-ilanlar"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                İlanları Keşfet
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Favori Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Görsel */}
                  <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                    {favorite.listing.images && (Array.isArray(favorite.listing.images) ? favorite.listing.images.length > 0 : favorite.listing.images) ? (
                      <Image
                        src={Array.isArray(favorite.listing.images) ? favorite.listing.images[0] : favorite.listing.images}
                        alt={favorite.listing.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📷</span>
                      </div>
                    )}
                    
                    {/* Premium Badge */}
                    {favorite.listing.premium && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                        ÖNCELİKLİ
                      </div>
                    )}

                    {/* Favori Kaldır */}
                    <button
                      onClick={() => removeFavorite(favorite.id, favorite.listing.id)}
                      disabled={removingFavorite === favorite.id}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="Favorilerden kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* İçerik */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/ilan/${favorite.listing.id}`} className="hover:text-blue-600 transition-colors">
                        {favorite.listing.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {favorite.listing.description}
                    </p>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(favorite.listing.price)} ₺
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        {favorite.listing.views || 0}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{favorite.listing.location}</span>
                      <span>{formatDate(favorite.listing.createdAt)}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {favorite.listing.category}
                      </span>
                      {favorite.listing.subcategory && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {favorite.listing.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sayfalama */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
