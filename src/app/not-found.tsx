import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-alo-orange mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Sayfa Bulunamadı
          </h1>
          
          <p className="text-gray-600 mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          
          <Link
            href="/"
            className="block w-full bg-alo-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-alo-light-orange transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 