import { NextResponse } from 'next/server';

export async function GET() {
  // Mock implementation - gerçek uygulamada database kullanılacak
  const mockListings = [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      description: 'Sıfır kutusunda iPhone 15 Pro',
      price: '45000',
      category: 'elektronik',
      subcategory: 'telefon',
      city: 'İstanbul',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'MacBook Pro M3',
      description: '14 inch MacBook Pro M3 çipli',
      price: '65000',
      category: 'elektronik',
      subcategory: 'bilgisayar',
      city: 'Ankara',
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ];
  
  return NextResponse.json(mockListings);
} 