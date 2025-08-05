import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Premium planları getir
export async function getPremiumPlans() {
  try {
    const response = await fetch('/api/premium/plans');
    if (response.ok) {
      const data = await response.json();
      return data.plans || [];
    }
    return [];
  } catch (error) {
    console.error('Premium planları alınamadı:', error);
    return [];
  }
}

// Premium özellikleri getir
export async function getPremiumFeatures() {
  try {
    const response = await fetch('/api/premium/features');
    if (response.ok) {
      const data = await response.json();
      return data.features || [];
    }
    return [];
  } catch (error) {
    console.error('Premium özellikleri alınamadı:', error);
    return [];
  }
} 