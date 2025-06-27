'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Sayfa Bulunamadı
          </h2>
          <p className="text-gray-500 mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Geri Dön
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Ana Sayfaya Git
            </Link>
          </div>

          {/* Popular Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Popüler Sayfalar
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/ilanlar"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                İlanlar
              </Link>
              <Link
                href="/kategori/elektronik"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Elektronik
              </Link>
              <Link
                href="/ilan-ver"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                İlan Ver
              </Link>
              <Link
                href="/giris"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 