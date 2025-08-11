"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, CheckCircle, X, Calendar, AlertCircle, Edit, ExternalLink, User, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Report {
  id: string;
  type: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  listingId?: string;
  listingTitle?: string;
  reportedUserEmail?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    category: string;
    subcategory?: string;
    location: string;
    status: string;
    createdAt: string;
  };
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export default function AdminRaporlarPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtreleme ve arama state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/raporlar');
      if (response.ok) {
        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } else {
        setError('Raporlar yüklenemedi');
      }
    } catch (error) {
      setError('Raporlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Filtreleme fonksiyonu
  useEffect(() => {
    let filtered = reports;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.listingTitle && report.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Tür filtresi
    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    // Öncelik filtresi
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    // Tarih filtresi
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(report => {
            const reportDate = new Date(report.createdAt);
            return reportDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(report => new Date(report.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(report => new Date(report.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, typeFilter, priorityFilter, dateFilter]);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleViewListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      if (response.ok) {
        const listing = await response.json();
        setSelectedListing(listing);
        setShowListingModal(true);
      }
    } catch (error) {
      console.error('İlan detayları yüklenemedi:', error);
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/raporlar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });

      if (response.ok) {
        await fetchReports(); // Listeyi yenile
        alert('Rapor durumu güncellendi!');
        setShowDetailModal(false);
      } else {
        alert('Güncelleme sırasında bir hata oluştu');
      }
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch('/api/raporlar', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: reportId }),
        });

        if (response.ok) {
          await fetchReports(); // Listeyi yenile
          alert('Rapor silindi!');
          setShowDetailModal(false);
        } else {
          alert('Silme işlemi sırasında bir hata oluştu');
        }
      } catch (error) {
        alert('Silme işlemi sırasında bir hata oluştu');
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (confirm('Tüm açık raporları çözüldü olarak işaretlemek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch('/api/raporlar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'markAllAsRead' }),
        });

        if (response.ok) {
          await fetchReports(); // Listeyi yenile
          alert('Tüm raporlar çözüldü olarak işaretlendi!');
        } else {
          alert('İşlem sırasında bir hata oluştu');
        }
      } catch (error) {
        alert('İşlem sırasında bir hata oluştu');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Açık':
        return 'bg-yellow-100 text-yellow-800';
      case 'Çözüldü':
        return 'bg-green-100 text-green-800';
      case 'İnceleniyor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'İlan Şikayeti':
        return 'bg-red-100 text-red-800';
      case 'Kullanıcı Şikayeti':
        return 'bg-blue-100 text-blue-800';
      case 'Genel Şikayet':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'Açık').length,
    resolved: reports.filter(r => r.status === 'Çözüldü').length,
    examining: reports.filter(r => r.status === 'İnceleniyor').length,
    listingReports: reports.filter(r => r.type === 'İlan Şikayeti').length,
    userReports: reports.filter(r => r.type === 'Kullanıcı Şikayeti').length,
    highPriority: reports.filter(r => r.priority === 'high').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Raporlar Yönetimi</h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <CheckCircle size={16} />
          Tümünü Çözüldü İşaretle
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600">Toplam Rapor</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          <div className="text-sm text-yellow-600">Açık Rapor</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.examining}</div>
          <div className="text-sm text-blue-600">İnceleniyor</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-green-600">Çözüldü</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.listingReports}</div>
          <div className="text-sm text-red-600">İlan Şikayeti</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.userReports}</div>
          <div className="text-sm text-blue-600">Kullanıcı Şikayeti</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-sm text-red-600">Yüksek Öncelik</div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rapor ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Durum Filtresi */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Açık">Açık</option>
            <option value="İnceleniyor">İnceleniyor</option>
            <option value="Çözüldü">Çözüldü</option>
          </select>

          {/* Tür Filtresi */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Türler</option>
            <option value="İlan Şikayeti">İlan Şikayeti</option>
            <option value="Kullanıcı Şikayeti">Kullanıcı Şikayeti</option>
            <option value="Genel Şikayet">Genel Şikayet</option>
          </select>

          {/* Öncelik Filtresi */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Öncelikler</option>
            <option value="high">Yüksek</option>
            <option value="medium">Orta</option>
            <option value="low">Düşük</option>
          </select>

          {/* Tarih Filtresi */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Tarihler</option>
            <option value="today">Bugün</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-center py-8">Yükleniyor...</div>}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}
      
      {!loading && !error && (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {filteredReports.length} rapor bulundu
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Tür</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Konu</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">İlan</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Öncelik</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Tarih</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Durum</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">#{report.id.slice(-6)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={report.subject}>
                      {report.subject}
                    </td>
                    <td className="py-3 px-4">
                      {report.listingId ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 max-w-xs truncate" title={report.listingTitle}>
                            {report.listingTitle}
                          </span>
                          <button
                            onClick={() => handleViewListing(report.listingId!)}
                            className="text-blue-600 hover:text-blue-800"
                            title="İlan detaylarını görüntüle"
                          >
                            <Eye size={14} />
                          </button>
                          <Link
                            href={`/ilan/${report.listingId}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-800"
                            title="İlanı yeni sekmede aç"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority === 'high' ? 'Yüksek' : 
                         report.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(report.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetail(report)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Eye size={12} />
                          Detay
                        </button>
                        {report.status === 'Açık' && (
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'İnceleniyor')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                          >
                            <Edit size={12} />
                            İncele
                          </button>
                        )}
                        {report.status === 'İnceleniyor' && (
                          <button 
                            onClick={() => handleUpdateStatus(report.id, 'Çözüldü')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle size={12} />
                            Çözüldü
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteReport(report.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <X size={12} />
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detay Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Rapor Detayı</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rapor ID:</label>
                  <p className="text-sm text-gray-900">#{selectedReport.id.slice(-6)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tür:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedReport.type)}`}>
                    {selectedReport.type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konu:</label>
                  <p className="text-sm text-gray-900">{selectedReport.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Açıklama:</label>
                  <p className="text-sm text-gray-900">{selectedReport.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Öncelik:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                    {selectedReport.priority === 'high' ? 'Yüksek' :
                     selectedReport.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {selectedReport.listing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">İlan Bilgileri:</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">{selectedReport.listing.title}</p>
                      <p className="text-sm text-gray-600">{selectedReport.listing.price} ₺</p>
                      <p className="text-sm text-gray-600">{selectedReport.listing.category} - {selectedReport.listing.subcategory || 'Alt kategori yok'}</p>
                      <p className="text-sm text-gray-600">{selectedReport.listing.location}</p>
                      <Link
                        href={`/ilan/${selectedReport.listing.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink size={14} />
                        İlanı Görüntüle
                      </Link>
                    </div>
                  </div>
                )}
                
                {selectedReport.user && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rapor Eden:</label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium">{selectedReport.user.name || 'İsim yok'}</p>
                      <p className="text-sm text-gray-600">{selectedReport.user.email}</p>
                    </div>
                  </div>
                )}
                
                {selectedReport.reportedUserEmail && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Şikayet Edilen Kullanıcı:</label>
                    <p className="text-sm text-gray-900">{selectedReport.reportedUserEmail}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Oluşturulma Tarihi:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedReport.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Güncellenme Tarihi:</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedReport.updatedAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              {selectedReport.status === 'Açık' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReport.id, 'İnceleniyor')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  İncelemeye Al
                </button>
              )}
              {selectedReport.status === 'İnceleniyor' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReport.id, 'Çözüldü')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Çözüldü Olarak İşaretle
                </button>
              )}
              {(selectedReport.status === 'Çözüldü' || selectedReport.status === 'İnceleniyor') && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReport.id, 'Açık')}
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertCircle size={16} />
                  Açık Olarak İşaretle
                </button>
              )}
            </div>
            
            <div className="mt-3">
              <button 
                onClick={() => handleDeleteReport(selectedReport.id)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X size={16} />
                Raporu Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* İlan Detay Modal */}
      {showListingModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">İlan Detayları</h2>
              <button 
                onClick={() => setShowListingModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İlan Başlığı:</label>
                <p className="text-sm text-gray-900">{selectedListing.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Açıklama:</label>
                <p className="text-sm text-gray-900">{selectedListing.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat:</label>
                  <p className="text-sm text-gray-900">{selectedListing.price} ₺</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategori:</label>
                  <p className="text-sm text-gray-900">{selectedListing.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alt Kategori:</label>
                  <p className="text-sm text-gray-900">{selectedListing.subcategory || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Konum:</label>
                  <p className="text-sm text-gray-900">{selectedListing.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durum:</label>
                  <p className="text-sm text-gray-900">{selectedListing.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Görüntülenme:</label>
                  <p className="text-sm text-gray-900">{selectedListing.views || 0}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Link
                  href={`/ilan/${selectedListing.id}`}
                  target="_blank"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  İlanı Görüntüle
                </Link>
                <button
                  onClick={() => setShowListingModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
