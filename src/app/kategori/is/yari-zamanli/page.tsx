'use client'

import { FaClock, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaBuilding, FaUsers, FaStar, FaCheckCircle, FaGraduationCap } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Sparkles, Star, Clock, TrendingUp } from 'lucide-react'

export default function YariZamanliPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'is' && l.type === 'Yarı Zamanlı'));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Yarı Zamanlı İş İlanları</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(listing => (
          <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">{listing.title}</h2>
            <div className="text-gray-600 mb-1">{listing.location}</div>
            <div className="text-gray-800 font-bold mb-2">{listing.price} TL</div>
            {/* Diğer alanlar */}
          </div>
        ))}
      </div>
      {listings.length === 0 && <div className="text-center py-12">İlan bulunamadı.</div>}
    </div>
  );
} 