import ListingDetail from './ListingDetail';
import { useEffect, useState } from 'react';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [ilan, setIlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/listings/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('İlan bulunamadı');
        return res.json();
      })
      .then(data => {
        setIlan(data);
        setLoading(false);
      })
      .catch(() => {
        setError('İlan bulunamadı');
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!ilan) return <div>İlan bulunamadı.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{ilan.title}</h1>
      <div className="text-lg text-gray-700">Fiyat: {ilan.price}</div>
      <div className="text-gray-500 mt-4">{ilan.description}</div>
      {/* Diğer alanlar */}
    </div>
  );
}

// Statik export için generateStaticParams fonksiyonu
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 