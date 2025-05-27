import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-alo-dark mb-8">Hakkımızda</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          ALO17.TR, Türkiye'nin önde gelen ilan platformlarından biridir. Amacımız, alıcı ve satıcıları güvenli bir ortamda buluşturmak ve alışveriş süreçlerini kolaylaştırmaktır.
        </p>

        <h2 className="text-2xl font-semibold text-alo-dark mt-8 mb-4">Misyonumuz</h2>
        <p className="text-gray-600 mb-6">
          Kullanıcılarımıza güvenli, hızlı ve kullanıcı dostu bir platform sunarak, alışveriş deneyimlerini en üst düzeye çıkarmak ve Türkiye'nin dijital alışveriş ekosistemine değer katmak.
        </p>

        <h2 className="text-2xl font-semibold text-alo-dark mt-8 mb-4">Vizyonumuz</h2>
        <p className="text-gray-600 mb-6">
          Türkiye'nin en güvenilir ve kullanıcı dostu ilan platformu olmak, teknolojik yeniliklerle sürekli kendimizi geliştirmek ve kullanıcılarımıza en iyi hizmeti sunmak.
        </p>

        <h2 className="text-2xl font-semibold text-alo-dark mt-8 mb-4">Değerlerimiz</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Güvenilirlik ve şeffaflık</li>
          <li>Kullanıcı odaklılık</li>
          <li>Yenilikçilik</li>
          <li>Kaliteli hizmet</li>
          <li>Sürekli gelişim</li>
        </ul>

        <h2 className="text-2xl font-semibold text-alo-dark mt-8 mb-4">Neden Biz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-alo-dark mb-3">Güvenli Alışveriş</h3>
            <p className="text-gray-600">
              Kullanıcılarımızın güvenliği bizim için önceliklidir. Tüm ilanlar ve kullanıcılar doğrulanır.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-alo-dark mb-3">Kolay Kullanım</h3>
            <p className="text-gray-600">
              Kullanıcı dostu arayüzümüz ile ilan vermek ve almak çok kolay.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-alo-dark mb-3">7/24 Destek</h3>
            <p className="text-gray-600">
              Teknik destek ekibimiz her zaman yanınızda.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-alo-dark mb-3">Geniş Kategori</h3>
            <p className="text-gray-600">
              Elektronikten iş makinelerine kadar geniş kategori seçenekleri.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 