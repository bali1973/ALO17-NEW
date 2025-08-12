'use client';

import React, { useEffect, useState } from 'react';

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
    subcategory: string;
    location: string;
    status: string;
    createdAt: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BildirimlerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/raporlar');
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (error) {
      setError('Bildirimler yüklenemedi');
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // API'ye güncelleme gönder
      const response = await fetch('/api/raporlar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      });

      if (response.ok) {
        // Sayfayı yenile
        fetchReports();
        alert('Tüm bildirimler okundu olarak işaretlendi!');
      } else {
        alert('İşlem sırasında bir hata oluştu');
      }
    } catch (error) {
      alert('İşlem sırasında bir hata oluştu');
    }
  };

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/raporlar/${reportId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setReports(reports.filter(report => report.id !== reportId));
          alert('Bildirim silindi!');
          if (selectedReport?.id === reportId) {
            closeModal();
          }
        } else {
          alert('Silme işlemi sırasında bir hata oluştu');
        }
      } catch (error) {
        alert('Silme işlemi sırasında bir hata oluştu');
      }
    }
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
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
        alert('Bildirim durumu güncellendi!');
        closeModal();
      } else {
        alert('Güncelleme sırasında bir hata oluştu');
      }
    } catch (error) {
      alert('Güncelleme sırasında bir hata oluştu');
    }
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">İlan Bildirimleri</h1>
        <button 
          onClick={handleMarkAllAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tümünü Okundu Olarak İşaretle
        </button>
      </div>
      
      {loading && <div className="text-center py-8">Yükleniyor...</div>}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}
      
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              {reports.map(report => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{report.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {report.type === 'İlan Şikayeti' ? 'İlan Şikayeti' : 
                     report.type === 'Kullanıcı Şikayeti' ? 'Kullanıcı Şikayeti' : 
                     report.type}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate" title={report.subject}>
                    {report.subject}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {report.listingId && report.listingTitle ? (
                      <a 
                        href={`/ilan/${report.listingId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                        title={`${report.listingTitle} - Tıklayarak ilanı görüntüle`}
                      >
                        {report.listingTitle}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">İlan bilgisi yok</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      report.priority === 'high' ? 'bg-red-100 text-red-800' :
                      report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {report.priority === 'high' ? 'Yüksek' : 
                       report.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Açık' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'İnceleniyor' ? 'bg-blue-100 text-blue-800' :
                      report.status === 'Çözüldü' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewDetail(report)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        Detay
                      </button>
                      <button 
                        onClick={() => handleDeleteReport(report.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detay Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Bildirim Detayı</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID:</label>
                <p className="text-sm text-gray-900">{selectedReport.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tür:</label>
                <p className="text-sm text-gray-900">{selectedReport.type}</p>
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
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedReport.priority === 'high' ? 'bg-red-100 text-red-800' :
                  selectedReport.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedReport.priority === 'high' ? 'Yüksek' : 
                   selectedReport.priority === 'medium' ? 'Orta' : 'Düşük'}
                </span>
              </div>
              {selectedReport.listingTitle && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">İlan:</label>
                  {selectedReport.listingId ? (
                    <a 
                      href={`/ilan/${selectedReport.listingId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors block mt-1"
                    >
                      {selectedReport.listingTitle} ↗
                    </a>
                  ) : (
                    <p className="text-sm text-gray-900">{selectedReport.listingTitle}</p>
                  )}
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
                <p className="text-sm text-gray-900">{new Date(selectedReport.createdAt).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Güncellenme Tarihi:</label>
                <p className="text-sm text-gray-900">{new Date(selectedReport.updatedAt).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Durum:</label>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  selectedReport.status === 'Açık' ? 'bg-yellow-100 text-yellow-800' :
                  selectedReport.status === 'İnceleniyor' ? 'bg-blue-100 text-blue-800' :
                  selectedReport.status === 'Çözüldü' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => handleUpdateStatus(selectedReport.id, 'Çözüldü')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Çözüldü Olarak İşaretle
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedReport.id, 'İnceleniyor')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                İncelemeye Al
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedReport.id, 'Açık')}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors"
              >
                Açık Olarak İşaretle
              </button>
            </div>
            
            <div className="mt-3">
              <button 
                onClick={() => handleDeleteReport(selectedReport.id)}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
