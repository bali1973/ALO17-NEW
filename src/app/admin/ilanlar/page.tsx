'use client';

import React, { useEffect, useState } from 'react';
import { CheckIcon, XMarkIcon, EyeIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import OptimizedImage from '@/components/OptimizedImage';
import { PREMIUM_PLANS } from '@/lib/premium-plans';

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
  isPremium?: boolean;
  premiumFeatures?: string;
  premiumUntil?: string;
  premiumPlan?: string;
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
  const [premiumFilter, setPremiumFilter] = useState<'all' | 'premium' | 'normal'>('all');
  const [premiumModal, setPremiumModal] = useState<{ show: boolean; listing: Listing | null }>({ show: false, listing: null });
  const [premiumData, setPremiumData] = useState({
    isPremium: false,
    premiumPlan: '',
    premiumFeatures: '',
    premiumDays: 30
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    let filtered = listings;
    
    // Metin araması
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(listing => {
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
    }
    
    // Premium filtresi
    if (premiumFilter !== 'all') {
      filtered = filtered.filter(listing => {
        if (premiumFilter === 'premium') {
          return listing.isPremium === true;
        } else {
          return listing.isPremium !== true;
        }
      });
    }
    
    setFilteredListings(filtered);
  }, [searchTerm, searchField, premiumFilter, listings]);

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

  const handlePremiumToggle = (listing: Listing) => {
    setPremiumModal({ show: true, listing });
    setPremiumData({
      isPremium: listing.isPremium || false,
      premiumPlan: listing.premiumPlan || '',
      premiumFeatures: listing.premiumFeatures || '',
      premiumDays: 30
    });
  };

  const handleSavePremium = async () => {
    if (!premiumModal.listing) return;
    
    try {
      const premiumUntil = premiumData.isPremium 
        ? new Date(Date.now() + premiumData.premiumDays * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const response = await fetch(`/api/admin/listings/${premiumModal.listing.id}/premium`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPremium: premiumData.isPremium,
          premiumPlan: premiumData.premiumPlan,
          premiumFeatures: premiumData.premiumFeatures,
          premiumUntil: premiumUntil
        }),
      });
      
      if (response.ok) {
        setPremiumModal({ show: false, listing: null });
        fetchListings();
      }
    } catch (error) {
      console.error('Premium güncelleme hatası:', error);
    }
  };

  const handleClosePremiumModal = () => {
    setPremiumModal({ show: false, listing: null });
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
                setPremiumFilter('all');
                setFilteredListings(listings);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Temizle
            </button>
          </div>
          
          {/* Premium Filtresi */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Premium Durumu</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="premiumFilter"
                  value="all"
                  checked={premiumFilter === 'all'}
                  onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'premium' | 'normal')}
                  className="mr-2"
                />
                Tümü
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="premiumFilter"
                  value="premium"
                  checked={premiumFilter === 'premium'}
                  onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'premium' | 'normal')}
                  className="mr-2"
                />
                Premium
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="premiumFilter"
                  value="normal"
                  checked={premiumFilter === 'normal'}
                  onChange={(e) => setPremiumFilter(e.target.value as 'all' | 'premium' | 'normal')}
                  className="mr-2"
                />
                Normal
              </label>
            </div>
          </div>
        </div>
        {(searchTerm || premiumFilter !== 'all') && (
          <div className="mt-2 text-sm text-gray-600">
            {searchTerm && `"${searchTerm}" için `}
            {premiumFilter !== 'all' && `${premiumFilter === 'premium' ? 'Premium' : 'Normal'} ilanlar için `}
            {filteredListings.length} sonuç bulundu
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
              <th className="py-3 px-4 text-left">Premium</th>
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
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {listing.isPremium ? (
                      <span className="flex items-center text-yellow-600">
                        <StarIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs">Premium</span>
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Normal</span>
                    )}
                    {listing.premiumUntil && listing.isPremium && (
                      <span className="text-xs text-gray-500">
                        {new Date(listing.premiumUntil).toLocaleDateString('tr-TR')}
                      </span>
                    )}
                  </div>
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
                          onClick={() => handlePremiumToggle(listing)}
                          className={`${listing.isPremium ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'}`}
                          title={listing.isPremium ? 'Premium Ayarları' : 'Premium Yap'}
                        >
                          <StarIcon className="h-4 w-4" />
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
                <td colSpan={10} className="py-8 text-center text-gray-500">
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
              <div><strong>Premium:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  selectedListing.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedListing.isPremium ? 'Premium' : 'Normal'}
                </span>
              </div>
              {selectedListing.isPremium && (
                <>
                  <div><strong>Premium Plan:</strong> {selectedListing.premiumPlan || 'Belirtilmemiş'}</div>
                  <div><strong>Premium Bitiş:</strong> {selectedListing.premiumUntil ? new Date(selectedListing.premiumUntil).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</div>
                  {selectedListing.premiumFeatures && (
                    <div className="md:col-span-2">
                      <strong>Premium Özellikler:</strong>
                      <div className="bg-gray-100 rounded p-3 mt-1">
                        {selectedListing.premiumFeatures}
                      </div>
                    </div>
                  )}
                </>
              )}
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

      {/* Premium Modal */}
      {premiumModal.show && premiumModal.listing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                Premium Ayarları
              </h2>
              <button 
                onClick={handleClosePremiumModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">{premiumModal.listing.title}</h3>
              <p className="text-sm text-gray-500">İlan premium durumunu yönetin</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={premiumData.isPremium}
                  onChange={(e) => setPremiumData({...premiumData, isPremium: e.target.checked})}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                  Premium İlan
                </label>
              </div>

              {premiumData.isPremium && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Plan
                    </label>
                    <select
                      value={premiumData.premiumPlan}
                      onChange={(e) => setPremiumData({...premiumData, premiumPlan: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">Plan Seçin</option>
                      <option value="basic">Temel Premium</option>
                      <option value="standard">Standart Premium</option>
                      <option value="premium">Premium</option>
                      <option value="vip">VIP Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Özellikler
                    </label>
                    <textarea
                      value={premiumData.premiumFeatures}
                      onChange={(e) => setPremiumData({...premiumData, premiumFeatures: e.target.value})}
                      placeholder="Özel özellikler, öne çıkarma, vb."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Premium Süresi (Gün)
                    </label>
                    <input
                      type="number"
                      value={premiumData.premiumDays}
                      onChange={(e) => setPremiumData({...premiumData, premiumDays: parseInt(e.target.value) || 30})}
                      min="1"
                      max="365"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSavePremium}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Kaydet
              </button>
              <button
                onClick={handleClosePremiumModal}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
