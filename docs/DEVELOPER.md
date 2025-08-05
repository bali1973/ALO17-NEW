# Alo17 Geliştirici Dokümantasyonu

Bu dokümantasyon Alo17 projesine katkıda bulunmak isteyen geliştiriciler için hazırlanmıştır.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- **Node.js** 18.0.0 veya üzeri
- **npm** 9.0.0 veya üzeri
- **Git** 2.30.0 veya üzeri
- **PostgreSQL** 15.0 veya üzeri
- **Redis** 7.0 veya üzeri

### Kurulum

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/your-username/alo17.git
cd alo17
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment dosyasını oluşturun**
```bash
cp .env.example .env.local
```

4. **Environment değişkenlerini düzenleyin**
```bash
# .env.local dosyasını düzenleyin
DATABASE_URL="postgresql://user:password@localhost:5432/alo17"
NEXTAUTH_SECRET="your-secret-key"
```

5. **Database'i kurun**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

6. **Uygulamayı başlatın**
```bash
npm run dev
```

Uygulama http://localhost:3004 adresinde çalışacaktır.

---

## 📁 Proje Yapısı

```
alo17/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   └── [pages]/           # Public pages
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── styles/               # Global styles
├── prisma/                   # Database schema
├── public/                   # Static files
├── docs/                     # Documentation
├── scripts/                  # Build scripts
└── tests/                    # Test files
```

---

## 🛠️ Geliştirme Ortamı

### Kod Kalitesi

#### ESLint
```bash
# Lint kontrolü
npm run lint

# Lint düzeltme
npm run lint:fix
```

#### Prettier
```bash
# Kod formatı
npm run format

# Format kontrolü
npm run format:check
```

#### TypeScript
```bash
# Type check
npm run type-check
```

### Test

#### Unit Tests
```bash
# Tüm testleri çalıştır
npm test

# Watch modunda test
npm run test:watch

# Coverage raporu
npm run test:coverage
```

#### E2E Tests
```bash
# E2E testleri çalıştır
npm run test:e2e

# E2E testleri UI ile
npm run test:e2e:ui
```

#### Performance Tests
```bash
# Performance testleri
npm run test:performance
```

### Build

```bash
# Development build
npm run build:dev

# Production build
npm run build

# Build analizi
npm run analyze
```

---

## 🗄️ Database

### Schema

Prisma schema dosyası `prisma/schema.prisma` konumundadır.

#### Ana Modeller

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      Role     @default(USER)
  listings  Listing[]
  messages  Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Listing {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  category    String
  location    String
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  status      Status   @default(PENDING)
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Migration

```bash
# Yeni migration oluştur
npx prisma migrate dev --name migration_name

# Production migration
npx prisma migrate deploy

# Migration reset
npx prisma migrate reset
```

### Seed Data

```bash
# Seed data çalıştır
npx prisma db seed
```

---

## 🔧 API Geliştirme

### Yeni API Endpoint Ekleme

1. **API route dosyası oluşturun**
```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // API logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

2. **Validation ekleyin**
```typescript
import { z } from 'zod';

const createListingSchema = z.object({
  title: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createListingSchema.parse(body);
    // API logic
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    // Handle other errors
  }
}
```

3. **Authentication ekleyin**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // API logic
}
```

### Error Handling

```typescript
// src/lib/api-error.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { success: false, error: error.message, details: error.details },
      { status: error.statusCode }
    );
  }
  
  console.error('API Error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 🎨 Component Geliştirme

### Yeni Component Oluşturma

1. **Component dosyası oluşturun**
```typescript
// src/components/ExampleComponent.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ExampleComponentProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ExampleComponent({
  title,
  children,
  className,
}: ExampleComponentProps) {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
```

2. **Test dosyası oluşturun**
```typescript
// src/components/__tests__/ExampleComponent.test.tsx
import { render, screen } from '@testing-library/react';
import ExampleComponent from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders title correctly', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <ExampleComponent title="Test Title">
        <p>Test content</p>
      </ExampleComponent>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

3. **Story dosyası oluşturun (Storybook için)**
```typescript
// src/components/ExampleComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ExampleComponent from './ExampleComponent';

const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example Title',
  },
};

export const WithChildren: Story = {
  args: {
    title: 'Example Title',
    children: <p>This is some content</p>,
  },
};
```

### Styling

#### Tailwind CSS
```typescript
// Utility classes kullanın
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Button
  </button>
</div>
```

#### CSS Modules
```css
/* ExampleComponent.module.css */
.container {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
```

```typescript
import styles from './ExampleComponent.module.css';

export default function ExampleComponent({ title }: { title: string }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
```

---

## 🧪 Test Geliştirme

### Unit Test Örnekleri

#### Component Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/LoginForm';

// Mock hook
jest.mock('@/hooks/useAuth');

describe('LoginForm', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      login: jest.fn(),
      isLoading: false,
    });
  });

  it('renders login form', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const mockLogin = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

#### API Test
```typescript
import { GET, POST } from '@/app/api/listings/route';
import { NextRequest } from 'next/server';

describe('/api/listings', () => {
  it('GET returns listings', async () => {
    const request = new NextRequest('http://localhost:3000/api/listings');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.listings)).toBe(true);
  });

  it('POST creates listing', async () => {
    const listingData = {
      title: 'Test Listing',
      description: 'Test Description',
      price: 100,
      category: 'test',
    };

    const request = new NextRequest('http://localhost:3000/api/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.listing.title).toBe(listingData.title);
  });
});
```

### Integration Test
```typescript
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/listings/route';

describe('Listings API Integration', () => {
  it('handles complete workflow', async () => {
    // Test GET request
    const { req: getReq, res: getRes } = createMocks({
      method: 'GET',
      query: { page: '1', limit: '10' },
    });

    const getResponse = await GET(getReq);
    const getData = await getResponse.json();

    expect(getResponse.status).toBe(200);
    expect(getData.success).toBe(true);
    expect(getData.listings).toBeDefined();
  });
});
```

---

## 🔒 Güvenlik

### Authentication

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
};
```

### Authorization

```typescript
// src/lib/auth-guard.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  return session;
}

