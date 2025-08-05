'use client';

import React, { useEffect, useState } from 'react';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  date: string;
}

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Mesajlar yüklenemedi');
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages(messages => messages.filter(m => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) setSelectedMessage(null);
    } else {
      alert('Mesaj silinemedi!');
    }
  };

  const filteredMessages = messages.filter(m =>
    (m.sender?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (m.receiver?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (m.content?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Mesajlar</h1>
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Gönderen, alıcı veya içerikte ara..."
          className="border border-gray-300 rounded px-3 py-2 w-80"
        />
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Gönderen</th>
              <th className="py-2 px-4 text-left">Alıcı</th>
              <th className="py-2 px-4 text-left">İçerik</th>
              <th className="py-2 px-4 text-left">Tarih</th>
              <th className="py-2 px-4 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map(msg => (
              <tr key={msg.id} className="border-t">
                <td className="py-2 px-4">{msg.id}</td>
                <td className="py-2 px-4">{msg.sender || 'Bilinmiyor'}</td>
                <td className="py-2 px-4">{msg.receiver || 'Bilinmiyor'}</td>
                <td className="py-2 px-4 line-clamp-1 max-w-xs">{msg.content || 'İçerik yok'}</td>
                <td className="py-2 px-4">{msg.date || 'Tarih yok'}</td>
                <td className="py-2 px-4">
                  <button onClick={() => setSelectedMessage(msg)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Detay</button>
                  <button onClick={() => handleDelete(msg.id)} className="bg-red-500 text-white px-3 py-1 rounded">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Detay Modalı */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button onClick={() => setSelectedMessage(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Mesaj Detayı</h2>
            <div className="mb-2"><b>ID:</b> {selectedMessage.id}</div>
            <div className="mb-2"><b>Gönderen:</b> {selectedMessage.sender || 'Bilinmiyor'}</div>
            <div className="mb-2"><b>Alıcı:</b> {selectedMessage.receiver || 'Bilinmiyor'}</div>
            <div className="mb-2"><b>Tarih:</b> {selectedMessage.date || 'Tarih yok'}</div>
            <div className="mb-2"><b>İçerik:</b> <div className="bg-gray-100 rounded p-2 mt-1 whitespace-pre-line">{selectedMessage.content || 'İçerik yok'}</div></div>
          </div>
        </div>
      )}
    </div>
  );
} 
