'use client';

import { Listing } from '@/types/listings';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';
import { HeartIcon, EyeIcon, StarIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ListingsDisplayProps {
  listings: Listing[];
  loading?: boolean;
  error?: string | null;
  showPagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (listingId: string | number) => void;
}

export default function ListingsDisplay({ 
  listings, 
  loading = false, 
  error = null,
  showPagination = false,
  itemsPerPage = 12,
  currentPage = 1,
  onPageChange,
  favorites = new Set(),
  onToggleFavorite
}: ListingsDisplayProps) {
  // Loading state
  if (loading) {
    return (
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
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">Hata Oluştu</div>
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  // Empty state
  if (!listings || listings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz İlan Bulunmuyor</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Bu kategoride henüz ilan bulunmuyor. İlk ilanı siz vererek başlayın!
        </p>
        <Link
          href="/ilan-ver"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          + Ücretsiz İlan Ver
        </Link>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = showPagination ? listings.slice(startIndex, endIndex) : listings;

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('tr-TR').format(numPrice);
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

  const handleToggleFavorite = (listingId: string | number) => {
    if (onToggleFavorite) {
      onToggleFavorite(listingId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentListings.map((listing) => (
          <div key={listing.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
              {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                <OptimizedImage
                  src={listing.images[0]}
                  alt={listing.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                  priority={false}
                  onError={() => {
                    // Hata durumunda placeholder göster
                    const placeholder = document.querySelector('.image-placeholder');
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              {/* Placeholder - resim yoksa veya yüklenemezse göster */}
              <div className={`image-placeholder ${listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">Resim Yok</div>
                </div>
              </div>
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleFavorite(listing.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  {favorites.has(String(listing.id)) ? (
                    <HeartIconSolid className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  )}
                </button>
              )}
              {listing.premium && (
                <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                  PREMIUM
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {listing.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {listing.description}
              </p>

              {/* Price and Location */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(listing.price)} ₺
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {listing.city}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {formatDate(listing.createdAt)}
                </div>
                {listing.views && (
                  <div className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    {listing.views}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link 
                href={`/ilan/${listing.id}`}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                İlanı Görüntüle
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && onPageChange && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Önceki
          </button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === currentPage;
            const isNearCurrent = Math.abs(page - currentPage) <= 2;
            
            if (isCurrentPage || isNearCurrent || page === 1 || page === totalPages) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isCurrentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return <span key={page} className="px-2 text-gray-500">...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sonraki
          </button>
        </div>
      )}

      {/* Results Count */}
      {showPagination && (
        <div className="text-center text-sm text-gray-500 mt-4">
          {listings.length} ilan arasından {startIndex + 1}-{Math.min(endIndex, listings.length)} gösteriliyor
        </div>
      )}
    </div>
  );
} 