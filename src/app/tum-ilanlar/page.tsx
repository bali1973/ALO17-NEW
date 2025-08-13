'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye } from 'lucide-react';
import { Sidebar } from "@/components/SidebarComponent"
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

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

export default function TumIlanlarPage() {
  
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set())

  // İlanları yükle
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch('/api/listings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache'
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            // Show all listings
            setListings(data)
          } else {
            console.error('API did not return an array');
            setListings([]);
          }
        } else {
          console.error('API response not ok:', response.status);
          setListings([]);
        }
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error)
        setListings([]);
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handleToggleFavorite = (listingId: string | number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(listingId)) {
      newFavorites.delete(listingId);
    } else {
      newFavorites.add(listingId);
    }
    setFavorites(newFavorites);
  };

  // Filtreleme ve sıralama
  const filteredListings = listings
    .filter(listing => {
      if (!listing || typeof listing !== 'object') return false;
      
      const title = listing.title || '';
      const description = listing.description || '';
      const location = listing.location || '';
      const category = listing.category || '';
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           location.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      try {
        switch (sortBy) {
          case 'price':
            const priceA = typeof a.price === 'number' ? a.price : parseFloat(String(a.price || 0));
            const priceB = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || 0));
            return priceA - priceB
          case 'views':
            return (b.views || 0) - (a.views || 0)
          case 'createdAt':
          default:
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        }
      } catch (error) {
        return 0;
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
                {filteredListings.map((listing) => {
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
