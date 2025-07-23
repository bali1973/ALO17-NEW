"use client";

import React, { useEffect, useState } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import { Listing } from '@/types';
import { useCategories } from '@/lib/useCategories';

export default function YemekIcecekPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();

  // Ana kategoriyi ve alt kategorileri bul
  const mainCategory = categories.find(cat => cat.slug === 'yemek-icecek');
  const subcategories = mainCategory?.subCategories || [];

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((listing: Listing) => listing.category === 'yemek-icecek'));
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
      categoryBasePath="kategori/yemek-icecek"
      city={city}
      onCityChange={setCity}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      premiumOnly={premiumOnly}
      onPremiumOnlyChange={setPremiumOnly}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yemek & İçecek</h1>
        <p className="text-gray-600 mt-2">
          Restoranlar, kafeler, pastaneler ve yemek hizmetleri
        </p>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Henüz İlan Bulunmuyor</h3>
          <p className="text-gray-600 mb-6">Bu kategoride henüz ilan bulunmuyor. İlk ilanı siz verin!</p>
          <a
            href="/ilan-ver"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Ücretsiz İlan Ver
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">{listing.price} ₺</span>
                  <span className="text-sm text-gray-500">{listing.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CategoryLayout>
  );
} 