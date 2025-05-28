import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Tip tanımı
export type Listing = {
  id: number;
  title: string;
  price: string;
  location: string;
  category: string;
  subcategory: string;
  description: string;
  images: string[];
  date: string;
  condition: string;
  type: string;
  status: string;
  showPhone: boolean;
  isFavorite: boolean;
  views: number;
  favorites: number;
  seller: {
    name: string;
    rating: number;
    memberSince: string;
    phone: string;
    isVerified: boolean;
  };
  premiumFeatures: {
    isActive: boolean;
    expiresAt: string;
    isHighlighted: boolean;
    isFeatured: boolean;
    isUrgent: boolean;
  };
};

const featuredListings: Listing[] = [
  // Elektronik - Telefon
  {
    id: 1,
    title: "iPhone 14 Pro Max 256GB",
    price: "45.000",
    location: "Konak, İzmir",
    category: "Elektronik",
    subcategory: "Telefon",
    description: "Sıfır, kutusunda iPhone 14 Pro Max 256GB. Faturalı ve garantili.",
    images: [
      "/images/listings/iphone-14-pro-max-1.jpg"
    ],
    date: "2024-03-20",
    condition: "Sıfır",
    type: "premium",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 245,
    favorites: 12,
    seller: {
      name: "Ahmet Yılmaz",
      rating: 4.8,
      memberSince: "2023-01-15",
      phone: "0532 123 4567",
      isVerified: true,
    },
    premiumFeatures: {
      isActive: true,
      expiresAt: "2024-04-20",
      isHighlighted: true,
      isFeatured: true,
      isUrgent: false,
    },
  },
  // Elektronik - Bilgisayar
  {
    id: 2,
    title: "MacBook Pro 16'' M1 Max",
    price: "75.000",
    location: "Kadıköy, İstanbul",
    category: "Elektronik",
    subcategory: "Bilgisayar",
    description: "2022 model, 32GB RAM, 1TB SSD, kutulu ve faturalı.",
    images: [
      "/images/listings/macbook-pro-16-m1-max.jpg"
    ],
    date: "2024-03-18",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 120,
    favorites: 8,
    seller: {
      name: "Mehmet Kaya",
      rating: 4.6,
      memberSince: "2022-11-10",
      phone: "0553 987 6543",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Vasıta - Otomobil
  {
    id: 3,
    title: "2018 Volkswagen Golf 1.6 TDI Comfortline",
    price: "820.000",
    location: "Çankaya, Ankara",
    category: "Vasıta",
    subcategory: "Otomobil",
    description: "Hatasız, boyasız, 65.000 km, servis bakımlı.",
    images: [
      "/images/listings/vw-golf-2018.jpg"
    ],
    date: "2024-03-15",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 310,
    favorites: 20,
    seller: {
      name: "Selin Demir",
      rating: 4.9,
      memberSince: "2021-05-22",
      phone: "0544 222 3344",
      isVerified: true,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Vasıta - Motosiklet
  {
    id: 4,
    title: "2020 Yamaha MT-07 ABS",
    price: "210.000",
    location: "Osmangazi, Bursa",
    category: "Vasıta",
    subcategory: "Motosiklet",
    description: "Düşük km, bakımlı, orijinal parça.",
    images: [
      "/images/listings/yamaha-mt07-2020.jpg"
    ],
    date: "2024-03-10",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 95,
    favorites: 3,
    seller: {
      name: "Burak Şahin",
      rating: 4.7,
      memberSince: "2020-08-30",
      phone: "0535 111 2233",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Emlak - Konut
  {
    id: 5,
    title: "Satılık 3+1 Daire (120m²) - Bornova, İzmir",
    price: "3.200.000",
    location: "Bornova, İzmir",
    category: "Emlak",
    subcategory: "Konut",
    description: "Site içinde, asansörlü, otoparklı, yeni bina.",
    images: [
      "/images/listings/daire-bornova.jpg"
    ],
    date: "2024-03-12",
    condition: "Sıfır",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 180,
    favorites: 10,
    seller: {
      name: "Zeynep Aksoy",
      rating: 4.5,
      memberSince: "2021-03-12",
      phone: "0536 333 4455",
      isVerified: true,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Emlak - Arsa
  {
    id: 6,
    title: "Satılık Arsa 500m² - Urla, İzmir",
    price: "2.500.000",
    location: "Urla, İzmir",
    category: "Emlak",
    subcategory: "Arsa",
    description: "İmarlı, denize yakın, yatırım fırsatı.",
    images: [
      "/images/listings/arsa-urla.jpg"
    ],
    date: "2024-03-05",
    condition: "Sıfır",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 60,
    favorites: 2,
    seller: {
      name: "Ali Vural",
      rating: 4.2,
      memberSince: "2022-07-01",
      phone: "0537 444 5566",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Ev & Yaşam - Mobilya
  {
    id: 7,
    title: "Modern L Koltuk Takımı",
    price: "12.000",
    location: "Nilüfer, Bursa",
    category: "Ev & Yaşam",
    subcategory: "Mobilya",
    description: "Az kullanılmış, temiz, konforlu L koltuk.",
    images: [
      "/images/listings/l-koltuk.jpg"
    ],
    date: "2024-03-08",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 40,
    favorites: 1,
    seller: {
      name: "Gizem Yıldız",
      rating: 4.3,
      memberSince: "2023-02-18",
      phone: "0538 555 6677",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Moda - Giyim
  {
    id: 8,
    title: "Orijinal Nike Air Max 270",
    price: "2.200",
    location: "Beşiktaş, İstanbul",
    category: "Moda",
    subcategory: "Giyim",
    description: "Sıfır, kutusunda, orijinal Nike Air Max 270 spor ayakkabı.",
    images: [
      "/images/listings/nike-air-max-270.jpg"
    ],
    date: "2024-03-02",
    condition: "Sıfır",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 25,
    favorites: 0,
    seller: {
      name: "Emre Kılıç",
      rating: 4.1,
      memberSince: "2022-09-10",
      phone: "0539 666 7788",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
  // Diğer
  {
    id: 9,
    title: "Koleksiyonluk Antika Duvar Saati",
    price: "7.500",
    location: "Odunpazarı, Eskişehir",
    category: "Diğer",
    subcategory: "Antika",
    description: "Çalışır durumda, 1950'lerden kalma orijinal duvar saati.",
    images: [
      "/images/listings/antika-saat.jpg"
    ],
    date: "2024-03-01",
    condition: "İkinci El",
    type: "standart",
    status: "active",
    showPhone: true,
    isFavorite: false,
    views: 10,
    favorites: 0,
    seller: {
      name: "Fatma Gökçe",
      rating: 4.0,
      memberSince: "2021-12-05",
      phone: "0540 777 8899",
      isVerified: false,
    },
    premiumFeatures: {
      isActive: false,
      expiresAt: "",
      isHighlighted: false,
      isFeatured: false,
      isUrgent: false,
    },
  },
];

const ListingDetailPage = () => {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    if (params?.id) {
      const found = featuredListings.find((l) => l.id === Number(params.id));
      setListing(found || null);
    }
  }, [params]);

  if (!listing) return <div>İlan bulunamadı.</div>;

  return (
    <div>
      <h1>{listing.title}</h1>
      {/* Diğer detaylar ve görseller buraya eklenecek */}
    </div>
  );
};

export default ListingDetailPage; 