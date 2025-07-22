"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryFilters from '@/components/CategoryFilters';
import { Listing } from '@/types';

export default function BilgisayarKurslariPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((listing: Listing) => 
          listing.category === 'egitim-kurslar' && listing.subCategory === 'bilgisayar-kurslari'
        ));
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
      <h1 className="text-3xl font-bold mb-8">Bilgisayar Kursları</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sol Sidebar - Filtreler */}
        <div className="lg:w-1/4">
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