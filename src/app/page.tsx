'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { listings } from "@/lib/listings"
import { ListingCard } from '@/components/listing-card'

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [latestListings, setLatestListings] = useState<any[]>([])

  useEffect(() => {
    // Öne çıkan ilanlar (premium olanlar)
    const featured = listings.filter(listing => listing.isPremium).slice(0, 6)
    setFeaturedListings(featured)

    // Son eklenen ilanlar
    const latest = listings.slice(0, 6)
    setLatestListings(latest)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Herkesin Kolayca İlan Verebileceği Platform
          </h1>
          <p className="text-xl mb-8">
            30 gün ücretsiz kullanım imkanıyla hayalinizdeki alıcı veya satıcıyı bulun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/ilan-ver"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              İlan Ver
            </Link>
            <Link 
              href="/giris"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Premium İlan Avantajları */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium İlan Avantajları</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Öne Çıkan İlan</h3>
              <p className="text-gray-600">İlanınız kategorisinde en üstte gösterilir ve daha fazla dikkat çeker.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Rozeti</h3>
              <p className="text-gray-600">Premium rozeti ile ilanınız daha güvenilir ve profesyonel görünür.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">3 Kat Daha Fazla Görüntülenme</h3>
              <p className="text-gray-600">Premium ilanlar normal ilanlara göre 3 kat daha fazla görüntülenme alır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan İlanlar */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Öne Çıkan İlanlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Son Eklenen İlanlar */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Son Eklenen İlanlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
} 