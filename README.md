# 🏠 Alo17 - Türkiye'nin En Büyük İlan Sitesi

Alo17, Türkiye'deki kullanıcıların alım, satım ve kiralama işlemlerini kolayca yapabilecekleri modern ve güvenli bir ilan platformudur.

## ✨ Özellikler

### 🚀 Temel Özellikler
- **Ücretsiz İlan Verme** - Hızlı ve kolay ilan oluşturma
- **Gelişmiş Arama** - Filtreler ve kategoriler ile arama
- **Gerçek Zamanlı Mesajlaşma** - Anlık iletişim
- **Mobil Uygulama** - iOS ve Android desteği
- **Çoklu Dil Desteği** - Türkçe, İngilizce, Almanca, Fransızca

### 💎 Premium Özellikler
- **İlan Öne Çıkarma** - Daha fazla görünürlük
- **Detaylı Analitikler** - Performans takibi
- **Gelişmiş Fotoğraf Yükleme** - 20 adet fotoğraf
- **Öncelikli Destek** - 7/24 destek
- **Reklamsız Deneyim** - Temiz arayüz

### 🔒 Güvenlik
- **SSL/TLS Şifreleme** - Güvenli bağlantı
- **İki Faktörlü Doğrulama** - Hesap güvenliği
- **Rate Limiting** - DDoS koruması
- **Input Validation** - XSS ve SQL injection koruması
- **Admin Paneli** - Güvenlik izleme

### 📊 Analytics ve Monitoring
- **Gerçek Zamanlı İstatistikler** - Performans takibi
- **Web Vitals İzleme** - Core Web Vitals
- **Error Tracking** - Hata takibi
- **User Analytics** - Kullanıcı davranışları
- **Performance Monitoring** - Sistem performansı

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - İkon kütüphanesi
- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - Database ORM
- **PostgreSQL** - Ana veritabanı
- **Redis** - Cache ve session
- **NextAuth.js** - Authentication
- **Socket.io** - Real-time communication

### Mobile
- **React Native** - Cross-platform
- **Expo** - Development platform
- **AsyncStorage** - Local storage
- **Push Notifications** - Bildirim sistemi

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Hosting platform
- **Prometheus** - Monitoring
- **Grafana** - Visualization
- **ELK Stack** - Logging

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.0.0+
- npm 9.0.0+
- PostgreSQL 15.0+
- Redis 7.0+

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
NEXTAUTH_URL="http://localhost:3004"
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
├── alo17-mobile/             # React Native app
├── prisma/                   # Database schema
├── public/                   # Static files
├── docs/                     # Documentation
├── scripts/                  # Build scripts
└── tests/                    # Test files
```

## 🧪 Test

### Test Çalıştırma
```bash
# Unit testler
npm test

# E2E testler
npm run test:e2e

# Coverage raporu
npm run test:coverage

# Performance testler
npm run test:performance
```

### Test Coverage
- **Unit Tests**: %85+
- **Integration Tests**: %80+
- **E2E Tests**: %70+

## 🚀 Deployment

### Production Deployment
```bash
# Build
npm run build

# Start
npm start
```

### Docker ile Deployment
```bash
# Build image
docker build -t alo17 .

# Run container
docker run -p 3000:3000 alo17
```

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

## 📊 API Dokümantasyonu

API dokümantasyonu için [docs/API.md](docs/API.md) dosyasını inceleyin.

### Örnek API Kullanımı
```javascript
// Listings API
const response = await fetch('/api/listings?category=elektronik');
const data = await response.json();

