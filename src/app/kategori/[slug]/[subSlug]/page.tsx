'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { ListingCard } from '@/components/listing-card'
import { listings } from '@/lib/listings'

// Kategori verilerini burada tanımlayalım (ana kategori sayfasıyla aynı)
const categories = {
  'elektronik': {
    title: 'Elektronik',
    subcategories: [
      { slug: 'telefon', title: 'Telefon' },
      { slug: 'bilgisayar', title: 'Bilgisayar' },
      { slug: 'tablet', title: 'Tablet' },
      { slug: 'kamera', title: 'Kamera' },
      { slug: 'televizyon', title: 'Televizyon' },
      { slug: 'kulaklik', title: 'Kulaklık' },
      { slug: 'oyun-konsolu', title: 'Oyun Konsolu' },
      { slug: 'yazici', title: 'Yazıcı' },
      { slug: 'network', title: 'Network' }
    ]
  },
  'ev-bahce': {
    title: 'Ev & Bahçe',
    subcategories: [
      { slug: 'mobilya', title: 'Mobilya' },
      { slug: 'dekorasyon', title: 'Dekorasyon' },
      { slug: 'bahce', title: 'Bahçe' },
      { slug: 'ev-aleti', title: 'Ev Aleti' },
      { slug: 'ev-aletleri', title: 'Ev Aletleri' }
    ]
  },
  'ev-esyalari': {
    title: 'Ev Eşyaları',
    subcategories: [
      { slug: 'beyaz-esya', title: 'Beyaz Eşya' },
      { slug: 'mobilya', title: 'Mobilya' },
      { slug: 'mutfak-gerecleri', title: 'Mutfak Gereçleri' }
    ]
  },
  'giyim': {
    title: 'Giyim',
    subcategories: [
      { slug: 'erkek-giyim', title: 'Erkek Giyim' },
      { slug: 'kadin-giyim', title: 'Kadın Giyim' },
      { slug: 'bayan-giyim', title: 'Bayan Giyim' },
      { slug: 'cocuk-giyim', title: 'Çocuk Giyim' },
      { slug: 'ayakkabi', title: 'Ayakkabı' },
      { slug: 'ayakkabi-canta', title: 'Ayakkabı & Çanta' },
      { slug: 'aksesuar', title: 'Aksesuar' }
    ]
  },
  'saglik-guzellik': {
    title: 'Sağlık & Güzellik',
    subcategories: [
      { slug: 'kisisel-bakim', title: 'Kişisel Bakım' },
      { slug: 'kuaför-berber', title: 'Kuaför & Berber' },
      { slug: 'güzellik-merkezi', title: 'Güzellik Merkezi' },
      { slug: 'spa-merkezi', title: 'Spa Merkezi' },
      { slug: 'kozmetik-ürünleri', title: 'Kozmetik Ürünleri' },
      { slug: 'diyet-ve-beslenme', title: 'Diyet ve Beslenme' }
    ]
  },
  'sporlar-oyunlar-eglenceler': {
    title: 'Sporlar, Oyunlar & Eğlenceler',
    subcategories: [
      { slug: 'spor-aktiviteleri', title: 'Spor Aktiviteleri' },
      { slug: 'spor-dallari', title: 'Spor Dalları' },
      { slug: 'video-oyunlari', title: 'Video Oyunları' }
    ]
  },
  'sanat-hobi': {
    title: 'Sanat & Hobi',
    subcategories: [
      { slug: 'el-işi-malzemeleri', title: 'El İşi Malzemeleri' },
      { slug: 'hobi-kursları', title: 'Hobi Kursları' },
      { slug: 'koleksiyon', title: 'Koleksiyon' },
      { slug: 'müzik-aletleri', title: 'Müzik Aletleri' },
      { slug: 'resim-malzemeleri', title: 'Resim Malzemeleri' }
    ]
  },
  'turizm-gecelemeler': {
    title: 'Turizm & Gecelemeler',
    subcategories: [
      { slug: 'oteller', title: 'Oteller' },
      { slug: 'tatil-koyleri', title: 'Tatil Köyleri' },
      { slug: 'pansiyonlar', title: 'Pansiyonlar' },
      { slug: 'apartlar', title: 'Apartlar' },
      { slug: 'butik-oteller', title: 'Butik Oteller' },
      { slug: 'hosteller', title: 'Hosteller' },
      { slug: 'kamp-alanlari', title: 'Kamp Alanları' },
      { slug: 'ev-kiralama', title: 'Ev Kiralama' },
      { slug: 'termal-oteller', title: 'Termal Oteller' }
    ]
  },
  'yemek-icecek': {
    title: 'Yemek & İçecek',
    subcategories: [
      { slug: 'restoranlar', title: 'Restoranlar' },
      { slug: 'kafeler', title: 'Kafeler' },
      { slug: 'fast-food', title: 'Fast Food' },
      { slug: 'tatli-pastane', title: 'Tatlı & Pastane' },
      { slug: 'ozel-yemekler', title: 'Özel Yemekler' }
    ]
  },
  'egitim-kurslar': {
    title: 'Eğitim & Kurslar',
    subcategories: [
      { slug: 'yabanci-dil-kurslari', title: 'Yabancı Dil Kursları' },
      { slug: 'muzik-kurslari', title: 'Müzik Kursları' },
      { slug: 'spor-kurslari', title: 'Spor Kursları' },
      { slug: 'akademik-kurslar', title: 'Akademik Kurslar' },
      { slug: 'sanat-kurslari', title: 'Sanat Kursları' }
    ]
  },
  'anne-bebek': {
    title: 'Anne & Bebek',
    subcategories: [
      { slug: 'bebek-giyim', title: 'Bebek Giyim' },
      { slug: 'bebek-bakim', title: 'Bebek Bakım' },
      { slug: 'anne-urunleri', title: 'Anne Ürünleri' }
    ]
  },
  'is': {
    title: 'İş',
    subcategories: [
      { slug: 'is-ariyorum', title: 'İş Arıyorum' },
      { slug: 'tam-zamanli', title: 'Tam Zamanlı' }
    ]
  }
}

