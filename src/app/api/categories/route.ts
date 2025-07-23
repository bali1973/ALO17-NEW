import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Mock kategoriler (production'da gerçek database kullanılacak)
const mockCategories = [
  {
    id: '1',
    name: 'Elektronik',
    slug: 'elektronik',
    icon: 'emoji:📱',
    subCategories: [
      { id: '1-1', name: 'Telefon', slug: 'telefon' },
      { id: '1-2', name: 'Tablet', slug: 'tablet' },
      { id: '1-3', name: 'Bilgisayar', slug: 'bilgisayar' },
      { id: '1-4', name: 'Televizyon', slug: 'televizyon' },
      { id: '1-5', name: 'Kamera', slug: 'kamera' },
      { id: '1-6', name: 'Kulaklık', slug: 'kulaklik' },
      { id: '1-7', name: 'Oyun Konsolu', slug: 'oyun-konsolu' },
      { id: '1-8', name: 'Yazıcı', slug: 'yazici' },
      { id: '1-9', name: 'Aksesuar', slug: 'aksesuar' }
    ]
  },
  {
    id: '2',
    name: 'Ev & Bahçe',
    slug: 'ev-bahce',
    icon: 'emoji:🏡',
    subCategories: [
      { id: '2-1', name: 'Mobilya', slug: 'mobilya' },
      { id: '2-2', name: 'Dekorasyon', slug: 'dekorasyon' },
      { id: '2-3', name: 'Bahçe', slug: 'bahce' },
      { id: '2-4', name: 'Mutfak', slug: 'mutfak' },
      { id: '2-5', name: 'Beyaz Eşya', slug: 'beyaz-esya' }
    ]
  },
  {
    id: '3',
    name: 'Giyim',
    slug: 'giyim',
    icon: 'emoji:👕',
    subCategories: [
      { id: '3-1', name: 'Erkek Giyim', slug: 'erkek-giyim' },
      { id: '3-2', name: 'Bayan Giyim', slug: 'bayan-giyim' },
      { id: '3-3', name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
      { id: '3-4', name: 'Ayakkabı', slug: 'ayakkabi' },
      { id: '3-5', name: 'Aksesuar', slug: 'aksesuar' }
    ]
  },
  {
    id: '4',
    name: 'Anne & Bebek',
    slug: 'anne-bebek',
    icon: 'emoji:👶',
    subCategories: [
      { id: '4-1', name: 'Bebek Giyim', slug: 'bebek-giyim' },
      { id: '4-2', name: 'Bebek Arabası', slug: 'bebek-arabasi' },
      { id: '4-3', name: 'Bebek Oyuncakları', slug: 'bebek-oyuncaklari' },
      { id: '4-4', name: 'Bebek Eşyaları', slug: 'bebek-esyalari' }
    ]
  },
  {
    id: '5',
    name: 'Sporlar-Oyunlar-Eğlenceler',
    slug: 'sporlar-oyunlar-eglenceler',
    icon: 'emoji:⚽',
    subCategories: [
      { id: '5-1', name: 'Spor Dallari', slug: 'spor-dallari' },
      { id: '5-2', name: 'Spor Aktiviteleri', slug: 'spor-aktiviteleri' },
      { id: '5-3', name: 'Video Oyunları', slug: 'video-oyunlari' }
    ]
  },
  {
    id: '6',
    name: 'Eğitim & Kurslar',
    slug: 'egitim-kurslar',
    icon: 'emoji:🎓',
    subCategories: [
      { id: '6-1', name: 'Dil Kursları', slug: 'dil-kurslari' },
      { id: '6-2', name: 'Muzik Kursları', slug: 'muzik-kurslari' },
      { id: '6-3', name: 'Spor Kursları', slug: 'spor-kurslari' },
      { id: '6-4', name: 'Sanat Kursları', slug: 'sanat-kurslari' }
    ]
  },
  {
    id: '7',
    name: 'Yemek & İçecek',
    slug: 'yemek-icecek',
    icon: 'emoji:🍽️',
    subCategories: [
      { id: '7-1', name: 'Restoranlar', slug: 'restoranlar' },
      { id: '7-2', name: 'Kafeler', slug: 'kafeler' },
      { id: '7-3', name: 'Pastaneler', slug: 'pastaneler' },
      { id: '7-4', name: 'Fast Food', slug: 'fast-food' },
      { id: '7-5', name: 'Lokantalar', slug: 'lokantalar' }
    ]
  },
  {
    id: '8',
    name: 'Turizm & Gecelemeler',
    slug: 'turizm-gecelemeler',
    icon: 'emoji:🏨',
    subCategories: [
      { id: '8-1', name: 'Oteller', slug: 'oteller' },
      { id: '8-2', name: 'Pansiyonlar', slug: 'pansiyonlar' },
      { id: '8-3', name: 'Tatil Köyleri', slug: 'tatil-koyleri' },
      { id: '8-4', name: 'Günlük Kiralık', slug: 'gunluk-kiralik' }
    ]
  },
  {
    id: '9',
    name: 'Sağlık & Güzellik',
    slug: 'saglik-guzellik',
    icon: 'emoji:💅',
    subCategories: [
      { id: '9-1', name: 'Kuaför & Berber', slug: 'kuafor-berber' },
      { id: '9-2', name: 'Güzellik Merkezi', slug: 'guzellik-merkezi' },
      { id: '9-3', name: 'Spa & Wellness', slug: 'spa-wellness' },
      { id: '9-4', name: 'Diyet & Beslenme', slug: 'diyet-beslenme' }
    ]
  },
  {
    id: '10',
    name: 'Sanat & Hobi',
    slug: 'sanat-hobi',
    icon: 'emoji:🎨',
    subCategories: [
      { id: '10-1', name: 'Resim', slug: 'resim' },
      { id: '10-2', name: 'Müzik', slug: 'muzik' },
      { id: '10-3', name: 'El İşi', slug: 'el-isi' },
      { id: '10-4', name: 'Koleksiyon', slug: 'koleksiyon' }
    ]
  },
  {
    id: '11',
    name: 'İş',
    slug: 'is',
    icon: 'emoji:💼',
    subCategories: [
      { id: '11-1', name: 'Tam Zamanlı', slug: 'tam-zamanli' },
      { id: '11-2', name: 'Yarı Zamanlı', slug: 'yari-zamanli' },
      { id: '11-3', name: 'Freelance', slug: 'freelance' },
      { id: '11-4', name: 'Staj', slug: 'staj' },
      { id: '11-5', name: 'Müşteri Hizmetleri', slug: 'musteri-hizmetleri' }
    ]
  },
  {
    id: '12',
    name: 'Hizmetler',
    slug: 'hizmetler',
    icon: 'emoji:🔧',
    subCategories: [
      { id: '12-1', name: 'Temizlik Hizmetleri', slug: 'temizlik-hizmetleri' },
      { id: '12-2', name: 'Nakliyat', slug: 'nakliyat' },
      { id: '12-3', name: 'Tadilat', slug: 'tadilat' },
      { id: '12-4', name: 'Teknik Servis', slug: 'teknik-servis' },
      { id: '12-5', name: 'Ev Hizmetleri', slug: 'ev-hizmetleri' }
    ]
  },
  {
    id: '13',
    name: 'Ücretsiz Gel Al',
    slug: 'ucretsiz-gel-al',
    icon: 'emoji:🎁',
    subCategories: [
      { id: '13-1', name: 'Mobilya', slug: 'mobilya' },
      { id: '13-2', name: 'Elektronik', slug: 'elektronik' },
      { id: '13-3', name: 'Giyim', slug: 'giyim' },
      { id: '13-4', name: 'Kitap', slug: 'kitap' },
      { id: '13-5', name: 'Oyuncak', slug: 'oyuncak' }
    ]
  }
];

// Kategorileri getir
export async function GET() {
  try {
    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error('Kategoriler getirme hatası:', error);
    return NextResponse.json({ error: 'Kategoriler getirilemedi' }, { status: 500 });
  }
}

// Yeni kategori ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    // Yeni kategori oluştur
    const newCategory = {
      id: (mockCategories.length + 1).toString(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[ğüşıöç]/g, (match: string) => {
        const map: { [key: string]: string } = { 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' };
        return map[match] || match;
      }),
      icon: icon || '📁',
      subCategories: []
    };

    mockCategories.push(newCategory);

    // Kategori değişti, anasayfa ve kategori sayfalarını revalidate et
    revalidatePath('/');
    revalidatePath('/kategori');

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
  }
} 