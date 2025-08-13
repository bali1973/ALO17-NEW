'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SiteSettings {
  phone?: string;
  supportEmail?: string;
  siteTitle?: string;
  footerText?: string;
}

export default function SiteFooter() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Ayarlar yüklenemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Hakkımızda */}
        <div>
          <h3 className="text-xl font-extrabold mb-3 tracking-tight">{settings.siteTitle || 'Alo17'}</h3>
          <p className="text-sm mb-2 opacity-90">Türkiye&apos;nin güvenilir ilan platformu.</p>
          <p className="text-xs opacity-70">{settings.footerText || `© ${new Date().getFullYear()} Alo17. Tüm hakları saklıdır.`}</p>
        </div>
        {/* Hızlı Linkler */}
        <div>
          <h4 className="text-md font-semibold mb-3">Hızlı Linkler</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Ana Sayfa</Link></li>
            <li><Link href="/ilan-ver" className="hover:underline">İlan Ver</Link></li>
            <li><Link href="/tum-ilanlar" className="hover:underline">Tüm İlanlar</Link></li>
            <li><Link href="/iletisim" className="hover:underline">İletişim</Link></li>
            <li><Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link></li>
          </ul>
        </div>
        {/* Yasal */}
        <div>
          <h4 className="text-md font-semibold mb-3">Yasal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/kvkk" className="hover:underline">KVKK</Link></li>
            <li><Link href="/cerez-politikasi" className="hover:underline">Çerez Politikası</Link></li>
            <li><Link href="/gizlilik-politikasi" className="hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link></li>
            <li><Link href="/iade-politikasi" className="hover:underline">İade Politikası</Link></li>
            <li><Link href="/acik-riza" className="hover:underline">Açık Rıza Metni</Link></li>
          </ul>
        </div>
        {/* Sosyal ve İletişim */}
        <div>
          <h4 className="text-md font-semibold mb-3">Bize Ulaşın</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${settings.supportEmail || 'destek@alo17.tr'}`} className="hover:underline">{settings.supportEmail || 'destek@alo17.tr'}</a></li>
            <li><a href={`tel:${settings.phone || '5414042404'}`} className="hover:underline">{settings.phone || '541 404 24 04'}</a></li>
            <li><Link href="/bildirim-tercihleri" className="hover:underline">Yeni İlanlardan Haberdar Ol</Link></li>

          </ul>
        </div>
      </div>
      

    </footer>
  );
} 