'use client'

import { useState, useEffect } from 'react'
import { ListingCard } from "@/components/listing-card"
import { Sidebar } from "@/components/sidebar"
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface Listing {
  id: string
  title: string
  price: string
  location: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  imageUrl: string
  createdAt: string
  views: number
  condition: string
}

export default function TumIlanlarPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')

  // İlanları yükle
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
        console.error('İlanlar yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Filtreleme ve sıralama
  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = parseFloat(a.price.replace(/[^\d.-]/g, ''))
          const priceB = parseFloat(b.price.replace(/[^\d.-]/g, ''))
          return priceA - priceB
        case 'views':
          return b.views - a.views
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">İlanlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Sidebar />
          </div>
          
          {/* Ana İçerik */}
          <div className="flex-1">
            {/* Başlık */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Tüm İlanlar</h1>
              <p className="text-gray-600">
                {filteredListings.length} ilan bulundu
              </p>
            </div>

            {/* Filtreler */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Arama */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="İlan ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Kategori Filtresi */}
                <div className="md:w-48">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    <option value="elektronik">Elektronik</option>
                    <option value="ev-esyalari">Ev Eşyaları</option>
                    <option value="giyim">Giyim</option>
                    <option value="ucretsiz-gel-al">Ücretsiz Gel Al</option>
                    <option value="is">İş</option>
                    <option value="hizmetler">Hizmetler</option>
                  </select>
                </div>

                {/* Sıralama */}
                <div className="md:w-48">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="createdAt">En Yeni</option>
                    <option value="price">Fiyat (Düşük-Yüksek)</option>
                    <option value="views">En Popüler</option>
                  </select>
                </div>
              </div>
            </div>

            {/* İlanlar */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="mx-auto h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <FunnelIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">İlan bulunamadı</h3>
                <p className="text-gray-500">
                  Arama kriterlerinize uygun ilan bulunamadı. Farklı anahtar kelimeler deneyin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 