'use client';

import React, { useEffect, useState } from 'react';

interface Message {
  id: string;
  sender: string;
  senderEmail?: string;
  receiver: string;
  content: string;
  subject?: string;
  date: string;
  type?: string;
  isRead?: boolean;
}

export default function AdminMesajlarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyModal, setReplyModal] = useState<{ show: boolean; message: Message | null }>({ show: false, message: null });
  const [replyForm, setReplyForm] = useState({
    subject: '',
    content: ''
  });
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/messages');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Veri formatını kontrol et
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          console.warn('Unexpected data format:', data);
          setMessages([]);
        }
      } catch (err) {
        console.error('Mesajları yükleme hatası:', err);
        const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
        setError(`Mesajlar yüklenemedi: ${errorMessage}`);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
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

  const handleReply = (message: Message) => {
    setReplyModal({ show: true, message });
    setReplyForm({
      subject: `Re: ${message.subject || 'İlan Hakkında'}`,
      content: ''
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal.message) return;

    setReplyLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'Admin',
          senderEmail: 'admin@alo17.tr',
          receiver: replyModal.message.sender,
          content: replyForm.content,
          subject: replyForm.subject,
          type: 'admin_reply',
          date: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert('Cevap başarıyla gönderildi!');
        setReplyModal({ show: false, message: null });
        setReplyForm({ subject: '', content: '' });
      } else {
        const errorData = await response.json();
        alert(`Cevap gönderilemedi: ${errorData.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Cevap gönderme hatası:', error);
      alert('Cevap gönderilirken bir hata oluştu!');
    } finally {
      setReplyLoading(false);
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
                  <button onClick={() => handleReply(msg)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Cevapla</button>
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
            <div className="mb-2"><b>E-posta:</b> {selectedMessage.senderEmail || 'Bilinmiyor'}</div>
            <div className="mb-2"><b>Alıcı:</b> {selectedMessage.receiver || 'Bilinmiyor'}</div>
            <div className="mb-2"><b>Konu:</b> {selectedMessage.subject || 'Konu yok'}</div>
            <div className="mb-2"><b>Tarih:</b> {selectedMessage.date || 'Tarih yok'}</div>
            <div className="mb-2"><b>İçerik:</b> <div className="bg-gray-100 rounded p-2 mt-1 whitespace-pre-line">{selectedMessage.content || 'İçerik yok'}</div></div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleReply(selectedMessage)} className="bg-green-500 text-white px-4 py-2 rounded">Cevapla</button>
              <button onClick={() => setSelectedMessage(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* Cevaplama Modalı */}
      {replyModal.show && replyModal.message && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button onClick={() => setReplyModal({ show: false, message: null })} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Mesajı Cevapla</h2>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Orijinal Mesaj:</h3>
              <p className="text-sm text-gray-600 mb-1"><b>Gönderen:</b> {replyModal.message.sender}</p>
              <p className="text-sm text-gray-600 mb-1"><b>Konu:</b> {replyModal.message.subject || 'Konu yok'}</p>
              <p className="text-sm text-gray-600 mb-2"><b>İçerik:</b></p>
              <div className="bg-white p-3 rounded border text-sm">{replyModal.message.content}</div>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                <input
                  type="text"
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cevabınız</label>
                <textarea
                  value={replyForm.content}
                  onChange={(e) => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Cevabınızı yazın..."
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setReplyModal({ show: false, message: null })}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {replyLoading ? 'Gönderiliyor...' : 'Cevabı Gönder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
