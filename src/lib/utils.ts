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