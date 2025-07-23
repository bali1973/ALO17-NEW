'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminIlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    city: '',
    status: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (err) {
      setError('İlanlar yüklenemedi');
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}/approve`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchListings();
      }
    } catch (error) {
      console.error('Onaylama hatası:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchListings();
      }
    } catch (error) {
      console.error('Reddetme hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/admin/listings/${id}/delete`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchListings();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleEdit = (listing: Listing) => {
    setEditMode(listing.id);
    setEditData({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      city: listing.city,
      status: listing.status
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/listings/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        setEditMode(null);
        fetchListings();
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  if (loading) return <div className="text-center py-8">Yükleniyor...</div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">İlan Yönetimi</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Başlık</th>
              <th className="py-3 px-4 text-left">Kategori</th>
              <th className="py-3 px-4 text-left">Fiyat</th>
              <th className="py-3 px-4 text-left">Şehir</th>
              <th className="py-3 px-4 text-left">Durum</th>
              <th className="py-3 px-4 text-left">Kullanıcı</th>
              <th className="py-3 px-4 text-left">Tarih</th>
              <th className="py-3 px-4 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">{listing.id}</td>
                <td className="py-3 px-4">
                  {editMode === listing.id ? (
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    listing.title
                  )}
                </td>
                <td className="py-3 px-4">
                  {editMode === listing.id ? (
                    <input
                      type="text"
                      value={editData.category}
                      onChange={(e) => setEditData({...editData, category: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    listing.category
                  )}
                </td>
                <td className="py-3 px-4">
                  {editMode === listing.id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({...editData, price: Number(e.target.value)})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    `${listing.price} ₺`
                  )}
                </td>
                <td className="py-3 px-4">
                  {editMode === listing.id ? (
                    <input
                      type="text"
                      value={editData.city}
                      onChange={(e) => setEditData({...editData, city: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    listing.city
                  )}
                </td>
                <td className="py-3 px-4">
                  {editMode === listing.id ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="pending">Beklemede</option>
                      <option value="approved">Onaylandı</option>
                      <option value="rejected">Reddedildi</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs ${
                      listing.status === 'approved' ? 'bg-green-100 text-green-800' :
                      listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status === 'approved' ? 'Onaylandı' :
                       listing.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">{listing.user?.name || 'Bilinmiyor'}</td>
                <td className="py-3 px-4">{new Date(listing.createdAt).toLocaleDateString('tr-TR')}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    {editMode === listing.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(listing.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Kaydet"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                          title="İptal"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(listing)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {listing.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(listing.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Onayla"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(listing.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Reddet"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedListing(listing)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Detay"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detay Modalı */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button 
              onClick={() => setSelectedListing(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">İlan Detayı</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>ID:</strong> {selectedListing.id}</div>
              <div><strong>Başlık:</strong> {selectedListing.title}</div>
              <div><strong>Kategori:</strong> {selectedListing.category}</div>
              <div><strong>Fiyat:</strong> {selectedListing.price} ₺</div>
              <div><strong>Şehir:</strong> {selectedListing.city}</div>
              <div><strong>Durum:</strong> {selectedListing.status}</div>
              <div><strong>Kullanıcı:</strong> {selectedListing.user?.name}</div>
              <div><strong>Email:</strong> {selectedListing.user?.email}</div>
              <div className="col-span-2">
                <strong>Açıklama:</strong>
                <div className="bg-gray-100 rounded p-3 mt-1">
                  {selectedListing.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 