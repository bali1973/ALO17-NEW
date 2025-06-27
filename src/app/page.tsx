'use client'

import { Sidebar } from "@/components/sidebar"
import { FeaturedAds } from '@/components/featured-ads'
import { LatestAds } from '@/components/latest-ads'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Ana İçerik */}
          <div className="flex-1 space-y-8">
            <section>
              <FeaturedAds title="Öne Çıkan İlanlar" />
            </section>
            <section>
              <LatestAds title="Son Eklenen İlanlar" />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
} 