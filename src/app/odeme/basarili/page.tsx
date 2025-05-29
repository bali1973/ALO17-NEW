'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const merchant_oid = searchParams.get('merchant_oid');
        const status = searchParams.get('status');

        if (!merchant_oid || status !== 'success') {
          throw new Error('Geçersiz ödeme yanıtı');
        }

        // Ödeme doğrulama API çağrısı
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchant_oid,
            status,
          }),
        });

        if (!response.ok) {
          throw new Error('Ödeme doğrulanamadı');
        }

        const data = await response.json();
        
        // İlanı yayınla
        if (data.verified) {
          await fetch('/api/listings/publish', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              listingId: data.listingId,
              paymentId: merchant_oid,
            }),
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alo-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Ödeme doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/"
            className="inline-block bg-alo-orange text-white px-6 py-2 rounded-lg hover:bg-alo-light-orange transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Ödeme Başarılı!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Premium ilanınız başarıyla yayınlandı. İlanınız artık sitede görünür durumda.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/profil/ilanlarim"
              className="block w-full bg-alo-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-alo-light-orange transition-colors"
            >
              İlanlarımı Görüntüle
            </Link>
            
            <Link
              href="/"
              className="block w-full text-gray-600 hover:text-alo-orange transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 