export interface PremiumPlan {
  key: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  days: number;
  color: string;
}

export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    key: 'basic',
    name: 'Temel Premium',
    description: 'Temel premium özellikler',
    features: [
      'İlan öne çıkarılır',
      'Daha fazla görüntülenme',
      'Özel rozet'
    ],
    price: 29.99,
    days: 30,
    color: 'bg-blue-500'
  },
  {
    key: 'standard',
    name: 'Standart Premium',
    description: 'Gelişmiş premium özellikler',
    features: [
      'İlan öne çıkarılır',
      'Daha fazla görüntülenme',
      'Özel rozet',
      'Öncelikli sıralama',
      'Detaylı istatistikler'
    ],
    price: 49.99,
    days: 30,
    color: 'bg-green-500'
  },
  {
    key: 'premium',
    name: 'Premium',
    description: 'Tam premium deneyim',
    features: [
      'İlan öne çıkarılır',
      'Daha fazla görüntülenme',
      'Özel rozet',
      'Öncelikli sıralama',
      'Detaylı istatistikler',
      'Özel tema',
      '7/24 destek'
    ],
    price: 79.99,
    days: 30,
    color: 'bg-yellow-500'
  },
  {
    key: 'vip',
    name: 'VIP Premium',
    description: 'En üst düzey premium deneyim',
    features: [
      'İlan öne çıkarılır',
      'Daha fazla görüntülenme',
      'Özel rozet',
      'Öncelikli sıralama',
      'Detaylı istatistikler',
      'Özel tema',
      '7/24 destek',
      'Kişisel danışman',
      'Özel etkinlikler'
    ],
    price: 149.99,
    days: 30,
    color: 'bg-purple-500'
  }
];

export function getPremiumPlan(key: string): PremiumPlan | undefined {
  return PREMIUM_PLANS.find(plan => plan.key === key);
}

export function getPremiumPlanName(key: string): string {
  const plan = getPremiumPlan(key);
  return plan ? plan.name : 'Bilinmeyen Plan';
}

export function getPremiumPlanFeatures(key: string): string[] {
  const plan = getPremiumPlan(key);
  return plan ? plan.features : [];
}
