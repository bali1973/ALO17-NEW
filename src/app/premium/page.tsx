'use client';

import { useState } from 'react';
import { StarIcon, SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const premiumFeatures = [
  {
    id: 'featured',
    name: 'Öne Çıkan İlan',
    price: 50,
    description: 'İlanınız ana sayfada öne çıkarılır',
    icon: <StarIconSolid className="w-6 h-6 text-yellow-500" />,
    benefits: [
      'Ana sayfada üst sıralarda görünür',
      'Daha fazla görüntülenme',
      '7 gün boyunca aktif',
      'Özel rozet ile işaretlenir'
    ]
  },
  {
    id: 'urgent',
    name: 'Acil İlan',
    price: 30,
    description: 'İlanınız acil olarak işaretlenir',
    icon: <SparklesIcon className="w-6 h-6 text-red-500" />,
    benefits: [
      'Acil rozeti ile işaretlenir',
      'Arama sonuçlarında öne çıkar',
      '5 gün boyunca aktif',
      'Dikkat çekici tasarım'
    ]
  },
  {
    id: 'highlighted',
    name: 'Vurgulanmış İlan',
    price: 25,
    description: 'İlanınız renkli çerçeve ile vurgulanır',
    icon: <SparklesIcon className="w-6 h-6 text-blue-500" />,
    benefits: [
      'Renkli çerçeve ile vurgulanır',
      'Arama sonuçlarında öne çıkar',
      '10 gün boyunca aktif',
      'Profesyonel görünüm'
    ]
  },
  {
    id: 'top',
    name: 'Üst Sıralarda',
    price: 40,
    description: 'İlanınız kategoride üst sıralarda görünür',
    icon: <StarIcon className="w-6 h-6 text-green-500" />,
    benefits: [
      'Kategori sayfalarında üst sıralarda',
      'Daha fazla tıklama',
      '14 gün boyunca aktif',
      'Rekabet avantajı'
    ]
  }
];

const premiumPlans = [
  {
    name: 'Başlangıç',
    price: 99,
    period: 'ay',
    features: [
      '1 Öne Çıkan İlan',
      '2 Acil İlan',
      '3 Vurgulanmış İlan',
      'Temel destek',
      '30 gün geçerli'
    ],
    popular: false
  },
  {
    name: 'Profesyonel',
    price: 199,
    period: 'ay',
    features: [
      '3 Öne Çıkan İlan',
      '5 Acil İlan',
      '10 Vurgulanmış İlan',
      'Öncelikli destek',
      '60 gün geçerli',
      'İstatistik raporları'
    ],
    popular: true
  },
  {
    name: 'Kurumsal',
    price: 399,
    period: 'ay',
    features: [
      'Sınırsız Öne Çıkan İlan',
      'Sınırsız Acil İlan',
      'Sınırsız Vurgulanmış İlan',
      '7/24 destek',
      '90 gün geçerli',
      'Detaylı analitik',
      'Özel hesap yöneticisi'
    ],
    popular: false
  }
];

export default function PremiumPage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-alo-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-alo-orange to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Premium Özellikler
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              İlanlarınızı öne çıkarın, daha fazla satış yapın
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-alo-orange px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Hemen Başla
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-alo-orange transition-colors">
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Özellikler */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-alo-dark mb-4">
            Premium Özellikler
          </h2>
          <p className="text-gray-600 text-lg">
            İlanlarınızı daha görünür hale getirin ve satışlarınızı artırın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {premiumFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all cursor-pointer ${
                selectedFeature === feature.id
                  ? 'border-alo-orange shadow-lg'
                  : 'border-gray-200 hover:border-alo-orange hover:shadow-md'
              }`}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-alo-dark mb-2">
                  {feature.name}
                </h3>
                <p className="text-2xl font-bold text-alo-orange mb-2">
                  {feature.price} ₺
                </p>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>

              {selectedFeature === feature.id && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-alo-dark mb-3">Özellikler:</h4>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-alo-orange text-white py-2 px-4 rounded-lg mt-4 hover:bg-orange-600 transition-colors">
                    Satın Al
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Premium Planlar */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-alo-dark mb-4">
            Premium Planlar
          </h2>
          <p className="text-gray-600 text-lg">
            İhtiyacınıza uygun planı seçin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-sm p-8 border-2 relative ${
                plan.popular
                  ? 'border-alo-orange shadow-lg scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-alo-orange text-white px-4 py-2 rounded-full text-sm font-semibold">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-alo-dark mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-alo-orange">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">₺/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-alo-orange text-white hover:bg-orange-600'
                    : 'bg-gray-100 text-alo-dark hover:bg-gray-200'
                }`}
              >
                {plan.popular ? 'Hemen Başla' : 'Planı Seç'}
              </button>
            </div>
          ))}
        </div>

        {/* İstatistikler */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-alo-dark mb-4">
              Premium Avantajları
            </h2>
            <p className="text-gray-600 text-lg">
              Premium kullanıcılarımızın başarı hikayeleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-alo-orange mb-2">3x</div>
              <p className="text-gray-600">Daha fazla görüntülenme</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-alo-orange mb-2">2.5x</div>
              <p className="text-gray-600">Daha hızlı satış</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-alo-orange mb-2">89%</div>
              <p className="text-gray-600">Müşteri memnuniyeti</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-alo-orange mb-2">24s</div>
              <p className="text-gray-600">Ortalama yanıt süresi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 