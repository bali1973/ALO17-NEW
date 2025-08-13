'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hatayı loglayabiliriz
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
        <p className="text-gray-600 mb-8">
          Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Ana Sayfaya Git
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-8">
          Sorun devam ederse bizimle iletişime geçin.
        </p>
      </div>
    </div>
  );
} 
