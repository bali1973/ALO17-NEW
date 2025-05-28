# Alo17 - İlan Sitesi

Alo17, kullanıcıların çeşitli kategorilerde ilan verebileceği ve alabileceği modern bir ilan sitesidir.

## Özellikler

- Kategori ve alt kategori bazlı ilan listeleme
- Detaylı ilan görüntüleme
- Mesajlaşma sistemi
- Telefon görünürlük kontrolü
- Premium ilan özellikleri
- Responsive tasarım

## Teknolojiler

- Next.js 14
- TypeScript
- Tailwind CSS
- Heroicons
- Swiper.js

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/alo17.git
cd alo17
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Deployment

Proje Netlify üzerinde deploy edilmiştir. Yeni bir commit push edildiğinde otomatik olarak deploy edilir.

### Netlify CLI ile Deployment

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
5. "Deploy site" butonuna tıklayın

## Lisans

MIT 