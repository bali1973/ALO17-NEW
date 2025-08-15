'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/SidebarComponent';
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { mockCategories, mockListings } from '@/lib/mockData';


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
  status: "active" | "pending" | "sold" | "expired" | "onaylandı" | undefined
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
  const categories = mockCategories;
  const categoriesLoading = false;
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('premium');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
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
    // Mock data kullanıldığı için API çağrısı yapılmıyor
    setLoading(false);

    // İlan yayınlandı mesajını kontrol et
    if (typeof window !== 'undefined') {
      const ilanYayinlandi = localStorage.getItem('ilanYayinlandi');
      const ilanYayinlandiMesaji = localStorage.getItem('ilanYayinlandiMesaji');
      
      if (ilanYayinlandi === 'true' && ilanYayinlandiMesaji) {
        setSuccessMessage(ilanYayinlandiMesaji);
        setShowSuccessMessage(true);
        
        // LocalStorage'dan temizle
        localStorage.removeItem('ilanYayinlandi');
        localStorage.removeItem('ilanYayinlandiMesaji');
        
        // 5 saniye sonra mesajı gizle
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    }
  }, []);

  const getVisibilityScore = (listing: Listing) => {
    try {
      if (!listing || typeof listing !== 'object') return 0;
      
      let score = 0;
      if (listing.isPremium || listing.premium) score += 100;
      if (listing.premiumFeatures?.includes('featured')) score += 50;
      if (listing.premiumFeatures?.includes('urgent')) score += 30;
      if (listing.premiumFeatures?.includes('highlighted')) score += 20;
      if (listing.premiumFeatures?.includes('top')) score += 10;
      score += listing.views || 0;
      return score;
          } catch (error) {
        return 0;
      }
  };

  const filteredListings = (() => {
    // Güvenlik kontrolü - listings undefined veya null ise boş array döndür
    if (!listings || !Array.isArray(listings)) {
      return [];
    }
    
    return listings
      .filter((listing: Listing) => {
        // Null check for listing properties
        if (!listing || typeof listing !== 'object') return false;
        
        const title = listing.title || '';
        const description = listing.description || '';
        const category = listing.category || '';
        const subcategory = listing.subcategory || '';
        const city = listing.city || '';
        
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               category.toLowerCase().includes(searchQuery.toLowerCase()) ||
               subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
               city.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter(listing => {
        if (!listing) return false;
        return !selectedCategory || listing.category === selectedCategory;
      })
      .filter(listing => {
        if (!listing) return false;
        return !selectedSubcategory || listing.subcategory === selectedSubcategory;
      })
      .filter(listing => {
        if (!listing) return false;
        
        try {
          const price = typeof listing.price === 'number' ? listing.price : parseFloat(String(listing.price || 0));
          const min = priceRange.min ? parseFloat(priceRange.min) : 0;
          const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
          return !isNaN(price) && price >= min && price <= max;
        } catch (error) {
          return false;
        }
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        
        try {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            case 'oldest':
              return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
            case 'price-low':
              const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || 0));
              const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || 0));
              return priceA - priceB;
            case 'price-high':
              const priceAHigh = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || 0));
              const priceBHigh = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || 0));
              return priceBHigh - priceAHigh;
            case 'premium':
            default:
              return getVisibilityScore(b) - getVisibilityScore(a);
          }
        } catch (error) {
          console.error('Sorting error:', error);
          return 0;
        }
      });
  })();

  const premiumListings = (() => {
    if (!filteredListings || !Array.isArray(filteredListings)) {
      return [];
    }
    return filteredListings.filter((listing: Listing) => {
      if (!listing) return false;
      return listing.isPremium || listing.premium;
    }).slice(0, 3);
  })();

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
        {/* Başarı Mesajı Toast */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <span className="sr-only">Kapat</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

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
                 <option value="elektronik">Elektronik</option>
                 <option value="ev-bahce">Ev & Bahçe</option>
                 <option value="giyim">Giyim</option>
                 <option value="anne-bebek">Anne & Bebek</option>
                 <option value="egitim-kurslar">Eğitim & Kurslar</option>
                 <option value="yemek-icecek">Yemek & İçecek</option>
                 <option value="turizm-gecelemeler">Turizm & Gecelemeler</option>
                 <option value="saglik-guzellik">Sağlık & Güzellik</option>
                 <option value="sanat-hobi">Sanat & Hobi</option>
                 <option value="sporlar-oyunlar-eglenceler">Sporlar, Oyunlar & Eğlenceler</option>
                 <option value="is">İş</option>
                 <option value="ucretsiz-gel-al">Ücretsiz Gel Al</option>
                 <option value="hizmetler">Hizmetler</option>
                 <option value="diger">Diğer</option>
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



        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <Sidebar />
          </div>

          {/* Main Content: İlanlar */}
          <div className="flex-1 order-1 lg:order-2">
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
                {currentListings.map((listing: Listing) => {
                  // Safety check for listing data
                  if (!listing || !listing.id) {
                    console.warn('Invalid listing data:', listing);
                    return null;
                  }
                  
                  return (
                    <Link key={listing.id} href={`/ilan/${listing.id}`} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
                      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center overflow-hidden">
                        {listing.images && (Array.isArray(listing.images) ? listing.images.length > 0 : listing.images) ? (
                          <Image
                            src={Array.isArray(listing.images) ? listing.images[0] : listing.images}
                            alt={listing.title || 'İlan görseli'}
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
                          {listing.title || 'Başlık yok'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {listing.description || 'Açıklama yok'}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">
                            {(() => {
                              try {
                                const price = typeof listing.price === 'number' ? listing.price : parseFloat(String(listing.price || 0));
                                return isNaN(price) ? '0' : price.toLocaleString('tr-TR');
                              } catch (error) {
                                console.error('Price formatting error:', error);
                                return '0';
                              }
                            })()} ₺
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Eye className="w-4 h-4 mr-1" />
                            {listing.views || 0}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {listing.location || 'Konum yok'} • {(() => {
                            try {
                              return new Date(listing.createdAt || Date.now()).toLocaleDateString('tr-TR');
                            } catch (error) {
                              console.error('Date formatting error:', error);
                              return new Date().toLocaleDateString('tr-TR');
                            }
                          })()}
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
