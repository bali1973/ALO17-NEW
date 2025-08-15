// Mock data for homepage
export const mockCategories = [
  {
    id: 1,
    name: 'Elektronik',
    slug: 'elektronik',
    icon: '📱',
    subcategories: [
      { id: 1, name: 'Telefon', slug: 'telefon' },
      { id: 2, name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 3, name: 'Tablet', slug: 'tablet' }
    ]
  },
  {
    id: 2,
    name: 'Araç',
    slug: 'arac',
    icon: '🚗',
    subcategories: [
      { id: 4, name: 'Otomobil', slug: 'otomobil' },
      { id: 5, name: 'Motosiklet', slug: 'motosiklet' },
      { id: 6, name: 'Ticari Araç', slug: 'ticari-arac' }
    ]
  },
  {
    id: 3,
    name: 'Emlak',
    slug: 'emlak',
    icon: '🏠',
    subcategories: [
      { id: 7, name: 'Konut', slug: 'konut' },
      { id: 8, name: 'İş Yeri', slug: 'is-yeri' },
      { id: 9, name: 'Arsa', slug: 'arsa' }
    ]
  },
  {
    id: 4,
    name: 'Moda',
    slug: 'moda',
    icon: '👕',
    subcategories: [
      { id: 10, name: 'Kadın Giyim', slug: 'kadin-giyim' },
      { id: 11, name: 'Erkek Giyim', slug: 'erkek-giyim' },
      { id: 12, name: 'Çocuk Giyim', slug: 'cocuk-giyim' }
    ]
  },
  {
    id: 5,
    name: 'Spor',
    slug: 'spor',
    icon: '⚽',
    subcategories: [
      { id: 13, name: 'Futbol', slug: 'futbol' },
      { id: 14, name: 'Basketbol', slug: 'basketbol' },
      { id: 15, name: 'Fitness', slug: 'fitness' }
    ]
  }
];

export const mockListings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max - Mükemmel Durumda',
    price: '25.000 TL',
    location: 'İstanbul',
    city: 'İstanbul',
    description: 'Çok az kullanılmış, kutulu iPhone 14 Pro Max. Garantisi devam ediyor.',
    category: 'Elektronik',
    subcategory: 'Telefon',
    isPremium: true,
    imageUrl: '/images/iphone.jpg',
    createdAt: '2025-08-15',
    views: 156,
    condition: 'Az Kullanılmış',
    status: 'active' as const
  },
  {
    id: 2,
    title: '2019 Model BMW 320i',
    price: '850.000 TL',
    location: 'Ankara',
    city: 'Ankara',
    description: 'Tek sahibinden, bakımlı, düşük kilometreli BMW 320i.',
    category: 'Araç',
    subcategory: 'Otomobil',
    isPremium: true,
    imageUrl: '/images/bmw.jpg',
    createdAt: '2025-08-14',
    views: 89,
    condition: 'İyi',
    status: 'active' as const
  },
  {
    id: 3,
    title: '3+1 Satılık Daire',
    price: '2.500.000 TL',
    location: 'İzmir',
    city: 'İzmir',
    description: 'Merkezi konumda, yeni yapılmış, 3+1 satılık daire.',
    category: 'Emlak',
    subcategory: 'Konut',
    isPremium: false,
    imageUrl: '/images/daire.jpg',
    createdAt: '2025-08-13',
    views: 234,
    condition: 'Yeni',
    status: 'active' as const
  },
  {
    id: 4,
    title: 'Nike Air Max 270',
    price: '1.200 TL',
    location: 'Bursa',
    city: 'Bursa',
    description: 'Orijinal, kutusunda Nike Air Max 270 spor ayakkabı.',
    category: 'Moda',
    subcategory: 'Erkek Giyim',
    isPremium: false,
    imageUrl: '/images/nike.jpg',
    createdAt: '2025-08-12',
    views: 67,
    condition: 'Yeni',
    status: 'active'
  },
  {
    id: 5,
    title: 'PS5 + 2 Oyun',
    price: '18.000 TL',
    location: 'Antalya',
    city: 'Antalya',
    description: 'PlayStation 5 konsol + FIFA 24 ve GTA 6 oyunları.',
    category: 'Elektronik',
    subcategory: 'Bilgisayar',
    isPremium: true,
    imageUrl: '/images/ps5.jpg',
    createdAt: '2025-08-11',
    views: 198,
    condition: 'Az Kullanılmış',
    status: 'active'
  },
  {
    id: 6,
    title: 'Adidas Predator Futbol Topu',
    price: '450 TL',
    location: 'Trabzon',
    city: 'Trabzon',
    description: 'Profesyonel futbol topu, orijinal Adidas.',
    category: 'Spor',
    subcategory: 'Futbol',
    isPremium: false,
    imageUrl: '/images/futbol-topu.jpg',
    createdAt: '2025-08-10',
    views: 45,
    condition: 'Yeni',
    status: 'active'
  }
];
