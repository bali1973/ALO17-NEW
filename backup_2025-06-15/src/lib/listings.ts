export interface Listing {
  id: number
  title: string
  price: string
  location: string
  description: string
  category: string
  subcategory: string
  isPremium: boolean
  premiumUntil: Date | null
  features: string[]
  imageUrl: string
  seller: {
    id: string
    name: string
    email: string
    phone: string
  }
  createdAt: Date
  views: number
  condition: string
  brand: string
  model: string
  year: number
}

export const listings: Listing[] = [
  // Elektronik - Telefon
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB",
    price: "45.000 TL",
    location: "İstanbul",
    description: "Apple iPhone 14 Pro Max 256GB, Uzay Siyahı, 1 yıl garantili, kutulu ve faturası mevcut.",
    category: "elektronik",
    subcategory: "telefon",
    isPremium: true,
    premiumUntil: new Date("2024-12-31"),
    features: ["256GB Depolama", "6.7 inç Ekran", "48MP Kamera", "Face ID"],
    imageUrl: "https://picsum.photos/seed/iphone14/500/300",
    seller: {
      id: "1",
      name: "Apple Türkiye",
      email: "info@appleturkiye.com",
      phone: "0212 123 4567",
    },
    createdAt: new Date("2024-01-15"),
    views: 1250,
    condition: "Yeni",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    year: 2023,
  },
  {
    id: 2,
    title: "Samsung Galaxy S23 Ultra",
    price: "38.000 TL",
    location: "Ankara",
    description: "Samsung Galaxy S23 Ultra 512GB, Phantom Black, 2 yıl garantili, aksesuarları ile birlikte.",
    category: "elektronik",
    subcategory: "telefon",
    isPremium: false,
    premiumUntil: null,
    features: ["512GB Depolama", "6.8 inç Ekran", "200MP Kamera", "S Pen"],
    imageUrl: "https://picsum.photos/seed/s23ultra/500/300",
    seller: {
      id: "2",
      name: "Samsung Store",
      email: "info@samsungstore.com",
      phone: "0312 987 6543",
    },
    createdAt: new Date("2024-02-01"),
    views: 850,
    condition: "Yeni",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    year: 2023,
  },

  // Elektronik - Bilgisayar
  {
    id: 3,
    title: "MacBook Pro M2 16 inç",
    price: "65.000 TL",
    location: "İzmir",
    description: "Apple MacBook Pro M2 Pro çip, 16GB RAM, 512GB SSD, Space Gray, 1 yıl garantili.",
    category: "elektronik",
    subcategory: "bilgisayar",
    isPremium: true,
    premiumUntil: new Date("2024-12-31"),
    features: ["M2 Pro Çip", "16GB RAM", "512GB SSD", "16 inç Retina Ekran"],
    imageUrl: "https://picsum.photos/seed/macbookpro/500/300",
    seller: {
      id: "3",
      name: "Apple Premium Reseller",
      email: "info@applepremium.com",
      phone: "0232 456 7890",
    },
    createdAt: new Date("2024-01-20"),
    views: 1500,
    condition: "Yeni",
    brand: "Apple",
    model: "MacBook Pro",
    year: 2023,
  },
  {
    id: 4,
    title: "Lenovo ThinkPad X1 Carbon",
    price: "42.000 TL",
    location: "İstanbul",
    description: "Lenovo ThinkPad X1 Carbon, Intel i7, 16GB RAM, 1TB SSD, Windows 11 Pro.",
    category: "elektronik",
    subcategory: "bilgisayar",
    isPremium: false,
    premiumUntil: null,
    features: ["Intel i7", "16GB RAM", "1TB SSD", "14 inç 4K Ekran"],
    imageUrl: "https://picsum.photos/seed/thinkpad/500/300",
    seller: {
      id: "4",
      name: "Lenovo Türkiye",
      email: "info@lenovoturkiye.com",
      phone: "0216 789 0123",
    },
    createdAt: new Date("2024-02-05"),
    views: 720,
    condition: "Yeni",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    year: 2023,
  },

  // Elektronik - Tablet
  {
    id: 5,
    title: "iPad Pro 12.9 inç M2",
    price: "35.000 TL",
    location: "Ankara",
    description: "Apple iPad Pro 12.9 inç, M2 çip, 256GB, Wi-Fi + Cellular, 2. Nesil Apple Pencil ile birlikte.",
    category: "elektronik",
    subcategory: "tablet",
    isPremium: true,
    premiumUntil: new Date("2024-12-31"),
    features: ["M2 Çip", "256GB Depolama", "12.9 inç Liquid Retina XDR", "Apple Pencil 2"],
    imageUrl: "https://picsum.photos/seed/ipadpro/500/300",
    seller: {
      id: "5",
      name: "Apple Store",
      email: "info@applestore.com",
      phone: "0312 345 6789",
    },
    createdAt: new Date("2024-01-25"),
    views: 980,
    condition: "Yeni",
    brand: "Apple",
    model: "iPad Pro",
    year: 2023,
  },
  {
    id: 6,
    title: "Samsung Galaxy Tab S9 Ultra",
    price: "28.000 TL",
    location: "İstanbul",
    description: "Samsung Galaxy Tab S9 Ultra, 14.6 inç, 256GB, Wi-Fi, S Pen ile birlikte.",
    category: "elektronik",
    subcategory: "tablet",
    isPremium: false,
    premiumUntil: null,
    features: ["Snapdragon 8 Gen 2", "256GB Depolama", "14.6 inç AMOLED", "S Pen"],
    imageUrl: "https://picsum.photos/seed/tabs9/500/300",
    seller: {
      id: "6",
      name: "Samsung Store",
      email: "info@samsungstore.com",
      phone: "0212 567 8901",
    },
    createdAt: new Date("2024-02-10"),
    views: 650,
    condition: "Yeni",
    brand: "Samsung",
    model: "Galaxy Tab S9 Ultra",
    year: 2023,
  },

  // Ev Eşyaları - Mobilya
  {
    id: 7,
    title: "Bellona 3+2 Köşe Takım",
    price: "32.000 TL",
    location: "İzmir",
    description: "Bellona 3+2 köşe takım, gri renk, yeni, montaj dahil.",
    category: "ev-esyalari",
    subcategory: "mobilya",
    isPremium: true,
    premiumUntil: new Date("2024-12-31"),
    features: ["3+2 Köşe", "Gri Renk", "Montaj Dahil", "2 Yıl Garanti"],
    imageUrl: "https://picsum.photos/seed/bellona/500/300",
    seller: {
      id: "7",
      name: "Bellona Mobilya",
      email: "info@bellona.com",
      phone: "0232 234 5678",
    },
    createdAt: new Date("2024-01-30"),
    views: 1100,
    condition: "Yeni",
    brand: "Bellona",
    model: "3+2 Köşe Takım",
    year: 2024,
  },

  // Ev Eşyaları - Beyaz Eşya
  {
    id: 8,
    title: "Bosch Çamaşır Makinesi",
    price: "18.000 TL",
    location: "Ankara",
    description: "Bosch WAT2848STR A+++ 9 kg Çamaşır Makinesi, Beyaz, 2 yıl garantili.",
    category: "ev-esyalari",
    subcategory: "beyaz-esya",
    isPremium: false,
    premiumUntil: null,
    features: ["9 kg Yıkama", "A+++ Enerji", "Hızlı Yıkama", "2 Yıl Garanti"],
    imageUrl: "https://picsum.photos/seed/bosch/500/300",
    seller: {
      id: "8",
      name: "Bosch Türkiye",
      email: "info@bosch.com",
      phone: "0312 456 7890",
    },
    createdAt: new Date("2024-02-15"),
    views: 780,
    condition: "Yeni",
    brand: "Bosch",
    model: "WAT2848STR",
    year: 2024,
  },

  // Ev Eşyaları - Mutfak Gereçleri
  {
    id: 9,
    title: "Philips Airfryer XXL",
    price: "8.500 TL",
    location: "İstanbul",
    description: "Philips Airfryer XXL HD9650/90, 4.1L kapasite, dijital ekran, 2 yıl garantili.",
    category: "ev-esyalari",
    subcategory: "mutfak-gerecleri",
    isPremium: true,
    premiumUntil: new Date("2024-12-31"),
    features: ["4.1L Kapasite", "Dijital Ekran", "Yağsız Pişirme", "2 Yıl Garanti"],
    imageUrl: "https://picsum.photos/seed/philips/500/300",
    seller: {
      id: "9",
      name: "Philips Türkiye",
      email: "info@philips.com",
      phone: "0212 345 6789",
    },
    createdAt: new Date("2024-02-20"),
    views: 920,
    condition: "Yeni",
    brand: "Philips",
    model: "Airfryer XXL",
    year: 2024,
  }
] 