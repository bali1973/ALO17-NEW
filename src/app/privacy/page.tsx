'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gizlilik Politikası</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Giriş</h2>
        <p className="mb-4">
          ALO17 olarak, gizliliğinize önem veriyoruz. Bu gizlilik politikası, 
          platformumuzu kullanırken kişisel verilerinizin nasıl toplandığını, 
          kullanıldığını ve korunduğunu açıklar.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Toplanan Bilgiler</h2>
        <p className="mb-4">Aşağıdaki bilgileri topluyoruz:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Ad, soyad ve iletişim bilgileri</li>
          <li>E-posta adresi</li>
          <li>Telefon numarası</li>
          <li>Adres bilgileri</li>
          <li>Ödeme bilgileri</li>
          <li>Kullanım istatistikleri</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Bilgilerin Kullanımı</h2>
        <p className="mb-4">Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
          <li>Hesabınızı yönetmek</li>
          <li>İletişim kurmak</li>
          <li>Güvenliği sağlamak</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Bilgi Güvenliği</h2>
        <p className="mb-4">
          Kişisel verilerinizin güvenliği bizim için önemlidir. Verilerinizi 
          korumak için uygun teknik ve organizasyonel önlemleri alıyoruz.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Çerezler</h2>
        <p className="mb-4">
          Platformumuzda çerezler kullanıyoruz. Çerezler, web sitemizi daha 
          iyi hale getirmek ve size daha iyi bir deneyim sunmak için kullanılır.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Üçüncü Taraflar</h2>
        <p className="mb-4">
          Kişisel verilerinizi, yasal zorunluluklar dışında üçüncü taraflarla 
          paylaşmıyoruz. Hizmet sağlayıcılarımızla yapılan paylaşımlar, 
          sıkı gizlilik anlaşmaları çerçevesinde gerçekleşir.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Haklarınız</h2>
        <p className="mb-4">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Kişisel verilerinize erişim</li>
          <li>Düzeltme talep etme</li>
          <li>Silme talep etme</li>
          <li>İşlemeyi kısıtlama</li>
          <li>Veri taşınabilirliği</li>
          <li>İtiraz etme</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. İletişim</h2>
        <p className="mb-4">
          Gizlilik politikamız hakkında sorularınız için bize e-posta yoluyla 
          ulaşabilirsiniz: privacy@alo17.com
        </p>
      </div>
    </div>
  );
} 