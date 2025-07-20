'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ListingCard, ListingCardSkeleton } from '@/components/listing-card'
import Link from 'next/link'
import { useCategories } from '@/lib/useCategories'
import { Smartphone, Home as HomeIcon, Shirt, Baby, Dumbbell, Heart, GraduationCap, Utensils, Palette, Gift, Users, Circle, Briefcase } from 'lucide-react'
import { RecentlyViewed } from '@/components/RecentlyViewed';
import { useAuth } from '@/components/Providers';
import Image from 'next/image';

interface Listing {
  id: number
  title: string
  price: string | number
  location: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  imageUrl: string
  createdAt: Date
  views: number
  condition: string
  status: string
}

const colorPalette = [
  "text-blue-500",
  "text-indigo-500",
  "text-orange-500",
  "text-purple-500",
  "text-pink-500",
  "text-emerald-500",
  "text-cyan-500",
  "text-amber-500",
  "text-teal-500",
  "text-rose-500",
  "text-violet-500",
  "text-lime-500",
  "text-green-600",
  "text-slate-500"
];

function getColor(slug: string, index: number) {
  return colorPalette[index % colorPalette.length];
}

// Function to render icon from category data
function renderIcon(iconData: string | null, slug: string, index: number) {
  if (iconData && iconData.startsWith('emoji:')) {
    // Handle emoji icons
    const emoji = iconData.replace('emoji:', '');
    return (
      <span className={`text-2xl ${getColor(slug, index)}`}>
        {emoji}
      </span>
    );
  } else if (iconData && iconData.startsWith('color:')) {
    // Handle color-only icons (fallback to emoji)
    const colorClass = iconData.replace('color:', '');
    return (
      <div className={`w-6 h-6 rounded-full ${colorClass} flex items-center justify-center`}>
        <span className="text-white text-xs font-bold">
          {slug.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  } else {
    // Fallback to default icon
    const defaultIcons: Record<string, any> = {
      elektronik: Smartphone,
      "ev-bahce": HomeIcon,
      giyim: Shirt,
      "anne-bebek": Baby,
      "sporlar-oyunlar-eglenceler": Dumbbell,
      "egitim-kurslar": GraduationCap,
      "yemek-icecek": Utensils,
      "turizm-gecelemeler": Gift,
      "saglik-guzellik": Heart,
      "sanat-hobi": Palette,
      "is": Briefcase,
      "hizmetler": Users,
      "ucretsiz-gel-al": Gift,
    };
    const Icon = defaultIcons[slug] || Circle;
    return <Icon className={`w-6 h-6 ${getColor(slug, index)}`} />;
  }
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { categories, loading: categoriesLoading, error: categoriesError, refetch } = useCategories()
  const { session } = useAuth();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings')
        if (response.ok) {
          const data = await response.json()
          // Only show active listings to regular users
          const activeListings = data.filter((listing: any) => listing.status === 'active');
          setListings(activeListings)
        }
      } catch (error) {
        //
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.bannerImageUrl) setBannerUrl(data.bannerImageUrl);
        else setBannerUrl('/images/banner.jpg');
      })
      .catch(() => setBannerUrl(null));
  }, []);

  const filteredListings = listings
    .filter(listing => listing.status === 'active') // Sadece aktif ilanları göster
    .filter(listing =>
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const premiumListings = filteredListings.filter(listing => listing.isPremium).slice(0, 3)

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      {bannerUrl && bannerUrl.trim() !== '' && (
        <div className="w-full flex justify-center mb-8">
          <Image
            src={bannerUrl}
            alt="Banner"
            width={1920}
            height={320}
            className="max-w-6xl w-full rounded-lg shadow-lg object-cover"
            style={{maxHeight: 320}}
            priority
          />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Premium İlanlar
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {premiumListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}

            {/* Tüm İlanlar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tüm İlanlar</h2>
                <p className="text-gray-600">{filteredListings.length} ilan bulundu</p>
              </div>
              {currentListings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Önceki
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sonraki
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchQuery ? 'Arama kriterlerinize uygun ilan bulunamadı.' : 'Henüz ilan bulunmuyor.'}
                  </p>
                  <Link
                    href="/ilan-ver"
                    className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    İlk İlanı Ver
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 