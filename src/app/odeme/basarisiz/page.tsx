'use client';
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OdemeBasarisiz() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Ödeme Başarısız</h1>
        <p className="text-red-800 mb-4">Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin veya farklı bir kart kullanın.</p>
        <a href="/odeme" className="inline-block mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Tekrar Dene</a>
        <a href="/" className="inline-block mt-4 ml-2 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">Ana Sayfa</a>
      </div>
    </div>
  );
} 