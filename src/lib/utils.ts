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

// Performance optimization functions
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
} 