export default function SubCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const subSlug = params?.subSlug as string

  const category = categories[slug as keyof typeof categories]
  const subcategory = category?.subcategories?.find(sub => sub.slug === subSlug)

  useEffect(() => {
    // Eğer kategori veya alt kategori bulunamazsa, ana kategori sayfasına yönlendir
    if (slug && (!category || !subcategory)) {
      if (category) {
        router.replace(`/kategori/${slug}`)
      } else {
        router.replace('/kategori/elektronik')
      }
    }
  }, [category, subcategory, slug, router])

  // Loading durumu
  if (!category || !subcategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Bu alt kategoriye ait ilanları filtrele
  const categoryListings = listings.filter(listing => 
    listing.category === slug && listing.subcategory === subSlug
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">Ana Sayfa</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/kategori/${slug}`} className="hover:text-blue-600">
              {category.title}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{subcategory.title}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {subcategory.title}
        </h1>
        <p className="text-gray-600">
          {category.title} kategorisinde {subcategory.title} ile ilgili ilanları keşfedin.
        </p>
      </div>

      {/* İlanlar */}
      {categoryListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Henüz İlan Yok
          </h3>
          <p className="text-gray-600 mb-6">
            Bu kategoride henüz ilan bulunmuyor. İlk ilanı siz verin!
          </p>
          <Link
            href="/ilan-ver"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İlan Ver
          </Link>
        </div>
      )}

      {/* Diğer Alt Kategoriler */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Diğer {category.title} Kategorileri</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {category.subcategories
            .filter(sub => sub.slug !== subSlug)
            .slice(0, 8)
            .map((sub) => (
              <Link
                key={sub.slug}
                href={`/kategori/${slug}/${sub.slug}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <h3 className="font-medium text-gray-900">{sub.title}</h3>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
} 