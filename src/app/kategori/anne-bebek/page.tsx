'use client'

import { FaBaby, FaBabyCarriage, FaGamepad, FaBed } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { ListingCard } from '@/components/listing-card'

export default function AnneBebekPage() {
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        const anneBebek = data.find((cat: any) => cat.slug === 'anne-bebek');
        setSubcategories(anneBebek?.subCategories || []);
      } catch (e) {
        setSubcategories([]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.category === 'anne-bebek' && (!selectedSubcategory || l.subcategory === selectedSubcategory)));
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, [selectedSubcategory]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Anne & Bebek İlanları</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-64 w-full mb-4 md:mb-0">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Alt Kategoriler</h2>
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  onClick={() => setSelectedSubcategory(null)}
                >Tümü</button>
              </li>
              {subcategories.map((s: any) => (
                <li key={s.slug}>
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                    onClick={() => setSelectedSubcategory(s.slug)}
                  >{s.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* İlanlar */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          {listings.length === 0 && <div className="text-center py-12">İlan bulunamadı.</div>}
        </main>
      </div>
    </div>
  );
} 