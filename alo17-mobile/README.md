# Alo17 Mobile App

Alo17'nin React Native ile geliştirilmiş mobil uygulaması.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler

#### 🔐 **Kimlik Doğrulama**
- Kullanıcı kaydı ve girişi
- JWT token yönetimi
- Oturum yönetimi
- Güvenli API iletişimi

#### 📱 **Ana Özellikler**
- İlan listeleme ve detay görüntüleme
- Kategori ve alt kategori filtreleme
- Gelişmiş arama ve filtreleme
- Favori ekleme/çıkarma
- Kullanıcı profili yönetimi

#### 💬 **Mesajlaşma**
- Gerçek zamanlı mesajlaşma
- İlan sahipleriyle iletişim
- Mesaj bildirimleri
- Okunmamış mesaj sayacı

#### 🔔 **Bildirimler**
- Push notification desteği
- Yerel bildirimler
- Bildirim geçmişi
- Bildirim ayarları

#### 📊 **Offline Desteği**
- Gelişmiş cache sistemi
- Offline veri erişimi
- Senkronizasyon
- Pending actions

#### 🎯 **Gelişmiş Özellikler**
- Premium plan yönetimi
- İlan raporlama
- Analytics tracking
- Arama geçmişi

### 🔧 **Teknik Özellikler**

#### **API Entegrasyonu**
- RESTful API iletişimi
- Error handling
- Request/Response interceptors
- Offline fallback

#### **State Yönetimi**
- Context API
- Local state management
- Persistent storage
- Cache management

#### **UI/UX**
- Modern tasarım
- Responsive layout
- Dark/Light theme
- Accessibility support

#### **Performance**
- Lazy loading
- Image optimization
- Memory management
- Bundle optimization

## 📋 Kurulum

### Gereksinimler
- Node.js 18+
- React Native CLI
- Expo CLI
- Android Studio / Xcode

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Expo CLI ile başlatın:**
```bash
npx expo start
```

3. **Platform seçin:**
- Android: `a`
- iOS: `i`
- Web: `w`

## 🏗️ Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── screens/            # Ekran bileşenleri
│   ├── auth/          # Kimlik doğrulama ekranları
│   ├── main/          # Ana ekranlar
│   └── profile/       # Profil ekranları
├── services/          # API ve servis katmanı
│   ├── api.ts         # API servisi
│   ├── auth.ts        # Kimlik doğrulama
│   ├── notifications.ts # Bildirim servisi
│   └── offlineStorage.ts # Offline storage
├── context/           # React Context
├── hooks/             # Custom hooks
├── types/             # TypeScript tipleri
└── utils/             # Yardımcı fonksiyonlar
```

## 🔌 API Entegrasyonu

### Endpoints

#### **Kimlik Doğrulama**
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register` - Kayıt

#### **İlanlar**
- `GET /api/listings` - İlan listesi
- `GET /api/listings/:id` - İlan detayı
- `POST /api/listings` - İlan oluşturma
- `PUT /api/listings/:id` - İlan güncelleme
- `DELETE /api/listings/:id` - İlan silme

#### **Kategoriler**
- `GET /api/categories` - Kategori listesi
- `GET /api/categories/:slug` - Kategori detayı
- `GET /api/categories/:slug/subcategories` - Alt kategoriler

#### **Mesajlar**
- `GET /api/messages` - Mesaj listesi
- `POST /api/messages` - Mesaj gönderme
- `PUT /api/messages/:id/read` - Mesaj okundu

#### **Kullanıcı**
- `GET /api/user/profile` - Profil bilgileri
- `PUT /api/user/profile` - Profil güncelleme
- `GET /api/user/favorites` - Favoriler
- `POST /api/user/favorites` - Favori ekleme
- `DELETE /api/user/favorites/:id` - Favori çıkarma

### Offline Desteği

#### **Cache Stratejileri**
- **Network First**: API çağrıları için
- **Cache First**: Statik veriler için
- **Stale While Revalidate**: Resimler için

#### **Pending Actions**
- İlan oluşturma
- Mesaj gönderme
- Profil güncelleme
- Raporlama

## 🔔 Bildirimler

### Push Notifications
- Expo Push Notifications
- FCM entegrasyonu
- Background notifications
- Deep linking

### Bildirim Türleri
- Yeni mesaj
- İlan görüntüleme
- Favori ekleme
- Fiyat düşüşü
- Sistem bildirimleri

## 📱 Platform Desteği

### Android
- API Level 21+
- Material Design
- Native navigation
- Background services

### iOS
- iOS 12+
- Human Interface Guidelines
- Native navigation
- Background app refresh

## 🚀 Deployment

### Expo Build
```bash
# Android
expo build:android

# iOS
expo build:ios
```

### EAS Build
```bash
# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 📊 Analytics

### Tracking Events
- Sayfa görüntüleme
- İlan görüntüleme
- Arama yapma
- Mesaj gönderme
- Favori ekleme

### Metrics
- Kullanıcı etkileşimi
- Performans metrikleri
- Hata oranları
- Kullanım istatistikleri

## 🔧 Geliştirme

### Kod Standartları
- ESLint
- Prettier
- TypeScript
- React Native best practices

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance testing

### CI/CD
- GitHub Actions
- Automated testing
- Code quality checks
- Automated deployment

## 📈 Performans

### Optimizasyonlar
- Bundle splitting
- Lazy loading
- Image optimization
- Memory management
- Cache strategies

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Crash reporting

## 🔒 Güvenlik

### Önlemler
- JWT token validation
- API rate limiting
- Data encryption
- Secure storage
- Certificate pinning

### Privacy
- GDPR compliance
- Data minimization
- User consent
- Data portability

## 📞 Destek

### İletişim
- Email: support@alo17.com
- GitHub Issues
- Documentation

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Alo17 Mobile App** - Türkiye'nin en büyük ilan sitesinin mobil uygulaması 🚀 