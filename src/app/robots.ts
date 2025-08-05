import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/giris',
          '/kayit',
          '/profil/',
          '/mesajlasma',
          '/bildirimler',
          '/favoriler',
          '/rapor-gonder',
          '/analitikler',
          '/dil-testi',
        ],
      },
    ],
    sitemap: 'https://alo17.com/sitemap.xml',
  };
} 