'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { listingTypes, listingStatus, type Listing } from '@/types/listings';
import { categories, type Category, type Subcategory } from '@/types/categories';

// Boş ilan listesi oluşturucu
const createEmptyListings = (): Record<string, Listing[]> => {
  const emptyListings: Record<string, Listing[]> = {};
  categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      emptyListings[subcategory.slug] = [];
    });
  });
  return emptyListings;
};

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hw7Zyc2VsIFlvayA8L3RleHQ+PC9zdmc+';

// Örnek veriler
const categoryListings: Record<string, Record<string, Listing[]>> = {
  'elektronik': {
    ...createEmptyListings(),
    telefon: [
      {
        id: 1,
        title: 'iPhone 14 Pro Max 256GB',
        price: '45.000',
        location: 'Konak, İzmir',
        category: 'Elektronik',
        subcategory: 'Telefon',
        description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&h=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&h=600&auto=format&fit=crop&q=80&crop=faces',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&h=600&auto=format&fit=crop&q=80&crop=entropy'
        ],
        date: '2024-03-20',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: true,
        isFavorite: false,
        views: 245,
        favorites: 12,
        seller: {
          name: 'Ahmet Yılmaz',
          rating: 4.8,
          memberSince: '2023-01-15',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-20',
          isHighlighted: true,
          isFeatured: true,
          isUrgent: false,
        },
      }
    ]
  },
  'catering-ticaret': {
    ...createEmptyListings(),
    'icecek': [
      {
        id: 1001,
        title: 'HemenAlgetir.com - Online Gıda ve İçecek Alışverişi',
        price: '0',
        location: 'Türkiye Geneli',
        category: 'Catering & Ticaret',
        subcategory: 'İçecek',
        description: 'HemenAlgetir.com ile tüm gıda ve içecek ihtiyaçlarınızı online olarak sipariş edin! Geniş ürün yelpazesi, hızlı teslimat ve uygun fiyatlarla hizmetinizdeyiz. Taze meyve sebzeler, süt ürünleri, et ürünleri, içecekler ve daha fazlası için hemen sitemizi ziyaret edin!',
        images: [
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&auto=format&fit=crop&q=80&crop=faces',
          'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&auto=format&fit=crop&q=80&crop=entropy'
        ],
        date: '2024-03-21',
        condition: 'Reklam',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: true,
        isFavorite: false,
        views: 0,
        favorites: 0,
        seller: {
          name: 'HemenAlgetir.com',
          rating: 5.0,
          memberSince: '2024-01-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2025-12-31',
          isHighlighted: true,
          isFeatured: true,
          isUrgent: false,
        },
        externalLink: 'https://www.hemenalgetir.com',
      }
    ]
  }
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Kategori bilgilerini bul
  const category = categories.find(cat => cat.slug === categorySlug);
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-red-600">Kategori bulunamadı</h1>
        <Link href="/" className="block text-center mt-4 text-blue-600 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // İlanları filtrele ve sırala
  const listings = categoryListings[categorySlug] || createEmptyListings();
  const filteredListings = selectedSubcategory 
    ? listings[selectedSubcategory] || []
    : Object.values(listings).flat();

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'price':
        return parseInt(b.price) - parseInt(a.price);
      case 'popularity':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-alo-light">
      {/* Kategori Başlığı */}
      <div className="bg-gradient-to-r from-alo-blue to-alo-light-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-4xl font-bold">{category.name}</h1>
          </div>
          <p className="text-lg text-white/90">
            {category.subcategories.length} alt kategoride {filteredListings.length} ilan
          </p>
        </div>
      </div>

      {/* Filtreler ve Alt Kategoriler */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Alt Kategoriler */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubcategory === null
                    ? 'bg-alo-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tümü
              </button>
              {category.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => setSelectedSubcategory(subcategory.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSubcategory === subcategory.slug
                      ? 'bg-alo-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sıralama ve Filtreler */}
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'popularity')}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-alo-blue"
            >
              <option value="date">En Yeni</option>
              <option value="price">Fiyat</option>
              <option value="popularity">Popülerlik</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-alo-blue flex items-center gap-2"
            >
              <FunnelIcon className="w-5 h-5" />
              Filtreler
            </button>
          </div>
        </div>

        {/* İlan Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {listing.externalLink ? (
                <a href={listing.externalLink} target="_blank" rel="noopener noreferrer">
                  <div className="relative aspect-[4/3]">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                        quality={85}
                        priority={false}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = placeholderImage;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Image
                          src={placeholderImage}
                          alt="Görsel yok"
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    )}
                    {listing.condition === 'Reklam' && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Reklam
                      </span>
                    )}
                    {listing.premiumFeatures?.isActive && (
                      <span className="absolute top-2 left-2 bg-alo-orange text-white px-2 py-1 rounded-full text-xs">
                        Premium
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-alo-dark line-clamp-2 mb-2">{listing.title}</h3>
                    <p className="text-xl font-bold text-alo-red mb-2">{listing.price === '0' ? 'Ücretsiz' : `${listing.price} TL`}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{listing.location}</span>
                      <span>{new Date(listing.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{listing.seller.name}</span>
                      <span className="text-blue-600">Siteye Git →</span>
                    </div>
                  </div>
                </a>
              ) : (
                <Link href={`/ilan/${listing.id}`}>
                  <div className="relative aspect-[4/3]">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                        quality={85}
                        priority={false}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = placeholderImage;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Image
                          src={placeholderImage}
                          alt="Görsel yok"
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    )}
                    {listing.condition === 'Yeni' && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        Yeni
                      </span>
                    )}
                    {listing.premiumFeatures?.isActive && (
                      <span className="absolute top-2 left-2 bg-alo-orange text-white px-2 py-1 rounded-full text-xs">
                        Premium
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-alo-dark line-clamp-2 mb-2">{listing.title}</h3>
                    <p className="text-xl font-bold text-alo-red mb-2">{listing.price} TL</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{listing.location}</span>
                      <span>{new Date(listing.date).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <span>{listing.seller.name}</span>
                      <span>{listing.views} görüntülenme</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* İlan Yoksa */}
        {sortedListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Bu kategoride henüz ilan bulunmuyor.</p>
            <Link
              href="/ilan-ver"
              className="inline-block bg-alo-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-alo-light-orange transition-colors"
            >
              İlan Ver
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 