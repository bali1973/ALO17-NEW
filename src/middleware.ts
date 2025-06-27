import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Common redirects to prevent 404 errors
const redirects = new Map([
  // Common misspellings
  ['/ilanlar', '/ilanlar'],
  ['/ilan-ver', '/ilan-ver'],
  ['/giris', '/giris'],
  ['/kayit', '/kayit'],
  ['/profil', '/profil'],
  ['/admin', '/admin'],
  
  // Category redirects
  ['/kategoriler', '/kategori/elektronik'],
  ['/elektronik', '/kategori/elektronik'],
  ['/ev-bahce', '/kategori/ev-bahce'],
  ['/giyim', '/kategori/giyim'],
  ['/saglik', '/kategori/saglik-guzellik'],
  ['/spor', '/kategori/sporlar-oyunlar-eglenceler'],
  ['/turizm', '/kategori/turizm-gecelemeler'],
  ['/yemek', '/kategori/yemek-icecek'],
  ['/egitim', '/kategori/egitim-kurslar'],
  ['/anne-bebek', '/kategori/anne-bebek'],
  ['/is', '/kategori/is'],
  ['/ev-esyalari', '/kategori/ev-esyalari'],
  ['/sanat-hobi', '/kategori/sanat-hobi'],
  
  // Old URL redirects
  ['/login', '/giris'],
  ['/register', '/kayit'],
  ['/profile', '/profil'],
  ['/listings', '/ilanlar'],
  ['/post-ad', '/ilan-ver'],
])

// Valid categories
const validCategories = [
  'elektronik', 'ev-bahce', 'giyim', 'saglik-guzellik', 
  'sporlar-oyunlar-eglenceler', 'turizm-gecelemeler', 'yemek-icecek',
  'ev-esyalari', 'is', 'sanat-hobi', 'anne-bebek', 'egitim-kurslar'
]

// Valid subcategories for each category
const validSubcategories = {
  'elektronik': ['telefon', 'bilgisayar', 'tablet', 'kamera', 'televizyon', 'kulaklik', 'oyun-konsolu', 'yazici', 'network'],
  'ev-bahce': ['mobilya', 'dekorasyon', 'bahce', 'ev-aleti', 'ev-aletleri'],
  'ev-esyalari': ['beyaz-esya', 'mobilya', 'mutfak-gerecleri'],
  'giyim': ['erkek-giyim', 'kadin-giyim', 'bayan-giyim', 'cocuk-giyim', 'ayakkabi', 'ayakkabi-canta', 'aksesuar'],
  'saglik-guzellik': ['kisisel-bakim', 'kuaför-berber', 'güzellik-merkezi', 'spa-merkezi', 'kozmetik-ürünleri', 'diyet-ve-beslenme'],
  'sporlar-oyunlar-eglenceler': ['spor-aktiviteleri', 'spor-dallari', 'video-oyunlari'],
  'sanat-hobi': ['el-işi-malzemeleri', 'hobi-kursları', 'koleksiyon', 'müzik-aletleri', 'resim-malzemeleri'],
  'turizm-gecelemeler': ['oteller', 'tatil-koyleri', 'pansiyonlar', 'apartlar', 'butik-oteller', 'hosteller', 'kamp-alanlari', 'ev-kiralama', 'termal-oteller'],
  'yemek-icecek': ['restoranlar', 'kafeler', 'fast-food', 'tatli-pastane', 'ozel-yemekler'],
  'egitim-kurslar': ['yabanci-dil-kurslari', 'muzik-kurslari', 'spor-kurslari', 'akademik-kurslar', 'sanat-kurslari'],
  'anne-bebek': ['bebek-giyim', 'bebek-bakim', 'anne-urunleri'],
  'is': ['is-ariyorum', 'tam-zamanli']
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check for exact redirects
  const redirect = redirects.get(pathname)
  if (redirect && redirect !== pathname) {
    return NextResponse.redirect(new URL(redirect, request.url))
  }
  
  // Handle trailing slashes
  if (pathname.length > 1 && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url)
  }
  
  // Handle category pages
  if (pathname.startsWith('/kategori/')) {
    const pathParts = pathname.split('/')
    
    // /kategori/[slug] format
    if (pathParts.length === 3) {
      const category = pathParts[2]
      if (!validCategories.includes(category)) {
        return NextResponse.redirect(new URL('/kategori/elektronik', request.url))
      }
    }
    
    // /kategori/[slug]/[subSlug] format
    if (pathParts.length === 4) {
      const category = pathParts[2]
      const subcategory = pathParts[3]
      
      // Check if category is valid
      if (!validCategories.includes(category)) {
        return NextResponse.redirect(new URL('/kategori/elektronik', request.url))
      }
      
      // Check if subcategory is valid for this category
      const validSubs = validSubcategories[category as keyof typeof validSubcategories]
      if (validSubs && !validSubs.includes(subcategory)) {
        return NextResponse.redirect(new URL(`/kategori/${category}`, request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon (app icon)
     * - apple-icon (apple touch icon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon).*)',
  ],
} 