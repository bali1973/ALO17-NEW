"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryFilters from '@/components/CategoryFilters';
import { Listing } from '@/types';

const subcategories = [
  { slug: 'erkek-giyim', name: 'Erkek Giyim' },
  { slug: 'bayan-giyim', name: 'Bayan Giyim' },
  { slug: 'cocuk-giyim', name: 'Çocuk Giyim' },
  { slug: 'ayakkabi', name: 'Ayakkabı' },
  { slug: 'aksesuar', name: 'Aksesuar' },
];

export default function GiyimPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((listing: Listing) => listing.category === 'giyim'));
      });
  }, []);

  const filteredListings = listings.filter((listing: Listing) => {
    if (city && listing.city !== city) return false;
    if (premiumOnly && !listing.isPremium) return false;
    if (priceRange) {
      const price = Number(listing.price);
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (price < min || price > max)) return false;
      if (!max && price < min) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giyim</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Sidebar - Filtreler ve Alt Kategoriler */}
        <div className="lg:w-1/4">
          {/* Alt Kategoriler */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
            <ul className="space-y-2">
              {subcategories.map((subcat) => (
                <li key={subcat.slug}>
                  <Link
                    href={`/kategori/giyim/${subcat.slug}`}
                    className="block px-3 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Filtreler */}
          <CategoryFilters
            city={city}
            onCityChange={setCity}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            premiumOnly={premiumOnly}
            onPremiumOnlyChange={setPremiumOnly}
          />
        </div>

        {/* Sağ Taraf - İlanlar Grid */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing: Listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
                  <Link href={`/listing/${listing.id}`}>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={listing.images?.[0] || '/placeholder.png'}
                        alt={listing.title}
                        className="object-cover w-full h-full rounded"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                    <p className="text-gray-600">{listing.price} TL</p>
                    <p className="text-sm text-gray-500 mt-2">{listing.city}</p>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Bu kategoride ilan bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 