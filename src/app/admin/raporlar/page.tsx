"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, CheckCircle, X, Calendar, AlertCircle } from 'lucide-react';

interface Report {
  id: number;
  type: string;
  subject: string;
  date: string;
  status: string;
  description?: string;
  user?: string;
  priority?: string;
  listingId?: string;
  listingTitle?: string;
  reportedUserEmail?: string;
  createdAt?: string;
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
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetch('/api/raporlar')
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setFilteredReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Raporlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  // Filtreleme fonksiyonu
  useEffect(() => {
    let filtered = reports;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

    // Tarih filtresi
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(report => report.date === today.toISOString().slice(0, 10));
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(report => new Date(report.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(report => new Date(report.date) >= filterDate);
          break;
      }
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, typeFilter, dateFilter]);

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (reportId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/raporlar/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReports(reports.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        ));
        alert('Rapor durumu güncellendi!');
        setShowDetailModal(false);
      } else {
        alert('Güncelleme sırasında bir hata oluştu');
      }
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu');
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (confirm('Bu raporu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/raporlar/${reportId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setReports(reports.filter(report => report.id !== reportId));
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
          setReports(reports.map(report => ({
            ...report,
            status: 'Çözüldü'
          })));
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: reports.length,
    open: reports.filter(r => r.status === 'Açık').length,
    resolved: reports.filter(r => r.status === 'Çözüldü').length,
    listingReports: reports.filter(r => r.type === 'İlan Şikayeti').length,
    userReports: reports.filter(r => r.type === 'Kullanıcı Şikayeti').length,
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-600">Toplam Rapor</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          <div className="text-sm text-yellow-600">Açık Rapor</div>
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
      </div>

      {/* Filtreler */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Tarih</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Durum</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">#{report.id}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={report.subject}>
                      {report.subject}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{report.date}</td>
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Rapor Detayı</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Rapor ID:</label>
                <p className="text-sm text-gray-900">#{selectedReport.id}</p>
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
              {selectedReport.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Açıklama:</label>
                  <p className="text-sm text-gray-900">{selectedReport.description}</p>
                </div>
              )}
              {selectedReport.user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rapor Eden:</label>
                  <p className="text-sm text-gray-900">{selectedReport.user}</p>
                </div>
              )}
              {selectedReport.priority && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Öncelik:</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    selectedReport.priority === 'high' ? 'bg-red-100 text-red-800' :
                    selectedReport.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedReport.priority === 'high' ? 'Yüksek' :
                     selectedReport.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                </div>
              )}
              {selectedReport.listingTitle && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">İlan:</label>
                  <p className="text-sm text-gray-900">{selectedReport.listingTitle}</p>
                </div>
              )}
              {selectedReport.reportedUserEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Şikayet Edilen Kullanıcı:</label>
                  <p className="text-sm text-gray-900">{selectedReport.reportedUserEmail}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarih:</label>
                <p className="text-sm text-gray-900">{selectedReport.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum:</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              {selectedReport.status === 'Açık' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedReport.id, 'Çözüldü')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Çözüldü Olarak İşaretle
                </button>
              )}
              {selectedReport.status === 'Çözüldü' && (
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
    </div>
  );
} 
