'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  CreditCardIcon,
  EyeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import Link from "next/link";

// Örnek veri
const stats = {
  totalUsers: 0,
  totalListings: 0,
  activeListings: 0,
  pendingListings: 0,
  totalMessages: 0,
  totalViews: 0,
  premiumUsers: 0,
  premiumListings: 0,
  premiumRevenue: 0,
};

const pendingListings: any[] = [];

const recentListings: any[] = [];

const recentUsers: any[] = [];

// Premium özellikler tanımları

export default function AdminDashboard() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  // Admin kontrolü
  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push('/giris');
      return;
    }

    if (session?.user) {
      const userRole = session.user.role;
      
      if (userRole !== 'admin') {
        router.push('/');
        return;
      }
    }
  }, [isLoading, session, router]);

  // Loading durumu
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Admin paneli yükleniyor...</p>
          <p className="text-xs text-gray-500 mt-2">Yetki kontrol ediliyor</p>
        </div>
      </div>
    );
  }

  // Admin değilse veya giriş yapmamışsa boş div döndür
  if (!session || session.user.role !== 'admin') {
    return <div></div>;
  }

  const handleApproveListing = async (listingId: number) => {
    try {
      const response = await fetch(`/api/listings/${listingId}/approve`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Başarılı - sayfayı yenile
        window.location.reload();
      }
    } catch (error) {
      // İlan onaylama hatası
    }
  };

  const handleRejectListing = async (listingId: number) => {
    try {
      const response = await fetch(`/api/listings/${listingId}/reject`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Başarılı - sayfayı yenile
        window.location.reload();
      }
    } catch (error) {
      // İlan reddetme hatası
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-gray-200 pb-5">
            <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
            <p className="mt-2 text-sm text-gray-700">
              Platform genel durumu ve istatistikler
            </p>
            
            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/admin/oauth-settings"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                OAuth Ayarları
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Toplam Kullanıcı</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers.toLocaleString('tr-TR')}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Toplam İlan</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalListings.toLocaleString('tr-TR')}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Toplam Mesaj</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalMessages.toLocaleString('tr-TR')}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Premium Gelir</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.premiumRevenue.toLocaleString('tr-TR')} ₺</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Listings - Hidden since no listings */}
          {pendingListings.length > 0 && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bekleyen İlanlar</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İlan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">Resim</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                                <div className="text-sm text-gray-500">{listing.description}</div>
                                {listing.isPremium && (
                                  <div className="flex items-center mt-1">
                                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                                    <span className="text-xs text-yellow-600">Premium</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {listing.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {listing.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {parseInt(listing.price).toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApproveListing(listing.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Onayla"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectListing(listing.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reddet"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900" title="Görüntüle">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Listings - Hidden since no listings */}
            {recentListings.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Son İlanlar</h3>
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                              <ClipboardDocumentListIcon className="h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                            <p className="text-sm text-gray-500">{listing.user}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {listing.isPremium && (
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Users - Hidden since no users */}
            {recentUsers.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Son Kullanıcılar</h3>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {user.isPremium && (
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(user.joinedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