export async function requireRole(role: string) {
  return async (request: NextRequest) => {
    const session = await requireAuth(request);
    
    if (session.user.role !== role) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    return session;
  };
}
```

### Input Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description too short').max(1000, 'Description too long'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  condition: z.enum(['yeni', 'az kullanılmış', 'eski']),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  phone: z.string().regex(/^\+90[0-9]{10}$/, 'Invalid phone number'),
  location: z.string().min(1, 'Location is required'),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

---

## 📊 Performance

### Code Splitting

```typescript
// Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

// Route-based splitting
const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <div>Loading admin panel...</div>,
});
```

### Caching

```typescript
// API response caching
import { cache } from 'react';

export const getListings = cache(async (category?: string) => {
  const listings = await prisma.listing.findMany({
    where: category ? { category } : undefined,
    include: { user: true },
  });
  return listings;
});

// Redis caching
import { redis } from '@/lib/redis';

export async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchData();
  await redis.setex(key, 3600, JSON.stringify(data));
  return data;
}
```

### Image Optimization

```typescript
import Image from 'next/image';

export default function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={false}
    />
  );
}
```

---

## 🚀 Deployment

### Environment Variables

```bash
# Production
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://alo17.com

# Staging
NODE_ENV=staging
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://staging.alo17.com
```

### Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm run test:ci

# Build application
npm run build

# Start application
npm start
```

### Docker

```dockerfile
# Multi-stage build
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Katkıda Bulunma

### Pull Request Süreci

1. **Fork yapın**
2. **Feature branch oluşturun**
```bash
git checkout -b feature/amazing-feature
```

3. **Değişikliklerinizi commit edin**
```bash
git add .
git commit -m "feat: add amazing feature"
```

4. **Branch'inizi push edin**
```bash
git push origin feature/amazing-feature
```

5. **Pull Request oluşturun**

### Commit Mesajları

Conventional Commits standardını kullanın:

- `feat:` Yeni özellik
- `fix:` Hata düzeltmesi
- `docs:` Dokümantasyon değişikliği
- `style:` Kod formatı değişikliği
- `refactor:` Kod refactoring
- `test:` Test ekleme veya düzenleme
- `chore:` Build süreci veya yardımcı araç değişikliği

### Code Review

- Tüm PR'lar en az bir review almalı
- Test coverage %80'in üzerinde olmalı
- Lint ve type check geçmeli
- E2E testler geçmeli

---

## 📚 Kaynaklar

### Dokümantasyon

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Araçlar

- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API client

### Topluluk

- [Discord Server](https://discord.gg/alo17)
- [GitHub Discussions](https://github.com/your-username/alo17/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/alo17)

---

## 🆘 Yardım

### Geliştirici Desteği

- **E-posta**: dev-support@alo17.com
- **Discord**: #developer-support
- **GitHub Issues**: [Issues](https://github.com/your-username/alo17/issues)

### Debugging

```bash
# Debug modunda çalıştır
npm run dev:debug

# Log seviyesini artır
DEBUG=* npm run dev

# Database debug
DEBUG=prisma:* npm run dev
```

### Performance Profiling

```bash
# Bundle analizi
npm run analyze

# Performance test
npm run test:performance

# Lighthouse CI
npx lhci autorun
```

---

Bu dokümantasyon sürekli güncellenmektedir. Son güncellemeler için [docs/DEVELOPER.md](docs/DEVELOPER.md) adresini kontrol edin. 