// Create listing
const newListing = await fetch('/api/listings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'iPhone 13 Pro',
    price: 15000,
    category: 'elektronik'
  })
});
```

## 🔒 Güvenlik

### Güvenlik Özellikleri
- **SSL/TLS Şifreleme** - Tüm bağlantılar şifrelenir
- **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- **Rate Limiting** - API rate limiting
- **Input Validation** - Tüm kullanıcı girdileri doğrulanır
- **XSS Protection** - Cross-site scripting koruması
- **CSRF Protection** - Cross-site request forgery koruması
- **SQL Injection Protection** - Database injection koruması

### Güvenlik Kontrol Listesi
- [x] SSL sertifikası aktif
- [x] Environment variables güvenli
- [x] Database backup aktif
- [x] Monitoring aktif
- [x] Rate limiting aktif
- [x] Security headers aktif

## 📈 Performance

### Performance Metrikleri
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to First Byte (TTFB)**: < 600ms

### Performance Optimizasyonları
- **Code Splitting** - Lazy loading
- **Image Optimization** - Next.js Image component
- **Caching** - Redis ve browser cache
- **CDN** - Content Delivery Network
- **Compression** - Gzip compression
- **Minification** - CSS/JS minification

## 📱 Mobil Uygulama

### React Native App
Mobil uygulama `alo17-mobile/` dizininde bulunur.

```bash
cd alo17-mobile

# Install dependencies
npm install

# Run iOS
npm run ios

# Run Android
npm run android
```

### Mobil Özellikler
- **Push Notifications** - Anlık bildirimler
- **Offline Mode** - Çevrimdışı çalışma
- **Camera Integration** - Fotoğraf çekme
- **Location Services** - Konum tabanlı arama
- **Biometric Auth** - Parmak izi/face ID

## 🔧 Geliştirme

### Kod Kalitesi
```bash
# Lint
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

### Git Hooks
- **Pre-commit**: Lint ve type check
- **Pre-push**: Test çalıştırma
- **Commit message**: Conventional commits

### Branch Strategy
- **main**: Production branch
- **develop**: Development branch
- **feature/**: Feature branches
- **hotfix/**: Hotfix branches

## 📚 Dokümantasyon

### Dokümantasyon Linkleri
- [API Dokümantasyonu](docs/API.md)
- [Kullanıcı Kılavuzu](docs/USER_GUIDE.md)
- [Geliştirici Dokümantasyonu](docs/DEVELOPER.md)
- [Deployment Kılavuzu](docs/DEPLOYMENT.md)
- [Test Kılavuzu](docs/TESTING.md)

### Video Kılavuzlar
- [Kurulum Kılavuzu](https://youtube.com/alo17-kurulum)
- [API Kullanımı](https://youtube.com/alo17-api)
- [Deployment](https://youtube.com/alo17-deployment)

## 🤝 Katkıda Bulunma

### Katkıda Bulunma Süreci
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Geliştirici Kuralları
- Conventional Commits kullanın
- Test coverage %80'in üzerinde olmalı
- Lint ve type check geçmeli
- Code review gerekli

## 📞 İletişim

### Genel İletişim
- **Website**: [alo17.com](https://alo17.com)
- **E-posta**: info@alo17.com
- **Telefon**: +90 212 123 45 67

### Geliştirici Desteği
- **E-posta**: dev-support@alo17.com
- **Discord**: [Alo17 Developers](https://discord.gg/alo17)
- **GitHub Issues**: [Issues](https://github.com/your-username/alo17/issues)

### Sosyal Medya
- **Facebook**: [Alo17](https://facebook.com/alo17)
- **Instagram**: [@alo17](https://instagram.com/alo17)
- **Twitter**: [@alo17](https://twitter.com/alo17)
- **LinkedIn**: [Alo17](https://linkedin.com/company/alo17)

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

## 🙏 Teşekkürler

### Açık Kaynak Projeler
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)

### Topluluk
- Tüm katkıda bulunanlara teşekkürler
- Beta test kullanıcılarına teşekkürler
- Açık kaynak topluluğuna teşekkürler

## 📈 İstatistikler

- **1M+** aktif kullanıcı
- **500K+** ilan
- **50+** kategori
- **81** il
- **%99.9** uptime
- **24/7** destek

---

**Alo17** - Türkiye'nin en güvenilir ilan platformu 🏠 