'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '@/components/OptimizedImage';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  status: string;
  createdAt: string;
  images?: string[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminIlanlarPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'title' | 'category' | 'city' | 'user'>('title');

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(listing => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchField) {
          case 'title':
            return listing.title.toLowerCase().includes(searchValue);
          case 'category':
            return listing.category.toLowerCase().includes(searchValue);
          case 'city':
            return listing.city.toLowerCase().includes(searchValue);
          case 'user':
            return listing.user?.name?.toLowerCase().includes(searchValue) || 
                   listing.user?.email?.toLowerCase().includes(searchValue);
          default:
            return true;
        }
      });
      setFilteredListings(filtered);
    }
  }, [searchTerm, searchField, listings]);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      const data = await response.json();
      // API'den gelen veri bir object olabilir, listings array'ini al
      const listingsArray = Array.isArray(data) ? data : (data.listings || []);
      setListings(listingsArray);
      setFilteredListings(listingsArray);
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
      // Onaylama hatası
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
      // Reddetme hatası
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
      // Silme hatası
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
      
      {/* Arama Arayüzü */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Arama yapın..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as 'title' | 'category' | 'city' | 'user')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Başlık</option>
              <option value="category">Kategori</option>
              <option value="city">Şehir</option>
              <option value="user">Kullanıcı</option>
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilteredListings(listings);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Temizle
            </button>
          </div>
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            "{searchTerm}" için {filteredListings.length} sonuç bulundu
          </div>
        )}
      </div>
      
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
            {Array.isArray(filteredListings) && filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
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
                      <option value="onaylandı">Onaylandı</option>
                      <option value="rejected">Reddedildi</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs ${
                      listing.status === 'onaylandı' ? 'bg-green-100 text-green-800' :
                      listing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {listing.status === 'onaylandı' ? 'Onaylandı' :
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
            ))
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-gray-500">
                  Henüz ilan bulunmuyor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detay Modalı */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setSelectedListing(null)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">İlan Detayı</h2>
            
            {/* Resimler */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">İlan Resimleri</h3>
              {selectedListing.images && selectedListing.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedListing.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <OptimizedImage
                        src={image}
                        alt={`${selectedListing.title} - Resim ${index + 1}`}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
                          Resim {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Bu ilan için resim bulunmuyor</p>
                </div>
              )}
            </div>
            
            {/* İlan Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><strong>ID:</strong> {selectedListing.id}</div>
              <div><strong>Başlık:</strong> {selectedListing.title}</div>
              <div><strong>Kategori:</strong> {selectedListing.category}</div>
              <div><strong>Fiyat:</strong> {selectedListing.price} ₺</div>
              <div><strong>Şehir:</strong> {selectedListing.city}</div>
              <div><strong>Durum:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  selectedListing.status === 'onaylandı' ? 'bg-green-100 text-green-800' :
                  selectedListing.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedListing.status === 'onaylandı' ? 'Onaylandı' :
                   selectedListing.status === 'rejected' ? 'Reddedildi' : 'Beklemede'}
                </span>
              </div>
              <div><strong>Kullanıcı:</strong> {selectedListing.user?.name || 'Bilinmiyor'}</div>
              <div><strong>Email:</strong> {selectedListing.user?.email || 'Bilinmiyor'}</div>
              <div><strong>Tarih:</strong> {new Date(selectedListing.createdAt).toLocaleDateString('tr-TR')}</div>
              <div className="md:col-span-2">
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
