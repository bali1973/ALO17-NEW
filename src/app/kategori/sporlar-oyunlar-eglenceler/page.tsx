"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryLayout from '@/components/CategoryLayout';
import { Listing } from '@/types';
import { useCategories } from '@/lib/useCategories';

export default function SporlarOyunlarEglencelerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();

  // Ana kategoriyi ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'sporlar-oyunlar-eglenceler');
  const subcategories = mainCategory?.subCategories || [];

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((listing: Listing) => listing.category === 'sporlar-oyunlar-eglenceler'));
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

  if (categoriesLoading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <CategoryLayout
      subcategories={subcategories}
      activeSlug=""
      categoryBasePath="sporlar-oyunlar-eglenceler"
      city={city}
      onCityChange={setCity}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      premiumOnly={premiumOnly}
      onPremiumOnlyChange={setPremiumOnly}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </CategoryLayout>
  );
} 