"use client";

import { useState, useEffect } from "react";
import { useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';

export default function MessagesBox() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchMessages(tab);
    }
    // eslint-disable-next-line
  }, [tab, session]);

  const fetchMessages = async (type: 'received' | 'sent') => {
    setLoading(true);
    setError('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('alo17-session') : null;
      let authHeader = {};
      if (token) {
        authHeader = { Authorization: `Bearer ${token}` };
      }
      const res = await fetch(`/api/messages?type=${type}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      } else {
        setError(data.error || 'Mesajlar yüklenemedi.');
      }
    } catch (err) {
      setError('Mesajlar yüklenirken hata oluştu.');
    }
    setLoading(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }
  if (!session) {
    return <div className="p-8 text-center text-red-500">Mesajlarınızı görüntülemek için giriş yapmalısınız.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mesajlarım</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'received' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('received')}
        >
          Gelen Kutusu
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('sent')}
        >
          Gönderilenler
        </button>
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && messages.length === 0 && (
        <div className="text-gray-500">Hiç mesaj yok.</div>
      )}
      <ul className="space-y-4">
        {messages.map((msg: any) => (
          <li
            key={msg.id}
            className="bg-white rounded shadow p-4 cursor-pointer hover:bg-blue-50"
            onClick={() => {
              const otherId = tab === 'received' ? (msg.senderId || msg.sender?.id) : (msg.receiverId || msg.receiver?.id);
              router.push(`/profil/mesajlar/MessageDetail?recipientId=${otherId}`);
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">
                {tab === 'received' ? (msg.senderName || msg.sender?.name || msg.senderId) : (msg.receiver?.name || msg.receiverId)}
              </span>
              <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString('tr-TR')}</span>
            </div>
            <div className="mb-2">
              <span className="text-gray-700">{msg.content}</span>
            </div>
            {msg.listing && (
              <div className="text-xs text-gray-500">İlan: {msg.listing.title}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
} 