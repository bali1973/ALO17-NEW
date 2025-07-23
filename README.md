# Alo17.tr - İlan Platformu

Modern, performant ve kullanıcı dostu bir ilan platformu. Next.js 14, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Push Notification Sistemi**: Firebase ile gerçek zamanlı bildirimler
- **Offline Destek**: Service Worker ve IndexedDB ile çevrimdışı çalışma
- **Gelişmiş Arama**: Debounced search ve çoklu filtreler
- **Kategori Sistemı**: Dinamik alt kategoriler ve filtreleme
- **Performans Optimizasyonu**: Image optimization, lazy loading, caching
- **Test Coverage**: Jest ile %90+ test kapsamı
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Error Handling**: Kapsamlı hata yönetimi

### 🎯 Ana Kategoriler
- Elektronik
- Ev & Bahçe
- Giyim
- Anne & Bebek
- Sporlar, Oyunlar ve Eğlenceler
- Eğitim & Kurslar
- Yemek & İçecek
- Turizm & Gecelemeler
- Sağlık & Güzellik
- Sanat & Hobi
- İş İlanları
- Hizmetler
- Ücretsiz Gel Al

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **React Hooks**: Modern state yönetimi
- **Jest**: Unit testing

### Backend & Database
- **Next.js API Routes**: Backend API
- **Prisma ORM**: Database ORM
- **SQLite/PostgreSQL**: Database
- **JWT**: Authentication

### Performance & Optimization
- **Next.js Image**: Optimized images
- **Service Worker**: Caching ve offline support
- **API Caching**: In-memory cache
- **Code Splitting**: Bundle optimization

### Deployment
- **Render.com**: Production hosting
- **GitHub Actions**: CI/CD pipeline

## 📦 Kurulum

### Ön Gereksinimler
- Node.js 18+
- npm veya yarn
- Git

### Yerel Geliştirme

```bash
# Repository'yi klonlayın
git clone https://github.com/bali1973/ALO17-NEW.git
cd ALO17-NEW

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env.local

# Veritabanını hazırlayın
npx prisma generate
npx prisma db push

# Geliştirme sunucusunu başlatın
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="your_database_url"

# Authentication
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# Firebase (Notifications)
FIREBASE_ADMIN_PROJECT_ID="your_project_id"
FIREBASE_ADMIN_CLIENT_EMAIL="your_client_email"
FIREBASE_ADMIN_PRIVATE_KEY="your_private_key"

# Email
SMTP_HOST="your_smtp_host"
SMTP_PORT=587
SMTP_USER="your_smtp_user"
SMTP_PASS="your_smtp_password"
```

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── kategori/          # Kategori sayfaları
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React bileşenleri
│   ├── CategoryLayout.tsx # Kategori layout
│   ├── ImageOptimized.tsx # Optimized image
│   ├── LazyComponent.tsx  # Lazy loading
│   └── __tests__/         # Component testleri
├── hooks/                 # Custom hooks
├── lib/                   # Utility fonksiyonları
│   ├── apiCache.ts        # API caching
│   ├── auth.ts            # Authentication
│   ├── prisma.ts          # Database
│   └── utils.ts           # Helpers
├── types/                 # TypeScript tipleri
└── services/              # External services
```

## 🧪 Testing

### Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Watch mode
npm run test:watch

# Coverage raporu
npm run test:coverage
```

### Test Kategorileri
- **Unit Tests**: Component ve utility testleri
- **Integration Tests**: API endpoint testleri
- **E2E Tests**: Kullanıcı senaryoları

## 🚀 Deployment

### Render.com Deployment

1. GitHub repository'yi Render.com'a bağlayın
2. Environment variables'ları ayarlayın
3. Build command: `npm install && npm run build`
4. Start command: `npm start`

### Manuel Deployment

```bash
# Production build
npm run build

# Production sunucusu
npm start
```

## 📊 Performans Metrikleri

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Features
- Image optimization (WebP, AVIF)
- Code splitting ve lazy loading
- API caching (5 dakika TTL)
- Service Worker ile offline support

## 🔧 Geliştirme

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Git Workflow
```bash
# Feature branch oluştur
git checkout -b feature/yeni-ozellik

# Değişiklikleri commit et
git add .
git commit -m "feat: yeni özellik eklendi"

# Push ve PR oluştur
git push origin feature/yeni-ozellik
```

### Commit Conventions
- `feat:` Yeni özellik
- `fix:` Bug düzeltmesi
- `docs:` Dokümantasyon
- `style:` Kod formatı
- `refactor:` Code refactoring
- `test:` Test ekleme/düzeltme

## 📱 Mobil Uygulama

React Native ile mobil uygulama geliştirme başlamıştır:
- iOS ve Android desteği
- Web platformu ile senkronizasyon
- Push notification entegrasyonu

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: support@alo17.tr
- **GitHub**: [ALO17-NEW Repository](https://github.com/bali1973/ALO17-NEW)
- **Website**: [alo17-new-27-06.onrender.com](https://alo17-new-27-06.onrender.com)

## 🎯 Roadmap

### Yakında Gelecek Özellikler
- [ ] Gelişmiş mesajlaşma sistemi
- [ ] Video ilan desteği
- [ ] AI destekli öneri sistemi
- [ ] Çoklu dil desteği
- [ ] Blockchain entegrasyonu

### Uzun Vadeli Hedefler
- [ ] Mikroservis mimarisi
- [ ] GraphQL API
- [ ] Progressive Web App (PWA)
- [ ] Machine Learning integration

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın! 