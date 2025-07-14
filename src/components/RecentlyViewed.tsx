import { useEffect, useState } from 'react';
import { ListingCard } from './listing-card';

export function RecentlyViewed({ allListings }: { allListings: any[] }) {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        setRecentIds(ids);
      } catch (e) {
        setRecentIds([]);
        // Hata mesajı göstermek için opsiyonel olarak toast eklenebilir
      }
    }
  }, []);

  useEffect(() => {
    if (recentIds.length > 0) {
      // Sıralı şekilde ilgili ilanları bul
      const found = recentIds
        .map(id => allListings.find(l => l.id == id))
        .filter(Boolean);
      setRecentListings(found);
    } else {
      setRecentListings([]);
    }
  }, [recentIds, allListings]);

  const handleClear = () => {
    setRecentIds([]);
    setRecentListings([]);
    localStorage.setItem('recentlyViewed', '[]');
  };

  if (recentListings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-alo-dark">Son Baktıkların</h3>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
        >
          Temizle
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentListings.map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
} 