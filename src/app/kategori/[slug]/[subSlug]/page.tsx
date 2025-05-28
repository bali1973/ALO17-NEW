'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { listingTypes, listingStatus } from '@/types/listings';

// Örnek veri tipi
interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  date: string;
  condition: string;
  type: string;
  status: string;
  showPhone: boolean;
  isFavorite: boolean;
  views: number;
  favorites: number;
  seller: {
    name: string;
    rating: number;
    memberSince: string;
    phone: string;
    isVerified: boolean;
  };
  premiumFeatures: {
    isActive: boolean;
    expiresAt: string | null;
    isHighlighted: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
  };
}

// Kategori ve alt kategori tipleri
type CategorySlug = 'elektronik' | 'spor' | 'ev-yasam' | 'hizmetler';
type SubCategorySlug = 'telefon' | 'bilgisayar' | 'fitness' | 'tenis' | 'mobilya' | 'beyaz-esya' | 'ozel-ders' | 'temizlik';

// Örnek veriler
const listings: Record<CategorySlug, Record<SubCategorySlug, Listing[]>> = {
  'elektronik': {
    'telefon': [
      {
        id: 1,
        title: 'iPhone 14 Pro Max 256GB',
        price: '45.000',
        location: 'Konak, İzmir',
        category: 'Elektronik',
        subcategory: 'Telefon',
        description: 'Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1678652197831-2d1808eecd76?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-20',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
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
      },
      {
        id: 2,
        title: 'Samsung Galaxy S24 Ultra',
        price: '42.000',
        location: 'Karşıyaka, İzmir',
        category: 'Elektronik',
        subcategory: 'Telefon',
        description: 'Sıfır, kutusunda Samsung Galaxy S24 Ultra 512GB. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-19',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 180,
        favorites: 8,
        seller: {
          name: 'Mehmet Demir',
          rating: 4.5,
          memberSince: '2023-03-10',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-19',
          isHighlighted: false,
          isFeatured: false,
          isUrgent: true,
        },
      }
    ],
    'bilgisayar': [
      {
        id: 3,
        title: 'MacBook Pro M3 Pro 16GB',
        price: '65.000',
        location: 'Çankaya, Ankara',
        category: 'Elektronik',
        subcategory: 'Bilgisayar',
        description: 'Sıfır, kutusunda MacBook Pro M3 Pro 16GB RAM, 512GB SSD. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-18',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 320,
        favorites: 15,
        seller: {
          name: 'Ayşe Kaya',
          rating: 4.9,
          memberSince: '2023-02-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-18',
          isHighlighted: true,
          isFeatured: true,
          isUrgent: false,
        },
      }
    ]
  },
  'spor': {
    'fitness': [
      {
        id: 4,
        title: 'Profesyonel Fitness Ekipmanları Seti',
        price: '25.000',
        location: 'Karşıyaka, İzmir',
        category: 'Spor',
        subcategory: 'Fitness',
        description: 'Tam donanımlı fitness ekipmanları seti. Dumbbell seti, bench press, squat rack ve ağırlık plakaları dahil.',
        images: [
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-19',
        condition: 'İkinci El',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 180,
        favorites: 8,
        seller: {
          name: 'Mehmet Demir',
          rating: 4.5,
          memberSince: '2023-03-10',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-19',
          isHighlighted: false,
          isFeatured: false,
          isUrgent: true,
        },
      }
    ],
    'tenis': [
      {
        id: 5,
        title: 'Profesyonel Tenis Raketi Seti',
        price: '3.500',
        location: 'Bornova, İzmir',
        category: 'Spor',
        subcategory: 'Tenis',
        description: 'Wilson Pro Staff Tenis Raketi Seti. 2 adet raket, raket çantası ve 6 adet tenis topu dahil.',
        images: [
          'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-18',
        condition: 'Yeni',
        type: listingTypes.FREE,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 120,
        favorites: 5,
        seller: {
          name: 'Ayşe Kaya',
          rating: 4.9,
          memberSince: '2023-02-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: false,
          expiresAt: null,
          isHighlighted: false,
          isFeatured: false,
          isUrgent: false,
        },
      }
    ]
  },
  'ev-yasam': {
    'mobilya': [
      {
        id: 6,
        title: 'Modern L Koltuk Takımı',
        price: '12.000',
        location: 'Bornova, İzmir',
        category: 'Ev & Yaşam',
        subcategory: 'Mobilya',
        description: 'Yeni, kullanılmamış L koltuk takımı. Gri renk, modern tasarım. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-18',
        condition: 'Yeni',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 320,
        favorites: 15,
        seller: {
          name: 'Ayşe Kaya',
          rating: 4.9,
          memberSince: '2023-02-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-18',
          isHighlighted: true,
          isFeatured: true,
          isUrgent: false,
        },
      }
    ],
    'beyaz-esya': [
      {
        id: 7,
        title: 'Beyaz Eşya Seti',
        price: '35.000',
        location: 'Çankaya, Ankara',
        category: 'Ev & Yaşam',
        subcategory: 'Beyaz Eşya',
        description: 'Siemens beyaz eşya seti. Buzdolabı, çamaşır makinesi, bulaşık makinesi ve fırın dahil. Faturalı ve garantili.',
        images: [
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-17',
        condition: 'Sıfır',
        type: listingTypes.PREMIUM,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 280,
        favorites: 12,
        seller: {
          name: 'Dr. Ali Yıldız',
          rating: 5.0,
          memberSince: '2023-01-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: true,
          expiresAt: '2024-04-17',
          isHighlighted: false,
          isFeatured: true,
          isUrgent: true,
        },
      }
    ]
  },
  'hizmetler': {
    'ozel-ders': [
      {
        id: 8,
        title: 'Özel Matematik Dersi',
        price: '300',
        location: 'Çankaya, Ankara',
        category: 'Hizmetler',
        subcategory: 'Özel Ders',
        description: 'Üniversite öğrencilerine özel matematik dersi. Calculus, lineer cebir ve diferansiyel denklemler konularında uzman.',
        images: [
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-17',
        condition: 'Hizmet',
        type: listingTypes.FREE,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 150,
        favorites: 5,
        seller: {
          name: 'Dr. Ali Yıldız',
          rating: 5.0,
          memberSince: '2023-01-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: false,
          expiresAt: null,
          isHighlighted: false,
          isFeatured: false,
          isUrgent: false,
        },
      }
    ],
    'temizlik': [
      {
        id: 9,
        title: 'Profesyonel Temizlik Hizmeti',
        price: '500',
        location: 'Karşıyaka, İzmir',
        category: 'Hizmetler',
        subcategory: 'Temizlik',
        description: 'Profesyonel temizlik hizmeti. Ev ve ofis temizliği. Referanslı ve deneyimli ekip.',
        images: [
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60'
        ],
        date: '2024-03-16',
        condition: 'Hizmet',
        type: listingTypes.FREE,
        status: listingStatus.ACTIVE,
        showPhone: false,
        isFavorite: false,
        views: 200,
        favorites: 8,
        seller: {
          name: 'Temizlik A.Ş.',
          rating: 4.9,
          memberSince: '2022-01-01',
          phone: '',
          isVerified: true,
        },
        premiumFeatures: {
          isActive: false,
          expiresAt: null,
          isHighlighted: false,
          isFeatured: false,
          isUrgent: false,
        },
      }
    ]
  }
};

const filters = {
  priceRange: [
    { label: 'Tümü', value: 'all' },
    { label: '0 - 10.000 TL', value: '0-10000' },
    { label: '10.000 - 25.000 TL', value: '10000-25000' },
    { label: '25.000 - 50.000 TL', value: '25000-50000' },
    { label: '50.000 TL ve üzeri', value: '50000+' },
  ],
  condition: [
    { label: 'Tümü', value: 'all' },
    { label: 'Yeni', value: 'new' },
    { label: 'İkinci El', value: 'used' },
  ],
  sortBy: [
    { label: 'En Yeni', value: 'newest' },
    { label: 'Fiyat (Artan)', value: 'price-asc' },
    { label: 'Fiyat (Azalan)', value: 'price-desc' },
    { label: 'En Çok Görüntülenen', value: 'most-viewed' },
  ],
};

export default function SubCategoryPage() {
  const params = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');

  const categorySlug = params.slug as string;
  const subCategorySlug = params.subSlug as string;
  
  // Kategori ve alt kategori isimlerini formatla
  const formatSlug = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatSlug(categorySlug);
  const subCategoryName = formatSlug(subCategorySlug);

  // Mevcut kategorideki ilanları al
  const currentListings = (listings[categorySlug as CategorySlug]?.[subCategorySlug as SubCategorySlug] || []) as Listing[];
  const totalListings = currentListings.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-alo-orange">Ana Sayfa</Link>
        <span>/</span>
        <Link href={`/kategori/${categorySlug}`} className="hover:text-alo-orange">{categoryName}</Link>
        <span>/</span>
        <span className="text-alo-dark font-medium">{subCategoryName}</span>
      </div>

      {/* Başlık ve Filtreler */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-alo-dark">{subCategoryName}</h1>
          <p className="text-gray-600 mt-1">{totalListings} ilan bulundu</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:border-alo-orange"
          >
            <FunnelIcon className="w-5 h-5" />
            <span>Filtreler</span>
          </button>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 hover:border-alo-orange focus:outline-none focus:border-alo-orange"
          >
            {filters.sortBy.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtreler Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-alo-dark">Filtreler</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-alo-red lg:hidden"
                >
                  <AdjustmentsHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Fiyat Aralığı */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h3>
                  <div className="space-y-2">
                    {filters.priceRange.map((range) => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={selectedPriceRange === range.value}
                          onChange={(e) => setSelectedPriceRange(e.target.value)}
                          className="w-4 h-4 text-alo-orange border-gray-300 focus:ring-alo-orange"
                        />
                        <span className="ml-2 text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Durum */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Durum</h3>
                  <div className="space-y-2">
                    {filters.condition.map((condition) => (
                      <label key={condition.value} className="flex items-center">
                        <input
                          type="radio"
                          name="condition"
                          value={condition.value}
                          checked={selectedCondition === condition.value}
                          onChange={(e) => setSelectedCondition(e.target.value)}
                          className="w-4 h-4 text-alo-orange border-gray-300 focus:ring-alo-orange"
                        />
                        <span className="ml-2 text-gray-700">{condition.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* İlan Listesi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {currentListings.map((listing: Listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/listing/${listing.id}`} className="block">
                <div className="relative h-48 bg-alo-light-blue">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    className="object-cover transition-transform group-hover:scale-105"
                    quality={85}
                  />
                  {listing.condition === 'Yeni' && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Yeni
                    </span>
                  )}
                  {listing.premiumFeatures?.isActive && (
                    <span className="absolute top-2 left-2 bg-alo-orange text-white px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-alo-dark line-clamp-2 mb-2 group-hover:text-alo-orange transition-colors">
                    {listing.title}
                  </h3>
                  <p className="text-xl font-bold text-alo-red mb-2">{listing.price} TL</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {listing.location}
                    </span>
                    <span>{new Date(listing.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {listing.views} görüntülenme
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {listing.favorites} favori
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <div className="flex space-x-2">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    İlanı Gör
                  </Link>
                  <Link
                    href={`/listing/${listing.id}#message`}
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Mesaj Gönder
                  </Link>
                </div>
                {listing.showPhone && (
                  <div className="mt-2 text-sm text-gray-500 text-center">
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Telefon Görünür
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sayfalama */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange">
            Önceki
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                page === 1
                  ? 'bg-alo-orange text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:border-alo-orange hover:text-alo-orange">
            Sonraki
          </button>
        </nav>
      </div>
    </div>
  );
} 