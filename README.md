# Alo17 - İlan ve Kategoriler Platformu

## 🌟 Proje Hakkında

Alo17, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir ilan ve kategoriler platformudur. Next.js, React Native ve Prisma kullanılarak hem web hem de mobil uygulama olarak çalışmaktadır.

## 🚀 Canlı Demo

- **Render**: https://alo17-new-27-06.onrender.com/
- **Admin Panel**: https://alo17-new-27-06.onrender.com/admin

## ✨ Özellikler

### 🏷️ Kategori Sistemi
- Dinamik kategori yönetimi
- Alt kategoriler desteği
- Emoji ikonları ve renkli tasarım
- Gerçek zamanlı güncelleme

### 👨‍💼 Admin Paneli
- Kategori ve ilan yönetimi
- Premium özellik yönetimi
- Toplu işlemler
- İstatistikler ve raporlar

### 📱 Mobil Uygulama
- React Native ile geliştirilmiş
- Gerçek zamanlı mesajlaşma
- Offline veri desteği
- Push notifications

### 🔧 Teknolojiler
- Next.js 14 ile SSR/SSG
- Prisma ORM ile veritabanı yönetimi
- Socket.io ile gerçek zamanlı iletişim
- Tailwind CSS ile responsive tasarım
- TypeScript ile tip güvenliği

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- SQLite veritabanı

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/bali1973/ALO17-NEW.git
cd ALO17-NEW
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Veritabanını hazırlayın**
```bash
npx prisma generate
npx prisma db push
```

4. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3004
```

## 📦 Build ve Deploy

### Production Build
```bash
npm run build
```

### Render Deploy
Proje Render platformunda host edilmektedir. GitHub Actions ile build işlemi tamamlandıktan sonra Render'da otomatik deploy edilir.

## 🌐 Deployment

### Render
- **URL**: https://alo17-new-27-06.onrender.com/
- **Branch**: `main`
- **Build**: Otomatik (GitHub Actions + Render)

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3004"
```

## 📁 Proje Yapısı

```
src/
├── app/                 # Next.js 14 App Router
│   ├── admin/          # Admin panel sayfaları
│   ├── api/            # API routes
│   ├── components/     # React bileşenleri
│   └── lib/            # Utility fonksiyonları
├── components/          # Genel bileşenler
├── hooks/              # Custom React hooks
├── types/              # TypeScript tip tanımları
└── locales/            # Çoklu dil desteği

alo17-mobile/           # React Native mobil uygulama
prisma/                 # Veritabanı şeması ve migrations
```

## 🔧 Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Database**: Prisma ORM, SQLite
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **Mobile**: React Native, Expo
- **Deployment**: Render, GitHub Actions

## 📱 Mobil Uygulama

Mobil uygulama `alo17-mobile/` klasöründe bulunmaktadır:

```bash
cd alo17-mobile
npm install
npx expo start
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **GitHub**: [@bali1973](https://github.com/bali1973)
- **Proje**: [ALO17-NEW](https://github.com/bali1973/ALO17-NEW)

## 🙏 Teşekkürler

- Next.js ekibine
- React Native ekibine
- Prisma ekibine
- Tüm open source topluluğuna

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 