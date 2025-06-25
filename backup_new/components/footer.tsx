import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
            <p className="text-gray-400">
              Çanakkale'nin en büyük ilan sitesi olarak, kullanıcılarımıza en iyi hizmeti sunmayı hedefliyoruz.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="text-gray-400 hover:text-white transition-colors">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/ilan-ver" className="text-gray-400 hover:text-white transition-colors">
                  İlan Ver
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-400 hover:text-white transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>Cevatpaşa Mahallesi, Bayrak Sokak No:4, Çanakkale</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>0541 404 2 404</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>destek@alo17.tr</span>
              </li>
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/kvkk" className="text-gray-400 hover:text-white transition-colors">
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/cerez-politikasi" className="text-gray-400 hover:text-white transition-colors">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-400 hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Alo17. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
} 