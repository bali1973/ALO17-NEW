'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Kullanım Koşulları</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Genel Hükümler</h2>
        <p className="mb-4">
          ALO17 platformunu kullanarak, bu kullanım koşullarını kabul etmiş 
          sayılırsınız. Bu koşulları kabul etmiyorsanız, lütfen platformu 
          kullanmayınız.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Üyelik</h2>
        <p className="mb-4">Üyelik koşulları:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>18 yaşından büyük olmak</li>
          <li>Geçerli bir e-posta adresi ve telefon numarası sağlamak</li>
          <li>Doğru ve güncel bilgiler vermek</li>
          <li>Hesap güvenliğini sağlamak</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Platform Kullanımı</h2>
        <p className="mb-4">Kullanıcılar şunları yapmamayı kabul eder:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Yasa dışı içerik paylaşmak</li>
          <li>Sahte veya yanıltıcı bilgiler vermek</li>
          <li>Diğer kullanıcıları taciz etmek</li>
          <li>Platformun güvenliğini tehlikeye atmak</li>
          <li>Spam veya zararlı içerik paylaşmak</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. İlan Verme Kuralları</h2>
        <p className="mb-4">İlan verirken uyulması gereken kurallar:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Doğru ve güncel bilgiler vermek</li>
          <li>Uygun fiyat belirlemek</li>
          <li>Kaliteli fotoğraflar kullanmak</li>
          <li>Kategori seçimini doğru yapmak</li>
          <li>Yasaklı ürünleri ilan etmemek</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sorumluluk Reddi</h2>
        <p className="mb-4">
          ALO17, kullanıcılar arasındaki iletişim ve işlemlerden sorumlu 
          değildir. Kullanıcılar kendi işlemlerinden sorumludur.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Fikri Mülkiyet</h2>
        <p className="mb-4">
          Platform üzerindeki tüm içerikler ALO17'nin fikri mülkiyetidir. 
          İzinsiz kullanım ve kopyalama yasaktır.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Hesap Askıya Alma</h2>
        <p className="mb-4">
          ALO17, kullanım koşullarını ihlal eden hesapları askıya alma veya 
          kalıcı olarak kapatma hakkını saklı tutar.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Değişiklikler</h2>
        <p className="mb-4">
          Bu kullanım koşulları zaman zaman güncellenebilir. Önemli 
          değişiklikler kullanıcılara bildirilecektir.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. İletişim</h2>
        <p className="mb-4">
          Kullanım koşulları hakkında sorularınız için: terms@alo17.com
        </p>
      </div>
    </div>
  );
} 