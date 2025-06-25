'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Check } from 'lucide-react';

export default function PremiumPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: '149,00',
      period: 'ay',
      features: [
        'Sınırsız ilan yayınlama',
        'Öne çıkan ilanlar',
        'Detaylı istatistikler',
        'Öncelikli destek',
        'Reklamsız deneyim'
      ]
    },
    yearly: {
      price: '1.639,00',
      period: 'yıl',
      features: [
        'Sınırsız ilan yayınlama',
        'Öne çıkan ilanlar',
        'Detaylı istatistikler',
        'Öncelikli destek',
        'Reklamsız deneyim',
        '2 Ay bedava'
      ]
    }
  };

  const handleSubscribe = () => {
    // Ödeme işlemleri burada yapılacak
    console.log('Seçilen plan:', selectedPlan);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Premium Üyelik</h1>
        <p className="text-gray-600">
          30 gün ücretsiz ilan paylaşımından sonra premium üyelik avantajlarından yararlanın
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border p-1">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedPlan === 'monthly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              Aylık
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedPlan === 'yearly'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              Yıllık
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {plans[selectedPlan].price} ₺
            </h2>
            <p className="text-gray-600">
              / {plans[selectedPlan].period}
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {plans[selectedPlan].features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Hemen Başla
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p>30 gün içinde iptal ederseniz ücret iadesi yapılır</p>
        </div>
      </div>
    </div>
  );
} 