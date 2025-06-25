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
} from '@heroicons/react/24/outline';

// Örnek veri
const stats = {
  totalUsers: 1234,
  totalListings: 5678,
  activeListings: 4321,
  pendingListings: 1357,
  totalMessages: 8901,
  totalViews: 123456,
};

const recentListings = [
  {
    id: 1,
    title: 'Sahibinden Satılık Lüks Daire',
    user: 'Ahmet Yılmaz',
    status: 'pending',
    createdAt: '2024-02-20',
  },
  {
    id: 2,
    title: '2019 Model BMW 320i',
    user: 'Mehmet Demir',
    status: 'active',
    createdAt: '2024-02-19',
  },
  // Daha fazla örnek ilan eklenebilir
];

const recentUsers = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    joinedAt: '2024-02-20',
    listings: 5,
  },
  {
    id: 2,
    name: 'Mehmet Demir',
    email: 'mehmet@example.com',
    joinedAt: '2024-02-19',
    listings: 3,
  },
  // Daha fazla örnek kullanıcı eklenebilir
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
                        <p className="text-sm font-medium text-gray-500">Aktif İlan</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.activeListings}</p>
                      </div>
                      <div className="p-3 bg-green-500 bg-opacity-10 rounded-lg">
                        <ClipboardDocumentListIcon className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Toplam Görüntülenme</p>
                        <p className="text-2xl font-bold text-alo-dark">{stats.totalViews}</p>
                      </div>
                      <div className="p-3 bg-alo-red bg-opacity-10 rounded-lg">
                        <ChartBarIcon className="w-6 h-6 text-alo-red" />
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
                          <div>
                            <h3 className="font-medium text-alo-dark">{listing.title}</h3>
                            <p className="text-sm text-gray-500">
                              {listing.user} • {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
                            </p>
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
                          <div>
                            <h3 className="font-medium text-alo-dark">{user.name}</h3>
                            <p className="text-sm text-gray-500">
                              {user.email} • {new Date(user.joinedAt).toLocaleDateString('tr-TR')}
                            </p>
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

            {/* Diğer sekmeler için içerikler buraya eklenecek */}
            {activeTab !== 'dashboard' && (
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