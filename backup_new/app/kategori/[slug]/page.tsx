'use client';

import { useParams } from 'next/navigation'
import Link from 'next/link'

const categories = {
  'elektronik': {
    title: 'Elektronik',
    description: 'Telefon, bilgisayar, tablet ve daha birçok elektronik ürünü keşfedin.',
    subcategories: [
      { slug: 'telefon', title: 'Telefon' },
      { slug: 'bilgisayar', title: 'Bilgisayar' },
      { slug: 'tablet', title: 'Tablet' },
      { slug: 'kamera', title: 'Kamera' },
      { slug: 'televizyon', title: 'Televizyon' }
    ]
  },
  'giyim': {
    title: 'Giyim',
    description: 'Günlük, spor ve özel gün kıyafetlerini keşfedin.',
    subcategories: [
      { slug: 'erkek', title: 'Erkek Giyim' },
      { slug: 'kadin', title: 'Kadın Giyim' },
      { slug: 'cocuk', title: 'Çocuk Giyim' },
      { slug: 'ayakkabi', title: 'Ayakkabı' },
      { slug: 'aksesuar', title: 'Aksesuar' }
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
  'turizm-gecelemeler': {
    title: 'Turizm & Gecelemeler',
    description: 'Otel, tatil köyü, pansiyon ve daha birçok konaklama seçeneğini keşfedin.',
    subcategories: [
      { slug: 'oteller', title: 'Oteller' },
      { slug: 'tatil-koyleri', title: 'Tatil Köyleri' },
      { slug: 'pansiyonlar', title: 'Pansiyonlar' },
      { slug: 'apartlar', title: 'Apartlar' },
      { slug: 'butik-oteller', title: 'Butik Oteller' }
    ]
  },
  'saglik-guzellik': {
    title: 'Sağlık & Güzellik',
    description: 'Sağlık ve güzellik hizmetleri, ürünleri ve daha fazlası.',
    subcategories: [
      {
        slug: 'kuaför-berber',
        title: 'Kuaför & Berber',
        description: 'Saç kesimi, şekillendirme ve bakım hizmetleri.'
      },
      {
        slug: 'güzellik-merkezi',
        title: 'Güzellik Merkezi',
        description: 'Cilt bakımı, makyaj ve güzellik hizmetleri.'
      },
      {
        slug: 'spa-merkezi',
        title: 'Spa Merkezi',
        description: 'Masaj, cilt bakımı ve wellness hizmetleri.'
      },
      {
        slug: 'kozmetik-ürünleri',
        title: 'Kozmetik Ürünleri',
        description: 'Makyaj, cilt bakımı ve kişisel bakım ürünleri.'
      },
      {
        slug: 'diyet-ve-beslenme',
        title: 'Diyet ve Beslenme',
        description: 'Diyetisyen hizmetleri ve beslenme danışmanlığı.'
      }
    ]
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string
  const category = categories[slug as keyof typeof categories]

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Kategori Bulunamadı</h1>
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
            <p className="text-gray-600">
              {category.title} kategorisindeki en popüler ilanları görüntülemek için alt kategorilerden birini seçin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 