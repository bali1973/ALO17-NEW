import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Hakkımızda */}
        <div>
          <h3 className="text-xl font-extrabold mb-3 tracking-tight">Alo17</h3>
          <p className="text-sm mb-2 opacity-90">Türkiye'nin güvenilir ilan platformu.</p>
          <p className="text-xs opacity-70">© {new Date().getFullYear()} Alo17. Tüm hakları saklıdır.</p>
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
            <li><a href="mailto:destek@alo17.tr" className="hover:underline">destek@alo17.tr</a></li>
            <li><a href="tel:5414042404" className="hover:underline">541 404 24 04</a></li>
            <li className="flex gap-3 mt-2">
              <a href="#" className="hover:opacity-80" aria-label="Instagram"><svg width="22" height="22" fill="currentColor" className="text-white"><circle cx="11" cy="11" r="10" stroke="white" strokeWidth="2" fill="none"/><rect x="6" y="6" width="10" height="10" rx="3" fill="white" opacity=".2"/><circle cx="11" cy="11" r="3" fill="white" opacity=".7"/></svg></a>
              <a href="#" className="hover:opacity-80" aria-label="Twitter"><svg width="22" height="22" fill="currentColor" className="text-white"><circle cx="11" cy="11" r="10" stroke="white" strokeWidth="2" fill="none"/><path d="M7 13c2 1 4 1 6-1" stroke="white" strokeWidth="1.5" fill="none"/></svg></a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 