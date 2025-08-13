# ALO17 - İlan ve Alışveriş Platformu

Modern web teknolojileri ile geliştirilmiş, kullanıcı dostu ilan ve alışveriş platformu.

## 🚀 Özellikler

- **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- **İlan Sistemi**: İlan verme, düzenleme, arama ve filtreleme
- **Kategori Sistemi**: Hiyerarşik kategori yapısı
- **Admin Paneli**: Kapsamlı yönetim araçları
- **OAuth Entegrasyonu**: Google, Facebook, Apple ile giriş
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Güvenlik**: JWT tabanlı kimlik doğrulama

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Heroicons
- **Backend**: Next.js API Routes
- **Veritabanı**: SQLite (Prisma ORM)
- **Kimlik Doğrulama**: JWT, OAuth 2.0
- **Deploy**: GitHub Actions, Vercel, Netlify

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar
1. Repository'yi klonlayın:
```bash
git clone https://github.com/bali1973/ALO17-NEW.git
cd ALO17-NEW
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment variables'ları ayarlayın:
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

4. Veritabanını hazırlayın:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Admin kullanıcısı oluşturun:
```bash
node scripts/create-admin.js
```

6. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔐 OAuth Kurulumu

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. OAuth 2.0 Client ID oluşturun
3. Redirect URI: `http://localhost:3004/api/auth/google/callback`
4. Client ID ve Secret'ı admin panelinden girin

### Facebook OAuth
1. [Facebook Developers](https://developers.facebook.com/)'a gidin
2. App oluşturun
3. Redirect URI: `http://localhost:3004/api/auth/facebook/callback`
4. App ID ve Secret'ı admin panelinden girin

### Apple OAuth
1. [Apple Developer](https://developer.apple.com/)'a gidin
2. App ID ve Key oluşturun
3. Redirect URI: `http://localhost:3004/api/auth/apple/callback`
4. Team ID, Key ID ve Client ID'yi admin panelinden girin

## 🚀 Deploy

### Otomatik Deploy (GitHub Actions)
- `main` branch'e push yapıldığında otomatik deploy
- Test, build ve deploy aşamaları
- Vercel ve Netlify desteği

### Manuel Deploy
```bash
npm run build
npm run start
```

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin paneli
│   ├── api/               # API routes
│   ├── auth/              # OAuth routes
│   └── ...                # Sayfa bileşenleri
├── components/             # React bileşenleri
├── hooks/                  # Custom hooks
├── lib/                    # Utility fonksiyonları
└── types/                  # TypeScript tipleri
```

## 🔧 Scripts

- `npm run dev` - Geliştirme sunucusu
- `npm run build` - Production build
- `npm run start` - Production sunucusu
- `npm run lint` - ESLint kontrolü
- `npm run type-check` - TypeScript kontrolü

## 🌐 Canlı Demo

- **Ana Site**: [https://alo17-new-27-06.onrender.com](https://alo17-new-27-06.onrender.com)
- **Admin Panel**: [https://alo17-new-27-06.onrender.com/admin](https://alo17-new-27-06.onrender.com/admin)

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Geliştirici**: Bali
- **GitHub**: [@bali1973](https://github.com/bali1973)
- **Proje**: [ALO17-NEW](https://github.com/bali1973/ALO17-NEW) 