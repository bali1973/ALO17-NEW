"use client";
import { useEffect, useState, useRef } from "react";
import { useAuth } from '@/components/Providers';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  connectSocket,
  joinRoom,
  sendMessage as sendSocketMessage,
  onMessage,
  markMessageAsRead,
  onMessageRead,
  disconnectSocket,
} from '@/services/socketService';

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  isRead: boolean;
};

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type Session = {
  user: SessionUser;
  token?: string;
  [key: string]: any;
} | null;

export default function MessageDetail() {
  const { session } = useAuth() as { session: Session };
  const router = useRouter();
  const params = useSearchParams();
  const recipientId = params.get('recipientId') || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sesli bildirim fonksiyonu
  function playNotificationSound() {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/message-notification.mp3');
      audio.play();
    }
  }

  useEffect(() => {
    if (!session || !recipientId) return;
    let isMounted = true;
    let roomId = '';
    const token = session.token || JSON.stringify(session);
    const ids = [session.user.id, recipientId].sort();
    roomId = `room_${ids[0]}_${ids[1]}`;
    connectSocket(token);
    joinRoom(roomId);
    onMessage((msg: Message) => {
      if (isMounted) setMessages((prev) => [...prev, msg]);
      // Bildirim göster
      if (msg.receiverId === session.user.id && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Yeni Mesaj', { body: msg.content });
        playNotificationSound();
        // Badge güncelle
        const badge = Number(localStorage.getItem('unreadBadge') || '0') + 1;
        localStorage.setItem('unreadBadge', badge.toString());
        if ('setAppBadge' in navigator) {
          // @ts-ignore
          navigator.setAppBadge(badge);
        }
      }
      // Okunmamışsa okundu olarak işaretle
      if (msg.receiverId === session.user.id && !msg.isRead) {
        markMessageAsRead(msg.id, roomId);
        // Badge sıfırla
        localStorage.setItem('unreadBadge', '0');
        if ('clearAppBadge' in navigator) {
          // @ts-ignore
          navigator.clearAppBadge();
        }
      }
    });
    onMessageRead(({ messageId, readerId }) => {
      setMessages((prev) => prev.map((m) =>
        m.id === messageId ? { ...m, isRead: true } : m
      ));
    });
    // İlk yüklemede geçmişi çek
    fetchHistory();
    return () => {
      isMounted = false;
      disconnectSocket();
    };
    // eslint-disable-next-line
  }, [session, recipientId]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const ids = [session!.user.id, recipientId].sort();
      const roomId = `room_${ids[0]}_${ids[1]}`;
      const res = await fetch(`/api/messages/history?roomId=${roomId}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
        // Okunmamış mesajları okundu olarak işaretle
        (data.messages as Message[]).forEach(async (msg) => {
          if (msg.receiverId === session!.user.id && !msg.isRead) {
            await fetch('/api/messages/read', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messageId: msg.id }),
            });
          }
        });
      } else {
        setError(data.error || 'Mesaj geçmişi yüklenemedi.');
      }
    } catch (err) {
      setError('Mesaj geçmişi yüklenirken hata oluştu.');
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !session) return;
    const ids = [session.user.id, recipientId].sort();
    const roomId = `room_${ids[0]}_${ids[1]}`;
    sendSocketMessage({
      content: newMessage.trim(),
      receiverId: recipientId,
      roomId,
    });
    setNewMessage('');
  };

  if (!session) {
    return <div className="p-8 text-center text-red-500">Giriş yapmalısınız.</div>;
  }
  if (!recipientId) {
    return <div className="p-8 text-center text-red-500">Alıcı bulunamadı.</div>;
  }

  // Bildirim izni isteme
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button className="mb-4 text-blue-600" onClick={() => router.back()}>&larr; Geri</button>
      <h2 className="text-xl font-bold mb-4">Sohbet</h2>
      <div className="bg-gray-100 rounded p-4 h-96 overflow-y-auto flex flex-col">
        {loading && <div>Yükleniyor...</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {messages.map((msg: Message) => {
          const isOwn = msg.senderId === session.user.id;
          return (
            <div key={msg.id} className={`mb-2 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded px-3 py-2 ${isOwn ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                <div>{msg.content}</div>
                <div className="text-xs text-gray-300 flex items-center gap-2">
                  {new Date(msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  {isOwn && (
                    <span>{msg.isRead ? '✓✓ Okundu' : '✓ Gönderildi'}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Mesaj yaz..."
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading || !newMessage.trim()}
        >Gönder</button>
      </div>
    </div>
  );
} 
