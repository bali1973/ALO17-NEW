'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Listing {
  _id: string;
  title: string;
  price: number;
  category: string;
  status: string;
  createdAt: string;
  user: {
    username: string;
  };
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      if (activeTab === 'users') {
        const response = await fetch('https://alo17-api.onrender.com/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Kullanıcılar yüklenirken bir hata oluştu');
        
        const data = await response.json();
        setUsers(data);
      } else {
        const response = await fetch('https://alo17-api.onrender.com/api/admin/listings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('İlanlar yüklenirken bir hata oluştu');
        
        const data = await response.json();
        setListings(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'delete' | 'changeRole') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://alo17-api.onrender.com/api/admin/users/${userId}`, {
        method: action === 'delete' ? 'DELETE' : 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: action === 'changeRole' ? JSON.stringify({ role: 'admin' }) : undefined
      });

      if (!response.ok) throw new Error('İşlem başarısız oldu');
      
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleListingAction = async (listingId: string, action: 'delete' | 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://alo17-api.onrender.com/api/admin/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
      });

      if (!response.ok) throw new Error('İşlem başarısız oldu');
      
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Kullanıcılar
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('listings')}
          >
            İlanlar
          </button>
        </div>

        {/* Content */}
        {activeTab === 'users' ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleUserAction(user._id, 'changeRole')}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Admin Yap
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user._id, 'delete')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₺{listing.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          listing.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {listing.status === 'approved'
                          ? 'Onaylandı'
                          : listing.status === 'rejected'
                          ? 'Reddedildi'
                          : 'Beklemede'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleListingAction(listing._id, 'approve')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => handleListingAction(listing._id, 'reject')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reddet
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleListingAction(listing._id, 'delete')}
                        className="text-red-600 hover:text-red-800"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 