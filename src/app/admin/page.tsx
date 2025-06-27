'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  StarIcon,
  SparklesIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Örnek veri
const stats = {
  totalUsers: 1234,
  totalListings: 5678,
  activeListings: 4321,
  pendingListings: 1357,
  totalMessages: 8901,
  totalViews: 123456,
  premiumUsers: 89,
  premiumListings: 234,
  premiumRevenue: 45600,
};

const recentListings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire',
    user: 'Ahmet Yılmaz',
    status: 'pending',
    createdAt: '2024-02-20',
    isPremium: true,
    premiumFeatures: ['featured', 'urgent', 'highlighted'],
  },
  {
    id: 2,
    title: '2019 Model BMW 320i',
    user: 'Mehmet Demir',
    status: 'active',
    createdAt: '2024-02-19',
    isPremium: false,
    premiumFeatures: [],
  },
  {
    id: 3,
    title: 'iPhone 14 Pro Max - Yeni',
    user: 'Ayşe Kaya',
    status: 'active',
    createdAt: '2024-02-18',
    isPremium: true,
    premiumFeatures: ['featured', 'highlighted'],
  },
];

const recentUsers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    joinedAt: '2024-02-20',
    listings: 5,
    isPremium: true,
    premiumUntil: '2024-12-31',
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    joinedAt: '2024-02-19',
    listings: 3,
    isPremium: false,
    premiumUntil: null,
  },
  {
    id: 3,
    name: 'Ayşe Kaya',
    email: 'ayse@example.com',
    joinedAt: '2024-02-18',
    listings: 8,
    isPremium: true,
    premiumUntil: '2024-08-15',
  },
];

const premiumFeatures = [
  { id: 'featured', name: 'Öne Çıkan İlan', price: 50, description: 'İlanınız ana sayfada öne çıkarılır' },
  { id: 'urgent', name: 'Acil İlan', price: 30, description: 'İlanınız acil olarak işaretlenir' },
  { id: 'highlighted', name: 'Vurgulanmış İlan', price: 25, description: 'İlanınız renkli çerçeve ile vurgulanır' },
  { id: 'top', name: 'Üst Sıralarda', price: 40, description: 'İlanınız kategoride üst sıralarda görünür' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-alo-light">
      {/* Üst Menü */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-alo-dark">
                ALO17 Admin
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-alo-orange focus:border-alo-orange"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button className="p-2 text-gray-500 hover:text-alo-orange relative">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-alo-red rounded-full"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-alo-orange text-white flex items-center justify-center">
                  A
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Sol Menü */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'dashboard'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <HomeIcon className="w-5 h-5 mr-3" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'users'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UserGroupIcon className="w-5 h-5 mr-3" />
                  Kullanıcılar
                </button>
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'listings'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />
                  İlanlar
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'premium'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <SparklesIcon className="w-5 h-5 mr-3" />
                  Premium
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'messages'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-3" />
                  Mesajlar
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'reports'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChartBarIcon className="w-5 h-5 mr-3" />
                  Raporlar
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg ${
                    activeTab === 'settings'
                      ? 'bg-alo-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Cog6ToothIcon className="w-5 h-5 mr-3" />
                  Ayarlar
                </button>
              </nav>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="lg:col-span-5">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.totalUsers}</p>
                      </div>
                      <div className="p-3 bg-alo-light-blue bg-opacity-10 rounded-lg">
                        <UserGroupIcon className="w-6 h-6 text-alo-light-blue" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Toplam İlan</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.totalListings}</p>
                      </div>
                      <div className="p-3 bg-alo-orange bg-opacity-10 rounded-lg">
                        <ClipboardDocumentListIcon className="w-6 h-6 text-alo-orange" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Premium Kullanıcı</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.premiumUsers}</p>
                      </div>
                      <div className="p-3 bg-yellow-500 bg-opacity-10 rounded-lg">
                        <SparklesIcon className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Premium Gelir</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.premiumRevenue.toLocaleString()} ₺</p>
                      </div>
                      <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                        <CreditCardIcon className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Son İlanlar */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-alo-dark">Son İlanlar</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-alo-dark">{listing.title}</h3>
                              {listing.isPremium && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <SparklesIcon className="w-3 h-3 mr-1" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {listing.user} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            {listing.isPremium && listing.premiumFeatures.length > 0 && (
                              <div className="flex space-x-2 mt-2">
                                {listing.premiumFeatures.map((feature) => (
                                  <span key={feature} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {feature === 'featured' && 'Öne Çıkan'}
                                    {feature === 'urgent' && 'Acil'}
                                    {feature === 'highlighted' && 'Vurgulanmış'}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {listing.status === 'active' ? 'Aktif' : 'Onay Bekliyor'}
                            </span>
                            <button className="text-gray-500 hover:text-alo-orange">
                              <ClipboardDocumentListIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Son Kullanıcılar */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-alo-dark">Son Kullanıcılar</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-alo-dark">{user.name}</h3>
                              {user.isPremium && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <SparklesIcon className="w-3 h-3 mr-1" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {user.email} • {new Date(user.joinedAt).toLocaleDateString('tr-TR')}
                            </p>
                            {user.isPremium && user.premiumUntil && (
                              <p className="text-xs text-gray-400 mt-1">
                                Premium: {new Date(user.premiumUntil).toLocaleDateString('tr-TR')} tarihine kadar
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{user.listings} ilan</span>
                            <button className="text-gray-500 hover:text-alo-orange">
                              <UserGroupIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Premium Yönetimi */}
            {activeTab === 'premium' && (
              <div className="space-y-6">
                {/* Premium İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Premium Kullanıcı</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.premiumUsers}</p>
                      </div>
                      <div className="p-3 bg-yellow-500 bg-opacity-10 rounded-lg">
                        <SparklesIcon className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Premium İlan</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.premiumListings}</p>
                      </div>
                      <div className="p-3 bg-yellow-500 bg-opacity-10 rounded-lg">
                        <StarIcon className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Aylık Gelir</p>
                        <p className="text-2xl font-bold text-green-600">{stats.premiumRevenue.toLocaleString()} ₺</p>
                      </div>
                      <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                        <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium Özellikler */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-alo-dark">Premium Özellikler</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {premiumFeatures.map((feature) => (
                        <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-alo-dark">{feature.name}</h3>
                            <span className="text-lg font-bold text-green-600">{feature.price} ₺</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-alo-orange text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                              Düzenle
                            </button>
                            <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                              Detaylar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Premium Kullanıcılar Listesi */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-alo-dark">Premium Kullanıcılar</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {recentUsers.filter(user => user.isPremium).map((user) => (
                      <div key={user.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-alo-dark">{user.name}</h3>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <SparklesIcon className="w-3 h-3 mr-1" />
                                Premium
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            {user.premiumUntil && (
                              <p className="text-xs text-gray-400">
                                Premium Bitiş: {new Date(user.premiumUntil).toLocaleDateString('tr-TR')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">{user.listings} ilan</span>
                            <button className="text-gray-500 hover:text-alo-orange">
                              <SparklesIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Diğer sekmeler için içerikler */}
            {activeTab !== 'dashboard' && activeTab !== 'premium' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-alo-dark mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <p className="text-gray-500">Bu bölüm yapım aşamasındadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 