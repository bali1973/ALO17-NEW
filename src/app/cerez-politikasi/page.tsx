'use client';

import React from 'react';

import { Cookie, Settings, Info, Shield } from 'lucide-react';

export default function CerezPolitikasiPage() {
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Çerez Politikası</h1>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Çerez Nedir?</h2>
      <p className="mb-4">Çerezler, ziyaret ettiğiniz web siteleri tarafından tarayıcınıza veya cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, sitenin daha verimli çalışmasını sağlamak, kullanıcı deneyimini geliştirmek ve bazı bilgileri toplamak için kullanılır.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Hangi Çerezler Kullanılıyor?</h2>
      <ul className="mb-4 list-disc pl-6">
        <li><b>Zorunlu Çerezler:</b> Sitenin temel işlevlerini yerine getirmesi için gereklidir.</li>
        <li><b>Analitik Çerezler:</b> Sitenin kullanımını analiz ederek performans ve iyileştirme sağlar.</li>
        <li><b>İşlevsel Çerezler:</b> Tercihlerinizi hatırlayarak kişiselleştirilmiş bir deneyim sunar.</li>
        <li><b>Reklam/Pazarlama Çerezleri:</b> İlgi alanlarınıza uygun reklamlar gösterilmesini sağlar.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Çerezler Ne Amaçla Kullanılır?</h2>
      <p className="mb-4">Çerezler, siteyi ziyaret eden kullanıcıların tercihlerini hatırlamak, oturum yönetimi sağlamak, istatistik toplamak ve reklam/pazarlama faaliyetlerini yürütmek amacıyla kullanılabilir.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Çerezleri Nasıl Kontrol Edebilirsiniz?</h2>
      <p className="mb-4">Çoğu tarayıcı çerezleri otomatik olarak kabul eder. Dilerseniz tarayıcı ayarlarından çerezleri engelleyebilir veya mevcut çerezleri silebilirsiniz. Ancak, bazı çerezlerin devre dışı bırakılması sitenin bazı işlevlerinin çalışmamasına neden olabilir.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Çerezlerin Saklama Süresi</h2>
      <p className="mb-4">Çerezler, oturum süresince (oturum çerezleri) veya belirli bir süre boyunca (kalıcı çerezler) cihazınızda saklanabilir. Saklama süresi çerezin türüne göre değişiklik gösterebilir.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Üçüncü Taraf Çerezler</h2>
      <p className="mb-4">Sitemizde üçüncü taraf hizmet sağlayıcılar (ör. analiz araçları, reklam ağları) tarafından yerleştirilen çerezler de kullanılabilir. Bu çerezler, ilgili üçüncü tarafların gizlilik politikalarına tabidir.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">7. Çerez Politikası Değişiklikleri</h2>
      <p className="mb-4">Çerez politikamızda zaman zaman güncellemeler yapılabilir. Güncel politika her zaman bu sayfada yayınlanır.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">8. İletişim</h2>
      <p className="mb-4">Çerezler ve gizlilik uygulamalarımız hakkında sorularınız için <a href="/iletisim" className="text-blue-600 underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.</p>
    </div>
  );
} 
