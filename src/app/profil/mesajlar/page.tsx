"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

interface Message {
  id: number;
  from: string;
  subject: string;
  date: string;
  read: boolean;
}

export default function UserMessagesPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push("/giris");
      return;
    }
    fetch("/api/messages?type=received")
      .then((res) => res.json())
      .then((data) => {
        // Sadece kullanıcıya ait mesajlar (from veya to email kontrolü gerekebilir)
        const userMessages = data.filter((m: any) => m.to === session.user.email);
        setMessages(userMessages);
        setLoading(false);
      })
      .catch(() => {
        setError("Mesajlar yüklenemedi");
        setLoading(false);
      });
  }, [session, isLoading, router]);

  if (isLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mesajlarım</h1>
      {messages.length === 0 ? (
        <div className="text-gray-500">Hiç mesajınız yok.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded border ${msg.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{msg.from}</span>
                <span className="text-xs text-gray-500">{msg.date}</span>
              </div>
              <div className="mb-1">{msg.subject}</div>
              <div className="text-xs mt-1">
                {msg.read ? (
                  <span className="text-green-600">Okundu</span>
                ) : (
                  <span className="text-blue-700 font-semibold">Okunmadı</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 