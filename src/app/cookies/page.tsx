'use client';

import React from 'react';

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Çerez Politikası</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          Son güncelleme tarihi: {new Date().toLocaleDateString('tr-TR')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Çerezler Hakkında</h2>
        <p className="mb-4">
          ALO17 olarak, web sitemizde çerezleri kullanıyoruz. Çerezler, web 
          sitemizi daha iyi hale getirmek ve size daha iyi bir deneyim sunmak 
          için kullanılan küçük metin dosyalarıdır.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Kullandığımız Çerez Türleri</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Zorunlu Çerezler</h3>
          <p className="mb-4">
            Bu çerezler web sitesinin düzgün çalışması için gereklidir. 
            Kullanıcı tercihlerini hatırlamak ve güvenlik önlemlerini 
            sağlamak için kullanılır.
          </p>

          <h3 className="text-xl font-semibold mb-2">Performans Çerezleri</h3>
          <p className="mb-4">
            Bu çerezler, web sitemizin performansını ölçmemize ve 
            iyileştirmemize yardımcı olur. Hangi sayfaların en çok 
            ziyaret edildiğini ve kullanıcıların sitede nasıl gezindiğini 
            anlamamızı sağlar.
          </p>

          <h3 className="text-xl font-semibold mb-2">İşlevsellik Çerezleri</h3>
          <p className="mb-4">
            Bu çerezler, size daha kişiselleştirilmiş bir deneyim sunmamıza 
            yardımcı olur. Dil tercihleriniz, konum bilgileriniz gibi 
            seçimlerinizi hatırlar.
          </p>

          <h3 className="text-xl font-semibold mb-2">Hedefleme/Reklam Çerezleri</h3>
          <p className="mb-4">
            Bu çerezler, size ilgi alanlarınıza uygun reklamlar göstermemize 
            yardımcı olur. Ayrıca reklam kampanyalarımızın etkinliğini 
            ölçmemizi sağlar.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Çerezleri Kontrol Etme</h2>
        <p className="mb-4">
          Tarayıcınızın ayarlarını değiştirerek çerezleri kontrol edebilir 
          veya engelleyebilirsiniz. Ancak bazı çerezleri devre dışı bırakmak, 
          web sitemizin bazı özelliklerinin düzgün çalışmamasına neden 
          olabilir.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Üçüncü Taraf Çerezleri</h2>
        <p className="mb-4">
          Web sitemizde, analiz ve reklam hizmetleri sağlayan üçüncü taraf 
          çerezleri de kullanılmaktadır. Bu çerezler, bu hizmet sağlayıcıları 
          tarafından yönetilir.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Çerez Politikası Değişiklikleri</h2>
        <p className="mb-4">
          Bu çerez politikasını zaman zaman güncelleyebiliriz. Önemli 
          değişiklikler olması durumunda, web sitemizde bir bildirim 
          yayınlayacağız.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. İletişim</h2>
        <p className="mb-4">
          Çerez politikamız hakkında sorularınız için: privacy@alo17.com
        </p>
      </div>
    </div>
  );
} 