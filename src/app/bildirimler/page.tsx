"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers";

import { Settings } from 'lucide-react';

interface Report {
  id: number;
  type: string;
  subject: string;
  date: string;
  status: string;
  read: boolean;
  email?: string;
}

const DEFAULT_PREFS = {
  email: true,
  sms: true,
  inApp: true,
};

export default function NotificationsPage() {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  // Bildirim tercihlerini localStorage'dan yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notificationPrefs");
      if (saved) {
        setPrefs(JSON.parse(saved));
      }
    }
  }, []);

  // Tercihler değişince localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notificationPrefs", JSON.stringify(prefs));
    }
  }, [prefs]);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.push("/giris");
      return;
    }
    fetch("/api/raporlar")
      .then((res) => res.json())
      .then((data) => {
        // Sadece kullanıcıya ait bildirimler
        const userReports = data.filter((r: Report) => r.email === session.user.email);
        setReports(userReports);
        setLoading(false);
      })
      .catch(() => {
        setError("Bildirimler yüklenemedi");
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bildirimlerim</h1>
        <button
          onClick={() => router.push('/bildirim-tercihleri')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Tercihleri Düzenle
        </button>
      </div>
      <div className="mb-8 p-4 bg-white rounded shadow border">
        <h2 className="text-lg font-semibold mb-2">Bildirim Tercihleri</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.email}
              onChange={e => setPrefs(p => ({ ...p, email: e.target.checked }))}
            />
            E-posta ile bildirim almak istiyorum
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.sms}
              onChange={e => setPrefs(p => ({ ...p, sms: e.target.checked }))}
            />
            SMS ile bildirim almak istiyorum
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefs.inApp}
              onChange={e => setPrefs(p => ({ ...p, inApp: e.target.checked }))}
            />
            Uygulama içi bildirim almak istiyorum
          </label>
        </div>
      </div>
      {reports.length === 0 ? (
        <div className="text-gray-500">Hiç bildiriminiz yok.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded border ${report.read ? "bg-gray-50 border-gray-200" : "bg-yellow-50 border-yellow-300"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{report.type}</span>
                <span className="text-xs text-gray-500">{report.date}</span>
              </div>
              <div className="mb-1">{report.subject}</div>
              <div className="text-xs text-gray-600">Durum: {report.status}</div>
              <div className="text-xs mt-1">
                {report.read ? (
                  <span className="text-green-600">Okundu</span>
                ) : (
                  <span className="text-yellow-700 font-semibold">Okunmadı</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
