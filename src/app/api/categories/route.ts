import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // public/categories.json dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error);
    
    // Netlify'da çalışması için statik kategoriler döndür
    const staticCategories = [
      {
        id: "1",
        name: "Elektronik",
        slug: "elektronik",
        order: 0,
        subCategories: [
          { id: "1-1", name: "Telefon", slug: "telefon" },
          { id: "1-2", name: "Tablet", slug: "tablet" },
          { id: "1-3", name: "Bilgisayar", slug: "bilgisayar" },
          { id: "1-4", name: "Televizyon", slug: "televizyon" },
          { id: "1-5", name: "Kamera", slug: "kamera" },
          { id: "1-6", name: "Kulaklık", slug: "kulaklik" },
          { id: "1-7", name: "Oyun Konsolu", slug: "oyun-konsolu" },
          { id: "1-8", name: "Yazıcı", slug: "yazici" },
          { id: "1-9", name: "Network", slug: "network" },
          { id: "1-10", name: "Aksesuar", slug: "aksesuar" }
        ]
      },
      {
        id: "2",
        name: "Ev & Bahçe",
        slug: "ev-bahce",
        order: 1,
        subCategories: [
          { id: "2-1", name: "Mobilya", slug: "mobilya" },
          { id: "2-2", name: "Dekorasyon", slug: "dekorasyon" },
          { id: "2-3", name: "Bahçe", slug: "bahce" },
          { id: "2-4", name: "Ev Aletleri", slug: "ev-aletleri" },
          { id: "2-5", name: "Beyaz Eşya", slug: "beyaz-esya" },
          { id: "2-6", name: "Mutfak Gereçleri", slug: "mutfak-gerecleri" }
        ]
      },
      {
        id: "3",
        name: "Giyim",
        slug: "giyim",
        order: 2,
        subCategories: [
          { id: "3-1", name: "Kadın Giyim", slug: "kadin-giyim" },
          { id: "3-2", name: "Erkek Giyim", slug: "erkek-giyim" },
          { id: "3-3", name: "Çocuk Giyim", slug: "cocuk-giyim" },
          { id: "3-4", name: "Ayakkabı & Çanta", slug: "ayakkabi-canta" },
          { id: "3-5", name: "Aksesuar", slug: "aksesuar" }
        ]
      },
      {
        id: "4",
        name: "Anne & Bebek",
        slug: "anne-bebek",
        order: 3,
        subCategories: [
          { id: "4-1", name: "Bebek Arabası", slug: "bebek-arabasi" },
          { id: "4-2", name: "Bebek Giyim", slug: "bebek-giyim" },
          { id: "4-3", name: "Bebek Oyuncakları", slug: "bebek-oyuncaklari" }
        ]
      },
      {
        id: "5",
        name: "Eğitim & Kurslar",
        slug: "egitim-kurslar",
        order: 4,
        subCategories: [
          { id: "5-1", name: "Yabancı Dil Kursları", slug: "yabanci-dil-kurslari" },
          { id: "5-2", name: "Akademik Kurslar", slug: "akademik-kurslar" },
          { id: "5-3", name: "Sertifika Programları", slug: "sertifika-programlari" },
          { id: "5-4", name: "Müzik Kursları", slug: "muzik-kurslari" },
          { id: "5-5", name: "Sanat Kursları", slug: "sanat-kurslari" },
          { id: "5-6", name: "Spor Kursları", slug: "spor-kurslari" }
        ]
      },
      {
        id: "6",
        name: "Yemek & İçecek",
        slug: "yemek-icecek",
        order: 5,
        subCategories: [
          { id: "6-1", name: "Restoranlar", slug: "restoranlar" },
          { id: "6-2", name: "Kafeler", slug: "kafeler" },
          { id: "6-3", name: "Pastaneler", slug: "pastaneler" },
          { id: "6-4", name: "Fast Food", slug: "fast-food" },
          { id: "6-5", name: "Tatlı & Pastane", slug: "tatli-pastane" }
        ]
      },
      {
        id: "7",
        name: "Turizm & Gecelemeler",
        slug: "turizm-gecelemeler",
        order: 6,
        subCategories: [
          { id: "7-1", name: "Oteller", slug: "oteller" },
          { id: "7-2", name: "Pansiyonlar", slug: "pansiyonlar" },
          { id: "7-3", name: "Kamp Alanları", slug: "kamp-alanlari" },
          { id: "7-4", name: "Tatil Köyleri", slug: "tatil-koyleri" }
        ]
      },
      {
        id: "8",
        name: "Sağlık & Güzellik",
        slug: "saglik-guzellik",
        order: 7,
        subCategories: [
          { id: "8-1", name: "Kişisel Bakım", slug: "kisisel-bakim" },
          { id: "8-2", name: "Kozmetik Ürünleri", slug: "kozmetik-urunleri" },
          { id: "8-3", name: "Diyet & Beslenme", slug: "diyet-beslenme" },
          { id: "8-4", name: "Güzellik Merkezi", slug: "guzellik-merkezi" },
          { id: "8-5", name: "Kuaför & Berber", slug: "kuafor-berber" },
          { id: "8-6", name: "Spa Merkezi", slug: "spa-merkezi" }
        ]
      },
      {
        id: "9",
        name: "Sanat & Hobi",
        slug: "sanat-hobi",
        order: 8,
        subCategories: [
          { id: "9-1", name: "El İşi Malzemeleri", slug: "el-isi-malzemeleri" },
          { id: "9-2", name: "Hobi Kursları", slug: "hobi-kurslari" },
          { id: "9-3", name: "Koleksiyon", slug: "koleksiyon" },
          { id: "9-4", name: "Müzik Aletleri", slug: "muzik-aletleri" },
          { id: "9-5", name: "Resim Malzemeleri", slug: "resim-malzemeleri" }
        ]
      },
      {
        id: "10",
        name: "Sporlar, Oyunlar & Eğlenceler",
        slug: "sporlar-oyunlar-eglenceler",
        order: 9,
        subCategories: [
          { id: "10-1", name: "Spor Aktiviteleri", slug: "spor-aktiviteleri" },
          { id: "10-2", name: "Takım Sporları", slug: "takim-sporlari" },
          { id: "10-3", name: "Video Oyunları", slug: "video-oyunlari" },
          { id: "10-4", name: "Oyun Konsolları", slug: "oyun-konsollari" }
        ]
      },
      {
        id: "11",
        name: "İş & Kariyer",
        slug: "is",
        order: 10,
        subCategories: [
          { id: "11-1", name: "Tam Zamanlı", slug: "tam-zamanli" },
          { id: "11-2", name: "Yarı Zamanlı", slug: "yari-zamanli" },
          { id: "11-3", name: "Freelance", slug: "freelance" },
          { id: "11-4", name: "Staj", slug: "staj" }
        ]
      },
      {
        id: "12",
        name: "Ücretsiz Gel Al",
        slug: "ucretsiz-gel-al",
        order: 11,
        subCategories: [
          { id: "12-1", name: "Mobilya", slug: "mobilya" },
          { id: "12-2", name: "Oyuncak", slug: "oyuncak" },
          { id: "12-3", name: "Kitap", slug: "kitap" },
          { id: "12-4", name: "Giyim", slug: "giyim" },
          { id: "12-5", name: "Diğer", slug: "diger" }
        ]
      },
      {
        id: "13",
        name: "Hizmetler",
        slug: "hizmetler",
        order: 12,
        subCategories: [
          { id: "13-1", name: "Araç Hizmetleri", slug: "arac-hizmetleri" },
          { id: "13-2", name: "Ev Hizmetleri", slug: "ev-hizmetleri" },
          { id: "13-3", name: "Eğitim Hizmetleri", slug: "egitim-hizmetleri" },
          { id: "13-4", name: "Sağlık Hizmetleri", slug: "saglik-hizmetleri" },
          { id: "13-5", name: "Tasarım Hizmetleri", slug: "tasarim-hizmetleri" },
          { id: "13-6", name: "Teknik Hizmetler", slug: "teknik-hizmetler" },
          { id: "13-7", name: "Temizlik Hizmetleri", slug: "temizlik-hizmetleri" },
          { id: "13-8", name: "Web Hizmetleri", slug: "web-hizmetleri" },
          { id: "13-9", name: "Yazılım Hizmetleri", slug: "yazilim-hizmetleri" }
        ]
      },
      {
        id: "14",
        name: "Diğer",
        slug: "diger",
        order: 13,
        subCategories: [
          { id: "14-1", name: "Diğer", slug: "diger" }
        ]
      }
    ];
    
    return NextResponse.json(staticCategories);
  }
}

// Kategori ekleme
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Kategori adı gerekli' }, { status: 400 });
    }

    // JSON dosyasını oku
    const categoriesPath = join(process.cwd(), 'public', 'categories.json');
    const categoriesData = readFileSync(categoriesPath, 'utf8');
    const categories = JSON.parse(categoriesData);

    // Yeni kategori ID'si oluştur
    const newId = (categories.length + 1).toString();
    
    // Slug oluştur
    const slug = name.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Yeni kategori oluştur
    const newCategory = {
      id: newId,
      name,
      slug,
      icon: icon || 'emoji:📦',
      order: categories.length,
      subCategories: []
    };

    // Kategoriyi ekle
    categories.push(newCategory);

    // JSON dosyasına kaydet
    writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Kategori ekleme hatası:', error);
    return NextResponse.json({ error: 'Kategori eklenemedi' }, { status: 500 });
  }
} 