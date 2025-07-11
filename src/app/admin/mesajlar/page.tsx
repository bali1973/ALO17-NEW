'use client';

import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Örnek mesaj verileri
const messages = [
  {
    id: 1,
    from: 'Ahmet Yılmaz',
    fromEmail: 'ahmet@example.com',
    to: 'Mehmet Demir',
    toEmail: 'mehmet@example.com',
    subject: 'BMW 320i hakkında',
    content: 'Aracınız hala satılık mı? Fiyatta pazarlık payı var mı?',
    listingTitle: '2019 Model BMW 320i',
    status: 'unread',
    createdAt: '2024-02-20T10:30:00',
    isSpam: false,
  },
  {
    id: 2,
    from: 'Ayşe Kaya',
    fromEmail: 'ayse@example.com',
    to: 'Fatma Özkan',
    toEmail: 'fatma@example.com',
    subject: 'MacBook Pro hakkında',
    content: 'Bilgisayarınızın teknik özelliklerini öğrenebilir miyim?',
    listingTitle: 'MacBook Pro 2023 - 16 inch',
    status: 'read',
    createdAt: '2024-02-19T15:45:00',
    isSpam: false,
  },
  {
    id: 3,
    from: 'spam@example.com',
    fromEmail: 'spam@example.com',
    to: 'Ahmet Yılmaz',
    toEmail: 'ahmet@example.com',
    subject: 'Kredi teklifi',
    content: 'Hızlı kredi alın, faizsiz ödeme seçenekleri...',
    listingTitle: 'Sahibinden Satılık Lüks Daire',
    status: 'unread',
    createdAt: '2024-02-18T09:15:00',
    isSpam: true,
  },
  {
    id: 4,
    from: 'Mehmet Demir',
    fromEmail: 'mehmet@example.com',
    to: 'Ahmet Yılmaz',
    toEmail: 'ahmet@example.com',
    subject: 'Daire hakkında',
    content: 'Daireyi görmek istiyorum, ne zaman müsait olursunuz?',
    listingTitle: 'Sahibinden Satılık Lüks Daire',
    status: 'read',
    createdAt: '2024-02-17T14:20:00',
    isSpam: false,
  },
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [spamFilter, setSpamFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const filteredMessages = messages
    .filter(message => {
      if (searchTerm && !message.subject.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !message.from.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !message.to.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'all' && message.status !== statusFilter) {
        return false;
      }
      if (spamFilter === 'spam' && !message.isSpam) {
        return false;
      }
      if (spamFilter === 'not-spam' && message.isSpam) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'subject':
          return a.subject.localeCompare(b.subject);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'from':
          return a.from.localeCompare(b.from);
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Okunmamış</span>;
      case 'read':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Okunmuş</span>;
      default:
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900">Mesaj Yönetimi</h1>
        <p className="mt-2 text-sm text-gray-700">
          Sistemdeki tüm mesajları görüntüleyin ve yönetin.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Toplam Mesaj</dt>
                  <dd className="text-lg font-medium text-gray-900">{messages.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-blue-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Okunmamış</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {messages.filter(m => m.status === 'unread').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-gray-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Okunmuş</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {messages.filter(m => m.status === 'read').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-6 w-6 bg-red-500 rounded"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Spam</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {messages.filter(m => m.isSpam).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Arama
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Konu, gönderen veya alıcı..."
                />
                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Durum
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Tümü</option>
                <option value="unread">Okunmamış</option>
                <option value="read">Okunmuş</option>
              </select>
            </div>

            {/* Spam Filter */}
            <div>
              <label htmlFor="spam" className="block text-sm font-medium text-gray-700">
                Spam
              </label>
              <select
                id="spam"
                value={spamFilter}
                onChange={(e) => setSpamFilter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Tümü</option>
                <option value="spam">Spam</option>
                <option value="not-spam">Spam Değil</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                Sıralama
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="createdAt">Tarih</option>
                <option value="subject">Konu</option>
                <option value="from">Gönderen</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mesaj
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gönderen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İlan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
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
                {filteredMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${message.isSpam ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{message.content}</div>
                          {message.isSpam && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 mt-1">
                              Spam
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{message.from}</div>
                      <div className="text-sm text-gray-500">{message.fromEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{message.to}</div>
                      <div className="text-sm text-gray-500">{message.toEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 line-clamp-2">{message.listingTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(message.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Sil"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Mesaj bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                Seçtiğiniz kriterlere uygun mesaj bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 