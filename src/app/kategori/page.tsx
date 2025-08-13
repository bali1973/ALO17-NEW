'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Filter, Search, Eye, Heart } from 'lucide-react';

export default function KategoriPage() {
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Simulate fetching listings
        await new Promise(resolve => setTimeout(resolve, 1000));
        setListings([
          { id: 1, name: 'Product 1', price: 100, image: 'https://via.placeholder.com/150' },
          { id: 2, name: 'Product 2', price: 200, image: 'https://via.placeholder.com/150' },
          { id: 3, name: 'Product 3', price: 300, image: 'https://via.placeholder.com/150' },
        ]);
      } catch (error) {
        // Error handling
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kategoriler</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Filter className="mr-2" />
          <span>Filtrele</span>
        </div>
        <div className="flex items-center">
          <Search className="mr-2" />
          <span>Ara</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white p-4 rounded-lg shadow-md">
            <Image src={listing.image} alt={listing.name} width={150} height={160} className="w-full h-40 object-cover mb-2 rounded-md" />
            <h3 className="text-lg font-semibold mb-1">{listing.name}</h3>
            <p className="text-gray-800 mb-2">{listing.price} TL</p>
            <div className="flex items-center text-gray-600 text-sm">
              <Eye className="mr-1" />
              <span>Görüntülenme</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm mt-2">
              <Heart className="mr-1" />
              <span>Beğeni</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
