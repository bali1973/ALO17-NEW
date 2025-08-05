'use client';

import React from 'react';

import { RotateCcw, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function IadePolitikasiPage() {
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">İade ve İptal Politikası</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Genel Bilgiler</h2>
      <p className="mb-4">Alo17 platformunda sunulan hizmetler ve ürünler için iade ve iptal koşulları aşağıda belirtilmiştir. Lütfen satın alma işlemi yapmadan önce bu politikayı dikkatlice okuyunuz.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Dijital Hizmetler ve Premium Üyelikler</h2>
      <p className="mb-4">Dijital hizmetler (premium ilan, öne çıkarma vb.) ve üyelikler, anında ifa edilen ve elektronik ortamda sunulan hizmetlerdir. Bu tür hizmetlerde, hizmetin sunulmaya başlanmasının ardından cayma hakkı kullanılamaz ve iade yapılamaz.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Fiziksel Ürünler</h2>
      <p className="mb-4">Alo17 doğrudan fiziksel ürün satışı yapmaz. Platformda yer alan ilanlar üzerinden yapılan alışverişlerde, satıcı ve alıcı arasındaki iade ve iptal süreçleri taraflar arasında yürütülür. Alo17, bu işlemlerde aracı değildir ve sorumluluk kabul etmez.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. İptal Talepleri</h2>
      <p className="mb-4">Hizmet veya ürün satın alımından sonra iptal talebiniz varsa, lütfen <a href="/iletisim" className="text-blue-600 underline">iletişim</a> sayfamızdan bize ulaşın. Talebiniz en kısa sürede değerlendirilir.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. İstisnalar</h2>
      <ul className="mb-4 list-disc pl-6">
        <li>Kullanıcı hatasından kaynaklanan durumlarda iade yapılmaz.</li>
        <li>Hizmetin veya ürünün kullanılmış, hasar görmüş veya eksik olması durumunda iade kabul edilmez.</li>
        <li>Yasal zorunluluklar hariç, özel kampanya ve indirimli hizmetlerde iade yapılamaz.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Değişiklikler</h2>
      <p className="mb-4">Alo17, iade ve iptal politikasında değişiklik yapma hakkını saklı tutar. Güncel politika her zaman bu sayfada yayınlanır.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">7. İletişim</h2>
      <p className="mb-4">İade ve iptal politikası ile ilgili sorularınız için <a href="/iletisim" className="text-blue-600 underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
    </div>
  );
} 
