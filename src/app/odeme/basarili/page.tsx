'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OdemeBasarili() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Ödeme Başarılı!</h1>
        <p className="text-green-800 mb-4">Ödemeniz başarıyla tamamlandı. Teşekkür ederiz.</p>
        <a href="/" className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Ana Sayfaya Dön</a>
      </div>
    </div>
  );
} 