# Alo17 Mobile App

Alo17 marketplace uygulamasının React Native mobil versiyonu.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Authentication Sistemi**
  - Kullanıcı kayıt ve giriş
  - Token tabanlı authentication
  - Otomatik token yenileme
  - Güvenli çıkış

- **Ana Sayfa**
  - İlan listesi görüntüleme
  - Premium ilan işaretleme
  - Pull-to-refresh
  - Kullanıcı karşılama

- **Arama Sistemi**
  - Gerçek zamanlı arama
  - Arama sonuçları
  - Kategori filtreleme

- **İlan Yönetimi**
  - İlan oluşturma
  - İlan detay görüntüleme
  - Kategori seçimi
  - Durum belirleme

- **Mesajlaşma**
  - Chat listesi
  - Gerçek zamanlı mesajlaşma
  - Okunmamış mesaj sayısı
  - Mesaj geçmişi

- **Profil Yönetimi**
  - Kullanıcı profili
  - İstatistikler
  - Tema değiştirme
  - Ayarlar

- **Favoriler**
  - Favori ilan ekleme/çıkarma
  - Favori listesi
  - Hızlı erişim

- **Ayarlar**
  - Tema değiştirme (Açık/Koyu)
  - Bildirim ayarları
  - Konum servisleri
  - Önbellek yönetimi

## 📱 Ekranlar

### Authentication
- `SplashScreen` - Açılış ekranı
- `LoginScreen` - Giriş ekranı
- `RegisterScreen` - Kayıt ekranı

### Ana Uygulama
- `HomeScreen` - Ana sayfa
- `SearchScreen` - Arama ekranı
- `CreateListingScreen` - İlan oluşturma
- `MessagesScreen` - Mesajlar listesi
- `ProfileScreen` - Profil ekranı

### Detay Ekranları
- `ListingDetailScreen` - İlan detayı
- `ChatScreen` - Sohbet ekranı
- `FavoritesScreen` - Favoriler
- `SettingsScreen` - Ayarlar

## 🛠️ Teknolojiler

- **React Native** 0.72.6
- **TypeScript** 4.8.4
- **React Navigation** 6.x
- **React Native Paper** - UI Components
- **Axios** - HTTP Client
- **AsyncStorage** - Local Storage
- **React Native Vector Icons** - Icons

## 📦 Kurulum

### Gereksinimler
- Node.js 16+
- React Native CLI
- Android Studio (Android için)
- Xcode (iOS için)

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
cd alo17-mobile
npm install
```

2. **iOS için (sadece macOS):**
```bash
cd ios
pod install
cd ..
```

3. **Uygulamayı çalıştırın:**

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Metro bundler:**
```bash
npm start
```

## 🔧 Konfigürasyon

### Environment Variables
`.env` dosyası oluşturun:
```
API_BASE_URL=http://localhost:3000/api
```

### API Endpoints
Uygulama şu API endpoint'lerini kullanır:
- `POST /auth/login` - Giriş
- `POST /auth/register` - Kayıt
- `GET /listings` - İlan listesi
- `POST /listings` - İlan oluşturma
- `GET /listings/:id` - İlan detayı
- `GET /messages` - Mesaj listesi
- `POST /messages` - Mesaj gönderme

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   └── common/         # Ortak bileşenler
├── context/            # React Context'ler
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── screens/            # Ekran bileşenleri
│   ├── auth/          # Authentication ekranları
│   └── main/          # Ana uygulama ekranları
├── services/           # API servisleri
│   └── authService.ts
├── types/              # TypeScript tip tanımları
│   └── navigation.ts
└── utils/              # Yardımcı fonksiyonlar
```

## 🎨 Tema Sistemi

Uygulama açık ve koyu tema desteği sunar:

```typescript
const { theme, isDark, toggleTheme } = useTheme();

// Tema renklerine erişim
theme.colors.primary
theme.colors.background
theme.colors.text
```

## 🔐 Authentication

Authentication sistemi token tabanlı çalışır:

```typescript
const { user, login, logout, isAuthenticated } = useAuth();

// Giriş yapma
await login(email, password);

// Çıkış yapma
await logout();
```

## 📱 Platform Özellikleri

### Android
- Material Design
- Back button handling
- Status bar customization

### iOS
- iOS Design Guidelines
- Safe area handling
- Haptic feedback

## 🚀 Build

### Android APK
```bash
npm run build:android
```

### iOS Archive
```bash
npm run build:ios
```

## 🧪 Test

```bash
npm test
```

## 📝 Notlar

- Uygulama şu anda mock data kullanıyor
- Backend API entegrasyonu için TODO'lar mevcut
- Push notification sistemi eklenecek
- Offline support planlanıyor

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- Proje: [Alo17 Mobile](https://github.com/alo17/mobile)
- Email: info@alo17.com 