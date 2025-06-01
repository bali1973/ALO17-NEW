# Alo17 - İkinci El Alışveriş Platformu

Alo17, kullanıcıların ikinci el ürünleri kolayca alıp satabilecekleri bir platformdur.

## Özellikler

- Ücretsiz ve Premium ilan seçenekleri
- Yıllık Premium üyelik indirimi
- Kupon kodu desteği
- Kategori ve alt kategori sistemi
- Favori ilanlar
- Mesajlaşma sistemi
- Google ve Apple ile giriş

## Teknolojiler

- Next.js 14
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS

## Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/alo17.git
cd alo17
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/alo17"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_ID=""
APPLE_SECRET=""
```

4. Veritabanını oluşturun:
```bash
npx prisma db push
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Deployment

Proje Netlify üzerinde deploy edilmiştir. Yeni bir deployment için:

1. Netlify CLI'ı yükleyin:
```bash
npm install -g netlify-cli
```

2. Netlify'a giriş yapın:
```bash
netlify login
```

3. Projeyi deploy edin:
```bash
netlify deploy
```

### Manuel Deployment

1. [Netlify](https://www.netlify.com/)'da hesap oluşturun
2. "New site from Git" seçeneğini tıklayın
3. GitHub repository'nizi seçin
4. Build ayarlarını kontrol edin:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Environment variables'ı ekleyin:
   - `NEXTAUTH_URL`: https://alo17.netlify.app
   - `NEXTAUTH_SECRET`: Güvenli bir secret key
   - `DATABASE_URL`: PostgreSQL veritabanı URL'i
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
   - `APPLE_ID`: Apple OAuth client ID
   - `APPLE_SECRET`: Apple OAuth client secret
6. "Deploy site" butonuna tıklayın

## Lisans

MIT 