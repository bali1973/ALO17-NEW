"use client";

import React, { useEffect, useState } from 'react';

interface Report {
  id: number;
  type: string;
  subject: string;
  date: string;
  status: string;
}

export default function AdminRaporlarPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/raporlar')
      .then(res => res.json())
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Raporlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Raporlar</h1>
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
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-t">
                <td className="py-2 px-4">{report.id}</td>
                <td className="py-2 px-4">{report.type}</td>
                <td className="py-2 px-4">{report.subject}</td>
                <td className="py-2 px-4">{report.date}</td>
                <td className="py-2 px-4">{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 