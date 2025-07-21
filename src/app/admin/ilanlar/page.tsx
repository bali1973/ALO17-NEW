'use client';

import React, { useEffect, useState } from 'react';

interface Listing {
  id: string;
  title: string;
  price: number;
  status: string;
  lastActionBy?: { id: string; name: string; role: string };
  lastActionType?: string;
  lastActionAt?: string;
  history?: Array<{
    action: string;
    by: { id: string; name: string; role: string };
    at: string;
  }>;
}

function HistoryModal({ history, onClose }: { history: Listing['history'], onClose: () => void }) {
  if (!history || history.length === 0) return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">İşlem Geçmişi</h2>
        <div>İşlem geçmişi yok.</div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[300px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-2">İşlem Geçmişi</h2>
        <table className="w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="text-left">İşlem</th>
              <th className="text-left">Yapan</th>
              <th className="text-left">Rol</th>
              <th className="text-left">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i}>
                <td>{h.action}</td>
                <td>{h.by?.name || '-'}</td>
                <td>{h.by?.role || '-'}</td>
                <td>{h.at ? new Date(h.at).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
      </div>
    </div>
  );
}

export default function AdminIlanlarPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">İlanlar</h1>
      <div>Bu sayfa devre dışı bırakıldı.</div>
    </div>
  );
} 