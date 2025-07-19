import React from 'react';

export default function AcikRizaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Açık Rıza Metni</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Amaç</h2>
      <p className="mb-4">Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, kişisel verilerinizin işlenmesine açık rıza vermeniz için hazırlanmıştır.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Kapsam</h2>
      <p className="mb-4">Açık rızanız, Alo17 platformunda sunulan hizmetler kapsamında kimlik, iletişim, işlem güvenliği, kullanım ve çerez verilerinizin işlenmesini kapsar.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. İşleme Amaçları</h2>
      <ul className="mb-4 list-disc pl-6">
        <li>Hizmetlerin sunulması ve yönetilmesi</li>
        <li>Kullanıcı deneyiminin iyileştirilmesi</li>
        <li>Pazarlama ve analiz faaliyetleri</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Rızanın Geri Alınması</h2>
      <p className="mb-4">Dilediğiniz zaman açık rızanızı geri çekme hakkına sahipsiniz. Bunun için <a href="/iletisim" className="text-blue-600 underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. İletişim</h2>
      <p className="mb-4">Açık rıza metni ve kişisel verilerinizin işlenmesiyle ilgili sorularınız için <a href="/iletisim" className="text-blue-600 underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
    </div>
  );
} 