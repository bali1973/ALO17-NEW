import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası - ALO17',
  description: 'ALO17 çerez politikası ve kullanım koşulları hakkında bilgi edinin.',
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      {children}
    </div>
  );
} 