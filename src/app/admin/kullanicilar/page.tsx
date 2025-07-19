"use client";

import React, { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface NotificationPayload {
  userEmail: string;
  type: string;
  title: string;
  content: string;
  relatedId?: string | null;
}

function NotificationModal({ open, onClose, onSend, userEmail }: { open: boolean, onClose: () => void, onSend: (payload: NotificationPayload) => void, userEmail?: string }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('system');
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (open) {
      setTitle('');
      setContent('');
      setType('system');
    }
  }, [open]);
  if (!open) return null;
  const handleSend = async () => {
    setSending(true);
    await onSend({ userEmail: userEmail || '', type, title, content });
    setSending(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4">Bildirim Gönder</h2>
        <div className="mb-2"><b>Tip:</b> <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-2 py-1">
          <option value="system">Sistem</option>
          <option value="info">Bilgi</option>
          <option value="warning">Uyarı</option>
        </select></div>
        <div className="mb-2"><b>Başlık:</b> <input value={title} onChange={e => setTitle(e.target.value)} className="border rounded px-2 py-1 w-full" /></div>
        <div className="mb-2"><b>İçerik:</b> <textarea value={content} onChange={e => setContent(e.target.value)} className="border rounded px-2 py-1 w-full" rows={3} /></div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Kapat</button>
          <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={sending || !title || !content}>{sending ? 'Gönderiliyor...' : 'Gönder'}</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminKullanicilarPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifUser, setNotifUser] = useState<string | undefined>(undefined);
  const [notifInfo, setNotifInfo] = useState<string | null>(null);
  const [bulkNotifOpen, setBulkNotifOpen] = useState(false);
  const [bulkNotifInfo, setBulkNotifInfo] = useState<string | null>(null);
  // İlan sayısı ve ilk ilan tarihi için state
  const [userListingStats, setUserListingStats] = useState<Record<string, { count: number; firstDate: string }>>({});
  const [editListingCount, setEditListingCount] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Kullanıcılar yüklenemedi');
        setLoading(false);
      });
    // İlan istatistiklerini çek
    fetch('/api/listings')
      .then(res => res.json())
      .then(listings => {
        const stats: Record<string, { count: number; firstDate: string }> = {};
        listings.forEach((l: any) => {
          if (!l.email) return;
          if (!stats[l.email]) stats[l.email] = { count: 0, firstDate: l.createdAt };
          stats[l.email].count++;
          if (new Date(l.createdAt) < new Date(stats[l.email].firstDate)) {
            stats[l.email].firstDate = l.createdAt;
          }
        });
        setUserListingStats(stats);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setUsers(users => users.filter(u => u.id !== id));
    } else {
      alert('Kullanıcı silinemedi!');
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, name: editName, email: editEmail, role: editRole })
    });
    if (res.ok) {
      setUsers(users => users.map(u => u.id === editId ? { ...u, name: editName, email: editEmail, role: editRole } : u));
      setEditId(null);
    } else {
      alert('Kullanıcı güncellenemedi!');
    }
  };

  const sendNotification = async (payload: NotificationPayload) => {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setNotifInfo('Bildirim başarıyla gönderildi.');
      setTimeout(() => setNotifInfo(null), 2000);
      setNotifOpen(false);
    } else {
      setNotifInfo('Bildirim gönderilemedi!');
    }
  };

  const sendBulkNotification = async (payload: NotificationPayload) => {
    await Promise.all(users.map(u =>
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, userEmail: u.email })
      })
    ));
    setBulkNotifInfo('Tüm kullanıcılara bildirim gönderildi.');
    setTimeout(() => setBulkNotifInfo(null), 2000);
    setBulkNotifOpen(false);
  };

  const handleListingCountSave = async (userEmail: string) => {
    // Burada backend'e güncelleme isteği gönderilebilir (ör: /api/users-listing-count)
    // Şimdilik sadece local state güncelleniyor
    setUserListingStats(stats => ({
      ...stats,
      [userEmail]: {
        ...stats[userEmail],
        count: editListingCount[userEmail] ?? stats[userEmail]?.count ?? 0
      }
    }));
    setEditListingCount(counts => ({ ...counts, [userEmail]: undefined }));
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6">Kullanıcılar</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setBulkNotifOpen(true)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">Toplu Bildirim Gönder</button>
        {bulkNotifInfo && <span className="text-green-600 ml-4">{bulkNotifInfo}</span>}
      </div>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Ad Soyad</th>
              <th className="py-2 px-4 text-left">E-posta</th>
              <th className="py-2 px-4 text-left">Rol</th>
              <th className="py-2 px-4 text-left">Kayıt Tarihi</th>
              <th className="py-2 px-4 text-left">İlan Sayısı</th>
              <th className="py-2 px-4 text-left">İlk İlan Tarihi</th>
              <th className="py-2 px-4 text-left min-w-[220px]">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">
                  {editId === user.id ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="border px-2 py-1 rounded" />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-2 px-4">
                  {editId === user.id ? (
                    <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="border px-2 py-1 rounded" />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-2 px-4">
                  {editId === user.id ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value)} className="border px-2 py-1 rounded">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="moderator">moderator</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-2 px-4">{user.createdAt}</td>
                <td className="py-2 px-4">
                  {editListingCount[user.email] !== undefined ? (
                    <>
                      <input
                        type="number"
                        value={editListingCount[user.email]}
                        onChange={e => setEditListingCount(counts => ({ ...counts, [user.email]: Number(e.target.value) }))}
                        className="border px-2 py-1 rounded w-20"
                      />
                      <button onClick={() => handleListingCountSave(user.email)} className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs">Kaydet</button>
                    </>
                  ) : (
                    <>
                      {userListingStats[user.email]?.count ?? 0}
                      <button onClick={() => setEditListingCount(counts => ({ ...counts, [user.email]: (userListingStats[user.email]?.count !== undefined ? userListingStats[user.email].count : 0) }))} className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">Düzenle</button>
                    </>
                  )}
                </td>
                <td className="py-2 px-4">{userListingStats[user.email]?.firstDate ? new Date(userListingStats[user.email].firstDate).toLocaleDateString() : '-'}</td>
                <td className="py-2 px-4">
                  {editId === user.id ? (
                    <>
                      <button onClick={handleEditSave} className="bg-green-500 text-white px-2 py-1 rounded text-sm mr-2">Kaydet</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-sm">İptal</button>
                    </>
                  ) : (
                    <div className="flex flex-row gap-2 items-center">
                      <button onClick={() => handleEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Düzenle</button>
                      <button onClick={() => { setNotifUser(user.email); setNotifOpen(true); }} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Bildirim Gönder</button>
                      <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Sil</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <NotificationModal open={notifOpen} onClose={() => setNotifOpen(false)} onSend={sendNotification} userEmail={notifUser} />
      <NotificationModal open={bulkNotifOpen} onClose={() => setBulkNotifOpen(false)} onSend={sendBulkNotification} />
      {notifInfo && <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">{notifInfo}</div>}
    </div>
  );
} 