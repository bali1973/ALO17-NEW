'use client';

import React, { useState, useEffect } from 'react';

import { Sparkles, Clock, Eye, Heart, Star } from 'lucide-react';

export default function YeniUrunlerPage() {
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Simulate fetching listings
        await new Promise(resolve => setTimeout(resolve, 1000));
        setListings([
          { id: 1, name: 'Yeni Ürün 1', price: 1299.99, imageUrl: '/images/product1.jpg' },
          { id: 2, name: 'Yeni Ürün 2', price: 1599.99, imageUrl: '/images/product2.jpg' },
          { id: 3, name: 'Yeni Ürün 3', price: 1899.99, imageUrl: '/images/product3.jpg' },
          { id: 4, name: 'Yeni Ürün 4', price: 2199.99, imageUrl: '/images/product4.jpg' },
        ]);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Ürünler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">{listing.name}</h2>
            <p className="text-gray-600 mb-2">{listing.price} TL</p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sepete Ekle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
