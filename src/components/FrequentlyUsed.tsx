import { useEffect, useState } from 'react';
import { ListingCard } from './listing-card';

export function FrequentlyUsed({ allListings }: { allListings: any[] }) {
  const [freqIds, setFreqIds] = useState<string[]>([]);
  const [freqListings, setFreqListings] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ids = JSON.parse(localStorage.getItem('frequentlyUsed') || '[]');
      setFreqIds(ids);
    }
  }, []);

  useEffect(() => {
    if (freqIds.length > 0) {
      // Sıralı şekilde ilgili ilanları bul
      const found = freqIds
        .map(id => allListings.find(l => l.id == id))
        .filter(Boolean);
      setFreqListings(found);
    } else {
      setFreqListings([]);
    }
  }, [freqIds, allListings]);

  const handleClear = () => {
    setFreqIds([]);
    setFreqListings([]);
    localStorage.setItem('frequentlyUsed', '[]');
  };

  if (freqListings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-alo-dark">Sık Kullandıkların</h3>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs"
        >
          Temizle
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {freqListings.map((listing: any) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
} 