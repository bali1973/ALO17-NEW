import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-alo-dark mb-8">Kullanım Koşulları</h1>

      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          ALO17.TR platformunu kullanmadan önce lütfen aşağıdaki kullanım koşullarını dikkatlice okuyunuz. Platformu kullanarak bu koşulları kabul etmiş sayılırsınız.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">1. Genel Hükümler</h2>
          <p className="text-gray-600 mb-4">
            ALO17.TR, kullanıcılarına ilan verme, ilan görüntüleme ve alıcı-satıcı iletişimi sağlama hizmeti sunan bir platformdur. Platformu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Doğru ve güncel bilgiler vermek</li>
            <li>Başkalarının haklarına saygı göstermek</li>
            <li>Yasalara uygun davranmak</li>
            <li>Platform kurallarına uymak</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">2. Üyelik Koşulları</h2>
          <p className="text-gray-600 mb-4">
            Platform üyeliği için:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>18 yaşından büyük olmak</li>
            <li>Geçerli bir e-posta adresi kullanmak</li>
            <li>Doğru kişisel bilgiler vermek</li>
            <li>Hesap güvenliğini sağlamak</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">3. İlan Verme Kuralları</h2>
          <p className="text-gray-600 mb-4">
            İlan verirken dikkat edilmesi gerekenler:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Doğru ve güncel bilgiler içermeli</li>
            <li>Yasalara uygun olmalı</li>
            <li>Uygunsuz içerik barındırmamalı</li>
            <li>Telif haklarına saygılı olmalı</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">4. Sorumluluk Reddi</h2>
          <p className="text-gray-600 mb-4">
            ALO17.TR:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>İlanların doğruluğunu garanti etmez</li>
            <li>Kullanıcılar arasındaki anlaşmazlıklardan sorumlu değildir</li>
            <li>Platform kullanımından doğabilecek zararlardan sorumlu değildir</li>
            <li>Hizmet kesintilerinden sorumlu değildir</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">5. Fikri Mülkiyet Hakları</h2>
          <p className="text-gray-600 mb-4">
            Platform üzerindeki tüm içerikler ALO17.TR'nin fikri mülkiyetidir. İçeriklerin kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">6. Değişiklikler</h2>
          <p className="text-gray-600 mb-4">
            ALO17.TR, bu kullanım koşullarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Değişiklikler platform üzerinde yayınlandığı anda yürürlüğe girer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-alo-dark mb-4">7. İletişim</h2>
          <p className="text-gray-600 mb-4">
            Kullanım koşulları hakkında sorularınız için <a href="/iletisim" className="text-alo-orange hover:underline">iletişim sayfamızı</a> kullanabilirsiniz.
          </p>
        </section>
      </div>
    </div>
  );
} 