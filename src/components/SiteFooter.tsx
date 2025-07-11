import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Hakkımızda */}
        <div>
          <h3 className="text-lg font-bold mb-3">Alo17</h3>
          <p className="text-sm mb-2">Türkiye'nin güvenilir ilan platformu.</p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Alo17. Tüm hakları saklıdır.</p>
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
            <li><Link href="/kullanim-kosullari" className="hover:underline">Kullanım Koşulları</Link></li>
          </ul>
        </div>
        {/* Sosyal ve İletişim */}
        <div>
          <h4 className="text-md font-semibold mb-3">Bize Ulaşın</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:destek@alo17.tr" className="hover:underline">destek@alo17.tr</a></li>
            <li><a href="tel:5414042404" className="hover:underline">541 4042404</a></li>
            <li className="flex space-x-3 mt-2">
              <a href="#" aria-label="Twitter" className="hover:text-blue-400"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.385.104-.792.16-1.211.16-.296 0-.583-.028-.862-.08.584 1.823 2.28 3.152 4.29 3.188A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-400"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.783 2.225 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.659.398 3.678 1.38 2.697 2.361 2.427 3.473 2.369 4.754 2.311 6.034 2.299 6.444 2.299 12c0 5.556.012 5.966.07 7.246.058 1.281.328 2.393 1.309 3.374.981.981 2.093 1.251 3.374 1.309 1.28.058 1.689.07 7.246.07s5.966-.012 7.246-.07c1.281-.058 2.393-.328 3.374-1.309.981-.981 1.251-2.093 1.309-3.374.058-1.28.07-1.689.07-7.246s-.012-5.966-.07-7.246c-.058-1.281-.328-2.393-1.309-3.374C19.607.398 18.495.128 17.214.07 15.934.012 15.525 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>
              <a href="#" aria-label="Facebook" className="hover:text-blue-600"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0z"/></svg></a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
} 