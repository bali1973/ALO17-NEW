'use client';

import { ReactNode } from 'react';

// Bu bileşen artık sadece bir wrapper olarak kullanılıyor
// Gerçek auth logic Providers.tsx'te
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 