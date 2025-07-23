# Geliştirici Kılavuzu

Alo17.tr platformunda geliştirme yapmak için kapsamlı kılavuz.

## 🎯 Başlangıç

### Geliştirme Ortamı Kurulumu

```bash
# 1. Repository'yi klonlayın
git clone https://github.com/bali1973/ALO17-NEW.git
cd ALO17-NEW

# 2. Node.js bağımlılıklarını yükleyin
npm install

# 3. Environment variables'ları ayarlayın
cp .env.example .env.local

# 4. Veritabanını başlatın
npx prisma generate
npx prisma db push
npx prisma db seed

# 5. Geliştirme sunucusunu başlatın
npm run dev
```

## 🏗️ Proje Mimarisi

### Klasör Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route grupları
│   ├── api/               # API endpoints
│   ├── globals.css        # Global stiller
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── forms/            # Form bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── __tests__/        # Bileşen testleri
├── hooks/                 # Custom React hooks
├── lib/                   # Utility fonksiyonları
│   ├── auth.ts           # Authentication logic
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Form validations
├── types/                 # TypeScript type definitions
└── services/              # External service integrations
```

## 🔧 Temel Kavramlar

### 1. Bileşen Geliştirme

#### Bileşen Oluşturma Kuralları

```typescript
// components/ExampleComponent.tsx
import React from 'react';

interface ExampleComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export default function ExampleComponent({
  title,
  description,
  onAction
}: ExampleComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
      {onAction && (
        <button 
          onClick={onAction}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Action
        </button>
      )}
    </div>
  );
}
```

#### Test Yazma

```typescript
// components/__tests__/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const mockAction = jest.fn();
    render(
      <ExampleComponent 
        title="Test" 
        onAction={mockAction} 
      />
    );
    
    fireEvent.click(screen.getByText('Action'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});
```

### 2. API Endpoint Geliştirme

#### GET Endpoint

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      prisma.example.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.example.count()
    ]);
    
    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

#### POST Endpoint

```typescript
// app/api/example/route.ts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    const { title, description } = body;
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    // Create item
    const item = await prisma.example.create({
      data: {
        title,
        description,
        userId: 'current-user-id' // Get from auth
      }
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### 3. Database İşlemleri

#### Prisma Schema

```prisma
// prisma/schema.prisma
model Example {
  id          String   @id @default(cuid())
  title       String
  description String?
  published   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("examples")
}
```

#### Database Queries

```typescript
// lib/database/examples.ts
import { prisma } from '@/lib/prisma';

export async function getExamples(filters: {
  userId?: string;
  published?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, published, search, page = 1, limit = 20 } = filters;
  
  const where = {
    ...(userId && { userId }),
    ...(published !== undefined && { published }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };
  
  const [items, total] = await Promise.all([
    prisma.example.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.example.count({ where })
  ]);
  
  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

## 🎨 UI/UX Geliştirme

### Tailwind CSS Kullanımı

#### Temel Sınıflar

```typescript
// Responsive tasarım
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobil: full width, tablet: 1/2, desktop: 1/3 */}
</div>

// Hover efektleri
<button className="bg-blue-500 hover:bg-blue-600 transition-colors">
  Hover Effect
</button>

// Dark mode desteği
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  Dark Mode
</div>
```

#### Component Variants

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// components/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-600 text-white hover:bg-gray-700': variant === 'secondary',
          'border border-gray-300 hover:bg-gray-50': variant === 'outline',
        },
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        }
      )}
    >
      {children}
    </button>
  );
}
```

## 📱 State Yönetimi

### React Hooks

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Custom Hooks

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';
import { cachedFetch } from '@/lib/apiCache';

export function useApi<T>(url: string | null, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await cachedFetch<T>(url, options);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
}
```

## 🔒 Güvenlik

### Authentication Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // API route koruması
  if (request.nextUrl.pathname.startsWith('/api/protected')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    try {
      const user = await verifyToken(token);
      // Token'ı header'a ekle
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      return response;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*', '/admin/:path*']
};
```

### Input Validation

```typescript
// lib/validations.ts
import { z } from 'zod';

export const listingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.string().regex(/^\d+$/, 'Price must be a number'),
  category: z.string().min(1),
  city: z.string().min(1),
  images: z.array(z.string().url()).max(5)
});

export type ListingInput = z.infer<typeof listingSchema>;
```

## 🧪 Testing Stratejisi

### Test Kategorileri

1. **Unit Tests**: Bileşenler ve fonksiyonlar
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Kullanıcı senaryoları

### Test Komutları

```bash
# Tüm testler
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E testler
npm run test:e2e
```

## 📊 Performance Monitoring

### Core Web Vitals

```typescript
// lib/performance.ts
export function measurePerformance() {
  // LCP (Largest Contentful Paint)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID (First Input Delay)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // CLS (Cumulative Layout Shift)
  new PerformanceObserver((entryList) => {
    let cls = 0;
    entryList.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        cls += entry.value;
      }
    });
    console.log('CLS:', cls);
  }).observe({ entryTypes: ['layout-shift'] });
}
```

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Build analysis
npm run analyze

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Configuration

```typescript
// lib/config.ts
export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
  firebase: {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
};
```

## 🐛 Debugging

### Development Tools

```typescript
// lib/logger.ts
export class Logger {
  static info(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
    
    // Production'da error tracking servisine gönder
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, vb.
    }
  }

  static warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data);
  }
}
```

## 📝 Code Review Checklist

- [ ] TypeScript tipleri doğru tanımlanmış
- [ ] Error handling implement edilmiş
- [ ] Test coverage yeterli (%80+)
- [ ] Performance optimizasyonları uygulanmış
- [ ] Security best practices takip edilmiş
- [ ] Accessibility standartları karşılanmış
- [ ] Mobile responsive tasarım
- [ ] SEO optimizasyonları yapılmış

## 📞 Destek

- **Technical Issues**: dev@alo17.tr
- **Code Review**: Slack #code-review
- **Documentation**: [GitHub Wiki](https://github.com/bali1973/ALO17-NEW/wiki) 