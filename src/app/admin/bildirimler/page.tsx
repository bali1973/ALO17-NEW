'use client';

import React, { useEffect, useState } from 'react';

interface Report {
  id: number;
  type: string;
  subject: string;
  date: string;
  status: string;
  read: boolean;
  // Detay için ek alanlar eklenebilir
  adminNote?: string;
  adminStatus?: string;
}

function ReportDetailModal({ report, onClose, onUpdate }: { report: Report | null, onClose: () => void, onUpdate: (r: Report) => void }) {
  const [note, setNote] = React.useState(report?.adminNote || '');
  const [adminStatus, setAdminStatus] = React.useState(report?.adminStatus || 'İnceleniyor');
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => {
    setNote(report?.adminNote || '');
    setAdminStatus(report?.adminStatus || 'İnceleniyor');
  }, [report]);
  if (!report) return null;
  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/raporlar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: report.id, adminNote: note, adminStatus })
    });
    if (res.ok) {
      const updated = { ...report, adminNote: note, adminStatus };
      onUpdate(updated);
      onClose();
    }
    setSaving(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">Bildirim Detayı</h2>
        <div className="mb-2"><b>ID:</b> {report.id}</div>
        <div className="mb-2"><b>Tür:</b> {report.type}</div>
        <div className="mb-2"><b>Konu:</b> {report.subject}</div>
        <div className="mb-2"><b>Tarih:</b> {report.date}</div>
        <div className="mb-2"><b>Durum:</b> {report.status}</div>
        <div className="mb-2"><b>Okundu:</b> {report.read ? 'Evet' : 'Hayır'}</div>
        <div className="mb-2"><b>Admin İşlem Durumu:</b> <select value={adminStatus} onChange={e => setAdminStatus(e.target.value)} className="border rounded px-2 py-1">
          <option>İnceleniyor</option>
          <option>Çözüldü</option>
          <option>İptal</option>
        </select></div>
        <div className="mb-2"><b>Admin Notu:</b> <textarea value={note} onChange={e => setNote(e.target.value)} className="border rounded px-2 py-1 w-full" rows={3} /></div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={saving}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </div>
    </div>
  );
}

export default function BildirimlerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Report | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/raporlar')
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Bildirimler yüklenemedi');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleMarkRead = async (id: number, read: boolean) => {
    setProcessing(true);
    await fetch('/api/raporlar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read })
    });
    fetchReports();
    setProcessing(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu bildirimi silmek istediğinize emin misiniz?')) return;
    setProcessing(true);
    await fetch('/api/raporlar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    fetchReports();
    setProcessing(false);
  };

  const handleMarkAllRead = async () => {
    setProcessing(true);
    await Promise.all(
      reports.filter(r => !r.read).map(r =>
        fetch('/api/raporlar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: r.id, read: true })
        })
      )
    );
    fetchReports();
    setProcessing(false);
  };

  const handleUpdate = (updated: Report) => {
    setReports(reports => reports.map(r => r.id === updated.id ? updated : r));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">İlan Bildirimleri</h1>
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs disabled:opacity-50"
          disabled={processing || reports.every(r => r.read)}
        >
          Tümünü Okundu Olarak İşaretle
        </button>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Tür</th>
              <th className="py-2 px-4 text-left">Konu</th>
              <th className="py-2 px-4 text-left">Tarih</th>
              <th className="py-2 px-4 text-left">Durum</th>
              <th className="py-2 px-4 text-left">Okundu</th>
              <th className="py-2 px-4 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className={"border-t " + (report.read ? 'bg-gray-50' : 'bg-yellow-50 font-semibold')}>
                <td className="py-2 px-4 cursor-pointer underline" onClick={() => setSelected(report)}>{report.id}</td>
                <td className="py-2 px-4">{report.type}</td>
                <td className="py-2 px-4">{report.subject}</td>
                <td className="py-2 px-4">{report.date}</td>
                <td className="py-2 px-4">{report.status}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleMarkRead(report.id, !report.read)}
                    className={report.read ? 'text-green-600' : 'text-gray-400'}
                    title={report.read ? 'Okundu olarak işaretlendi' : 'Okunmadı olarak işaretle'}
                    disabled={processing}
                  >
                    {report.read ? '✓' : '•'}
                  </button>
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => setSelected(report)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                  >Detay</button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-xs"
                    disabled={processing}
                  >Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ReportDetailModal report={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
    </div>
  );
} 