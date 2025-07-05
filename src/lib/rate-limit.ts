// Simple in-memory rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

export function rateLimit(identifier: string, config: RateLimitConfig): boolean {
  const { limit, windowMs } = config;
  const key = `rate_limit:${identifier}`;
  
  const now = Date.now();
  const current = rateLimitStore.get(key);
  
  if (!current || current.resetTime < now) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= limit) {
    return false;
  }
  
  current.count++;
  return true;
}

export function getRateLimitInfo(identifier: string): { count: number; resetTime: number; remaining: number } | null {
  const key = `rate_limit:${identifier}`;
  const current = rateLimitStore.get(key);
  
  if (!current) {
    return null;
  }
  
  const now = Date.now();
  if (current.resetTime < now) {
    rateLimitStore.delete(key);
    return null;
  }
  
  return {
    count: current.count,
    resetTime: current.resetTime,
    remaining: Math.max(0, 100 - current.count) // Assuming default limit of 100
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 60000); // Clean up every minute 