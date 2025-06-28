import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Premium durumu kontrol eden fonksiyon
export function isPremiumActive(premiumUntil: Date | null): boolean {
  if (!premiumUntil) return false;
  return new Date() < new Date(premiumUntil);
}

// Kalan premium gün sayısını hesaplayan fonksiyon
export function getRemainingPremiumDays(premiumUntil: Date | null): number {
  if (!premiumUntil) return 0;
  const now = new Date();
  const endDate = new Date(premiumUntil);
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Premium durumu metni
export function getPremiumStatusText(premiumUntil: Date | null): string {
  if (!premiumUntil) return "Ücretsiz";
  
  const remainingDays = getRemainingPremiumDays(premiumUntil);
  
  if (remainingDays === 0) {
    return "Premium Süresi Doldu";
  } else if (remainingDays <= 7) {
    return `${remainingDays} gün kaldı`;
  } else {
    return "Premium Aktif";
  }
}

// Premium plan sürelerini hesaplayan fonksiyon
export function calculatePremiumEndDate(plan: string): Date {
  const now = new Date();
  const endDate = new Date(now);
  
  switch (plan) {
    case '30days':
      endDate.setDate(now.getDate() + 30);
      break;
    case '90days':
      endDate.setDate(now.getDate() + 90);
      break;
    case '365days':
      endDate.setDate(now.getDate() + 365);
      break;
    default:
      endDate.setDate(now.getDate() + 30); // Varsayılan 30 gün
  }
  
  return endDate;
}

// Premium plan fiyatları
export const PREMIUM_PLANS = {
  '30days': { name: '30 Gün', price: 29.99, days: 30 },
  '90days': { name: '90 Gün', price: 79.99, days: 90 },
  '365days': { name: '1 Yıl', price: 299.99, days: 365 }
};

// Resim sayısını kontrol eden fonksiyon
export function validateImageCount(images: string[]): boolean {
  return images.length <= 5;
}

// Resim sayısı metni
export function getImageCountText(images: string[]): string {
  const count = images.length;
  return `${count}/5 resim`;
} 