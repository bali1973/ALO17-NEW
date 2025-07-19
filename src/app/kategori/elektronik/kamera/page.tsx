import React from 'react';
import Link from 'next/link';

export default function KameraPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4 text-center">Bu kategoride henüz ilan bulunmuyor.</p>
        <Link
          href="/ilan-ver"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          İlan Ver
        </Link>
      </div>
    </div>
  );
} 