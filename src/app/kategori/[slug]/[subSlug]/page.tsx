'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Örnek veri
type Listing = {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  category: string;
  subCategory: string;
  createdAt: string;
  views: number;
  condition: string;
  brand: string;
  model: string;
  year: string;
  favorites?: number;
};

const listings: Listing[] = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256GB',
    price: '45.000',
    location: 'Konak, İzmir',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=iPhone+14+Pro+Max&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-18',
    views: 567,
    condition: 'Yeni',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    year: '2024',
    favorites: 12
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra',
    price: '42.000',
    location: 'Kadıköy, İstanbul',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=Samsung+S23+Ultra&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-17',
    views: 432,
    condition: 'İkinci El',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
    year: '2023'
  },
  {
    id: 3,
    title: 'iPhone 13 Pro 128GB',
    price: '35.000',
    location: 'Çankaya, Ankara',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=iPhone+13+Pro&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-16',
    views: 345,
    condition: 'İkinci El',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    year: '2022'
  },
  {
    id: 4,
    title: 'Xiaomi 13 Pro',
    price: '38.000',
    location: 'Karşıyaka, İzmir',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=Xiaomi+13+Pro&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-15',
    views: 234,
    condition: 'Yeni',
    brand: 'Xiaomi',
    model: '13 Pro',
    year: '2024'
  },
  {
    id: 5,
    title: 'Google Pixel 8 Pro',
    price: '40.000',
    location: 'Bornova, İzmir',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=Google+Pixel+8+Pro&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-14',
    views: 456,
    condition: 'Yeni',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    year: '2024'
  },
  {
    id: 6,
    title: 'OnePlus 11',
    price: '36.000',
    location: 'İzmir',
    image: 'https://placehold.co/600x400/1e293b/ffffff?text=OnePlus+11&font=roboto',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-13',
    views: 345,
    condition: 'İkinci El',
    brand: 'OnePlus',
    model: '11',
    year: '2023'
  }
];

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
          <p className="text-gray-600 mt-1">{listings.length} ilan bulundu</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/listing/${listing.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="relative h-48 bg-alo-light-blue">
                <Image
                  src={listing.image}
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
                  <span>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
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
                    {listing.favorites || 0} favori
                  </span>
                </div>
              </div>
            </Link>
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