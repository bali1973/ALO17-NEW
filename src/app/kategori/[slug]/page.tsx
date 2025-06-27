'use client';

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect } from 'react'

const categories = {
  'elektronik': {
    title: 'Elektronik',
    description: 'Telefon, bilgisayar, tablet ve daha birçok elektronik ürünü keşfedin.',
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
    description: 'Ev dekorasyonu, bahçe malzemeleri ve daha fazlası.',
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
    description: 'Beyaz eşya, mutfak gereçleri ve ev eşyaları.',
    subcategories: [
      { slug: 'beyaz-esya', title: 'Beyaz Eşya' },
      { slug: 'mobilya', title: 'Mobilya' },
      { slug: 'mutfak-gerecleri', title: 'Mutfak Gereçleri' }
    ]
  },
  'giyim': {
    title: 'Giyim',
    description: 'Günlük, spor ve özel gün kıyafetlerini keşfedin.',
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
    description: 'Sağlık ve güzellik hizmetleri, ürünleri ve daha fazlası.',
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
    description: 'Spor aktiviteleri, oyunlar ve eğlence seçenekleri.',
    subcategories: [
      { slug: 'spor-aktiviteleri', title: 'Spor Aktiviteleri' },
      { slug: 'spor-dallari', title: 'Spor Dalları' },
      { slug: 'video-oyunlari', title: 'Video Oyunları' }
    ]
  },
  'sanat-hobi': {
    title: 'Sanat & Hobi',
    description: 'Sanat malzemeleri, hobi kursları ve daha fazlası.',
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
    description: 'Otel, tatil köyü, pansiyon ve daha birçok konaklama seçeneğini keşfedin.',
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
    description: 'Restoranlar, kafeler ve daha birçok lezzet durağını keşfedin.',
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
    description: 'Yabancı dil, müzik, spor ve daha birçok kurs seçeneğini keşfedin.',
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
    description: 'Bebek ürünleri, anne bakımı ve daha fazlası.',
    subcategories: [
      { slug: 'bebek-giyim', title: 'Bebek Giyim' },
      { slug: 'bebek-bakim', title: 'Bebek Bakım' },
      { slug: 'anne-urunleri', title: 'Anne Ürünleri' }
    ]
  },
  'is': {
    title: 'İş',
    description: 'İş ilanları ve kariyer fırsatları.',
    subcategories: [
      { slug: 'is-ariyorum', title: 'İş Arıyorum' },
      { slug: 'tam-zamanli', title: 'Tam Zamanlı' }
    ]
  }
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const category = categories[slug as keyof typeof categories]

  useEffect(() => {
    // Eğer kategori bulunamazsa, elektronik kategorisine yönlendir
    if (!category && slug) {
      router.replace('/kategori/elektronik')
    }
  }, [category, slug, router])

  // Loading durumu
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Kategori yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{category.title}</h1>
        <p className="text-gray-600 mt-2">{category.description}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sol Sidebar - Alt Kategoriler */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            <div className="space-y-2">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  href={`/kategori/${slug}/${subcategory.slug}`}
                  className="block p-3 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  {subcategory.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Popüler İlanlar</h2>
            <p className="text-gray-600 mb-6">
              {category.title} kategorisindeki en popüler ilanları görüntülemek için alt kategorilerden birini seçin.
            </p>
            
            {/* Hızlı Linkler */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.subcategories.slice(0, 6).map((subcategory) => (
                <Link
                  key={subcategory.slug}
                  href={`/kategori/${slug}/${subcategory.slug}`}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
                >
                  <h3 className="font-medium text-gray-900">{subcategory.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 