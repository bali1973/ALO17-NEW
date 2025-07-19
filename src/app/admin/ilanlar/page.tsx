'use client';

import React, { useEffect, useState } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  lastActionBy?: { id: string; name: string; role: string };
  lastActionType?: string;
  lastActionAt?: string;
  history?: Array<{
    action: string;
    by: { id: string; name: string; role: string };
    at: string;
  }>;
}

function HistoryModal({ history, onClose }: { history: Listing['history'], onClose: () => void }) {
  if (!history || history.length === 0) return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">İşlem Geçmişi</h2>
        <div>İşlem geçmişi yok.</div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">İşlem Geçmişi</h2>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="text-left">İşlem</th>
              <th className="text-left">Yapan</th>
              <th className="text-left">Rol</th>
              <th className="text-left">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{h.action}</td>
                <td>{h.by?.name || '-'}</td>
                <td>{h.by?.role || '-'}</td>
                <td>{h.at ? new Date(h.at).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
      </div>
    </div>
  );
}

export default function AdminIlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [selectedHistory, setSelectedHistory] = useState<Listing['history'] | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => {
        setError('İlanlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setListings(listings => listings.filter(l => l.id !== id));
    } else {
      alert('İlan silinemedi!');
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditId(listing.id);
    setEditTitle(listing.title);
    setEditPrice(listing.price);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    const res = await fetch(`/api/listings/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, price: editPrice })
    });
    if (res.ok) {
      setListings(listings => listings.map(l => l.id === editId ? { ...l, title: editTitle, price: editPrice } : l));
      setEditId(null);
    } else {
      alert('İlan güncellenemedi!');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">İlanlar</h1>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Başlık</th>
              <th className="py-2 px-4 text-left">Fiyat</th>
              <th className="py-2 px-4 text-left">Durum</th>
              <th className="py-2 px-4 text-left">Son İşlem</th>
              <th className="py-2 px-4 text-left">İşlem Geçmişi</th>
              <th className="py-2 px-4 text-left min-w-[220px]">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.id} className="border-t">
                <td className="py-2 px-4">{listing.id}</td>
                <td className="py-2 px-4">
                  {editId === listing.id ? (
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border px-2 py-1 rounded" />
                  ) : (
                    listing.title
                  )}
                </td>
                <td className="py-2 px-4">
                  {editId === listing.id ? (
                    <input type="number" value={editPrice} onChange={e => setEditPrice(Number(e.target.value))} className="border px-2 py-1 rounded w-24" />
                  ) : (
                    listing.price
                  )}
                </td>
                <td className="py-2 px-4">{listing.status}</td>
                <td className="py-2 px-4 text-xs">
                  {listing.lastActionBy ? (
                    <>
                      <div>{listing.lastActionBy.name} ({listing.lastActionBy.role})</div>
                      <div>{listing.lastActionType} - {listing.lastActionAt ? new Date(listing.lastActionAt).toLocaleString() : '-'}</div>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <button onClick={() => setSelectedHistory(listing.history || [])} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300">Geçmiş</button>
                </td>
                <td className="py-2 px-4">
                  {editId === listing.id ? (
                    <>
                      <button onClick={handleEditSave} className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">Kaydet</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm">İptal</button>
                    </>
                  ) : (
                    <div className="flex flex-row gap-2 items-center">
                      <button onClick={() => handleEdit(listing)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Düzenle</button>
                      <a href={`/ilan/${listing.id}`} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-2 py-1 rounded text-sm">İlanı Gör</a>
                      <button onClick={() => handleDelete(listing.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Sil</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedHistory !== null && <HistoryModal history={selectedHistory} onClose={() => setSelectedHistory(null)} />}
    </div>
  );
} 