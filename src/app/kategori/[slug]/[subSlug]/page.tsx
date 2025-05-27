'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FunnelIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Örnek veri
const listings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max 256GB',
    price: '45.000',
    location: 'Konak, İzmir',
    image: '/images/listing3.jpg',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-18',
    views: 567,
    condition: 'Yeni',
    brand: 'Apple',
    model: 'iPhone 14 Pro Max',
    year: '2024'
  },
  {
    id: 2,
    title: 'Samsung Galaxy S23 Ultra',
    price: '42.000',
    location: 'Kadıköy, İstanbul',
    image: '/images/listing4.jpg',
    category: 'Elektronik',
    subCategory: 'Telefon',
    createdAt: '2024-02-17',
    views: 432,
    condition: 'İkinci El',
    brand: 'Samsung',
    model: 'Galaxy S23 Ultra',
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${showFilters ? '3' : '4'} gap-6`}>
          {listings.map((listing) => (
            <Link
              key={listing.id}
              href={`/ilan/${listing.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={listing.image}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {listing.condition === 'Yeni' && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                    Yeni
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-alo-dark line-clamp-2 mb-2">{listing.title}</h3>
                <p className="text-xl font-bold text-alo-red mb-2">{listing.price} TL</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{listing.location}</span>
                  <span>{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{listing.brand}</span>
                  <span>{listing.model}</span>
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