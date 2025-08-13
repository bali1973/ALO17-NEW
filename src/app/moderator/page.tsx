'use client';

import React, { useState, useEffect } from 'react';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ModeratorPage() {
  
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingListings = async () => {
      try {
        setLoading(true);
        // TODO: Implement actual API call to fetch pending listings
        // For now, simulate with a dummy data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPendingListings([
          { id: 1, title: 'Listing 1', description: 'Description for Listing 1', status: 'pending' },
          { id: 2, title: 'Listing 2', description: 'Description for Listing 2', status: 'pending' },
          { id: 3, title: 'Listing 3', description: 'Description for Listing 3', status: 'pending' },
        ]);
      } catch (error) {
        console.error('Error fetching pending listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingListings();
    const interval = setInterval(fetchPendingListings, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-8">&quot;Yükleniyor...&quot;</div>;
  }

  if (pendingListings.length === 0) {
    return <div className="text-center py-8">&quot;Bekleyen ilan bulunamadı&quot;</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">&quot;Moderatör Paneli&quot;</h1>
      <h2 className="text-xl font-semibold mb-4">&quot;Bekleyen İlanlar&quot;</h2>
      <div className="grid gap-4">
        {pendingListings.map((listing) => (
          <div key={listing.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">{listing.title}</h3>
            <p className="text-sm text-gray-800 mb-2">{listing.description}</p>
            <p className="text-sm text-gray-600">Status: {listing.status}</p>
            <div className="flex items-center mt-4 text-green-600">
              <CheckCircle className="mr-2" />
              &quot;Onayla&quot;
            </div>
            <div className="flex items-center mt-2 text-red-600">
              <XCircle className="mr-2" />
              &quot;Reddet&quot;
            </div>
            <div className="flex items-center mt-2 text-yellow-600">
              <AlertTriangle className="mr-2" />
              &quot;Düzenle&quot;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
