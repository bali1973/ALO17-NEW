import { LucideIcon } from "lucide-react"
import { 
  Smartphone, 
  Home, 
  Shirt, 
  Baby, 
  Dumbbell, 
  Heart, 
  GraduationCap,
  Utensils,
  Palette,
  Gift,
  MoreHorizontal,
  Hotel,
  Laptop,
  Camera,
  Tv,
  Headphones,
  Gamepad2,
  Printer,
  Watch,
  Radio,
  Speaker,
  Sofa,
  BedDouble,
  Bath,
  ChefHat,
  Flower2,
  TreePine,
  Hammer,
  Wrench,
  Paintbrush,
  Lightbulb,
  Fan,
  Refrigerator,
  WashingMachine,
  Microwave,
  ShirtIcon,
  BaggageClaim,
  Glasses,
  Scissors,
  Circle,
  Trophy,
  Target,
  Gamepad,
  Music2,
  Theater,
  PartyPopper,
  Tent,
  BikeIcon
} from "lucide-react"

export interface Category {
  name: string
  icon: LucideIcon | string
  slug: string
  subcategories?: Category[]
}

export const categories: Category[] = [
  {
    name: "Elektronik",
    icon: Smartphone,
    slug: "elektronik",
    subcategories: [
      {
        name: "Telefon",
        slug: "telefon",
        icon: "📱",
        subcategories: [
          {
            name: "Apple",
            slug: "apple",
            icon: "🍎"
          },
          {
            name: "Samsung",
            slug: "samsung",
            icon: "📱"
          },
          {
            name: "Xiaomi",
            slug: "xiaomi",
            icon: "📱"
          },
          {
            name: "Huawei",
            slug: "huawei",
            icon: "📱"
          },
          {
            name: "Diğer",
            slug: "diger",
            icon: "📱"
          }
        ]
      },
      {
        name: "Bilgisayar",
        slug: "bilgisayar",
        icon: "💻",
        subcategories: [
          {
            name: "Dizüstü",
            slug: "dizustu",
            icon: "💻"
          },
          {
            name: "Masaüstü",
            slug: "masaustu",
            icon: "🖥️"
          },
          {
            name: "Tablet",
            slug: "tablet",
            icon: "📱"
          },
          {
            name: "Monitör",
            slug: "monitor",
            icon: "🖥️"
          },
          {
            name: "Yazıcı",
            slug: "yazici",
            icon: "🖨️"
          }
        ]
      },
      {
        name: "Televizyon",
        slug: "televizyon",
        icon: "📺",
        subcategories: [
          {
            name: "Smart TV",
            slug: "smart-tv",
            icon: "📺"
          },
          {
            name: "LED TV",
            slug: "led-tv",
            icon: "📺"
          },
          {
            name: "OLED TV",
            slug: "oled-tv",
            icon: "📺"
          },
          {
            name: "4K TV",
            slug: "4k-tv",
            icon: "📺"
          }
        ]
      },
      {
        name: "Kamera ve Fotoğraf",
        slug: "kamera",
        icon: "📸",
        subcategories: [
          {
            name: "DSLR",
            slug: "dslr",
            icon: "📷"
          },
          {
            name: "Aynasız",
            slug: "mirrorless",
            icon: "📷"
          },
          {
            name: "Aksesuarlar",
            slug: "aksesuarlar",
            icon: "🔧"
          }
        ]
      },
      {
        name: "Ses Sistemleri",
        slug: "ses-sistemleri",
        icon: "🔊",
        subcategories: [
          {
            name: "Hoparlör",
            slug: "hoparlor",
            icon: "🔊"
          },
          {
            name: "Kulaklık",
            slug: "kulaklik",
            icon: "🎧"
          },
          {
            name: "Mikrofon",
            slug: "mikrofon",
            icon: "🎤"
          }
        ]
      },
      {
        name: "Oyun Konsolları",
        slug: "oyun-konsollari",
        icon: "🎮",
        subcategories: [
          {
            name: "PlayStation",
            slug: "playstation",
            icon: "🎮"
          },
          {
            name: "Xbox",
            slug: "xbox",
            icon: "🎮"
          },
          {
            name: "Nintendo",
            slug: "nintendo",
            icon: "🎮"
          }
        ]
      },
      {
        name: "Akıllı Saat",
        slug: "akilli-saat",
        icon: "⌚",
        subcategories: [
          {
            name: "Apple Watch",
            slug: "apple-watch",
            icon: "⌚"
          },
          {
            name: "Samsung",
            slug: "samsung-watch",
            icon: "⌚"
          },
          {
            name: "Diğer",
            slug: "diger-saat",
            icon: "⌚"
          }
        ]
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "🔌",
        subcategories: [
          {
            name: "Aksesuarlar",
            slug: "aksesuarlar",
            icon: "🔌"
          },
          {
            name: "Yedek Parça",
            slug: "yedek-parca",
            icon: "🔧"
          }
        ]
      }
    ]
  },
  {
    name: "Ev & Bahçe",
    icon: Home,
    slug: "ev-bahce",
    subcategories: [
      {
        name: "Mobilya",
        slug: "mobilya",
        icon: "🪑",
        subcategories: [
          {
            name: "Oturma Grubu",
            slug: "oturma-grubu",
            icon: "🛋️"
          },
          {
            name: "Yatak Odası",
            slug: "yatak-odasi",
            icon: "🛏️"
          },
          {
            name: "Yemek Odası",
            slug: "yemek-odasi",
            icon: "🍽️"
          }
        ]
      },
      {
        name: "Beyaz Eşya",
        slug: "beyaz-esya",
        icon: "🍽️",
        subcategories: [
          {
            name: "Buzdolabı",
            slug: "buzdolabi",
            icon: "❄️"
          },
          {
            name: "Çamaşır Makinesi",
            slug: "camasir-makinesi",
            icon: "🧺"
          },
          {
            name: "Bulaşık Makinesi",
            slug: "bulasik-makinesi",
            icon: "🍽️"
          }
        ]
      },
      {
        name: "Mutfak Gereçleri",
        slug: "mutfak-gerecleri",
        icon: "🍳",
        subcategories: [
          {
            name: "Tencere",
            slug: "tencere",
            icon: "🍲"
          },
          {
            name: "Tava",
            slug: "tava",
            icon: "🍳"
          },
          {
            name: "Mutfak Aletleri",
            slug: "mutfak-aletleri",
            icon: "🔪"
          }
        ]
      }
    ]
  },
  {
    name: "Giyim",
    icon: Shirt,
    slug: "giyim",
    subcategories: [
      {
        name: "Kadın Giyim",
        slug: "kadin-giyim",
        icon: "👗",
        subcategories: [
          {
            name: "Elbise",
            slug: "elbise",
            icon: "👗"
          },
          {
            name: "Pantolon",
            slug: "pantolon",
            icon: "👖"
          },
          {
            name: "Gömlek",
            slug: "gomlek",
            icon: "👔"
          },
          {
            name: "Bluz",
            slug: "bluz",
            icon: "👚"
          },
          {
            name: "Etek",
            slug: "etek",
            icon: "👗"
          },
          {
            name: "Mont",
            slug: "mont",
            icon: "🧥"
          },
          {
            name: "Kazak",
            slug: "kazak",
            icon: "🧶"
          }
        ]
      },
      {
        name: "Erkek Giyim",
        slug: "erkek-giyim",
        icon: "👔",
        subcategories: [
          {
            name: "Pantolon",
            slug: "pantolon",
            icon: "👖"
          },
          {
            name: "Gömlek",
            slug: "gomlek",
            icon: "👔"
          },
          {
            name: "Ceket",
            slug: "ceket",
            icon: "🧥"
          },
          {
            name: "Mont",
            slug: "mont",
            icon: "🧥"
          },
          {
            name: "Kazak",
            slug: "kazak",
            icon: "🧶"
          },
          {
            name: "Takım Elbise",
            slug: "takim-elbise",
            icon: "👔"
          }
        ]
      },
      {
        name: "Çocuk Giyim",
        slug: "cocuk-giyim",
        icon: "👶",
        subcategories: [
          {
            name: "0-12 Ay",
            slug: "0-12-ay",
            icon: "👶"
          },
          {
            name: "1-3 Yaş",
            slug: "1-3-yas",
            icon: "👶"
          },
          {
            name: "4-6 Yaş",
            slug: "4-6-yas",
            icon: "👶"
          },
          {
            name: "7-12 Yaş",
            slug: "7-12-yas",
            icon: "👶"
          },
          {
            name: "13-16 Yaş",
            slug: "13-16-yas",
            icon: "👶"
          }
        ]
      },
      {
        name: "Ayakkabı",
        slug: "ayakkabi",
        icon: "👞",
        subcategories: [
          {
            name: "Kadın Ayakkabı",
            slug: "kadin-ayakkabi",
            icon: "👠"
          },
          {
            name: "Erkek Ayakkabı",
            slug: "erkek-ayakkabi",
            icon: "👞"
          },
          {
            name: "Çocuk Ayakkabı",
            slug: "cocuk-ayakkabi",
            icon: "👟"
          },
          {
            name: "Spor Ayakkabı",
            slug: "spor-ayakkabi",
            icon: "👟"
          }
        ]
      },
      {
        name: "Çanta",
        slug: "canta",
        icon: "👜",
        subcategories: [
          {
            name: "El Çantası",
            slug: "el-cantasi",
            icon: "👜"
          },
          {
            name: "Sırt Çantası",
            slug: "sirt-cantasi",
            icon: "🎒"
          },
          {
            name: "Laptop Çantası",
            slug: "laptop-cantasi",
            icon: "💼"
          },
          {
            name: "Spor Çanta",
            slug: "spor-canta",
            icon: "🎒"
          }
        ]
      },
      {
        name: "Aksesuar",
        slug: "aksesuar",
        icon: "💍",
        subcategories: [
          {
            name: "Takı",
            slug: "taki",
            icon: "💍"
          },
          {
            name: "Saat",
            slug: "saat",
            icon: "⌚"
          },
          {
            name: "Gözlük",
            slug: "gozluk",
            icon: "👓"
          },
          {
            name: "Kemer",
            slug: "kemer",
            icon: "👔"
          },
          {
            name: "Şal",
            slug: "sal",
            icon: "🧣"
          }
        ]
      },
      {
        name: "İç Giyim",
        slug: "ic-giyim",
        icon: "👙",
        subcategories: [
          {
            name: "İç Çamaşırı",
            slug: "ic-camasiri",
            icon: "👙"
          },
          {
            name: "Pijama",
            slug: "pijama",
            icon: "🛏️"
          },
          {
            name: "Gece Gömleği",
            slug: "gece-gomlegi",
            icon: "👗"
          }
        ]
      }
    ]
  },
  {
    name: "Sporlar, Oyunlar ve Eğlenceler",
    slug: "sporlar-oyunlar-eglenceler",
    icon: Trophy,
    subcategories: [
      {
        name: "Spor Ekipmanları",
        slug: "spor-ekipmanlari",
        icon: Dumbbell,
        subcategories: [
          {
            name: "Fitness Ekipmanları",
            slug: "fitness-ekipmanlari",
            icon: Dumbbell
          },
          {
            name: "Bisiklet",
            slug: "bisiklet",
            icon: BikeIcon
          },
          {
            name: "Kamp Malzemeleri",
            slug: "kamp-malzemeleri",
            icon: Tent
          }
        ]
      },
      {
        name: "Takım Sporları",
        slug: "takim-sporlari",
        icon: Trophy,
        subcategories: [
          {
            name: "Futbol",
            slug: "futbol",
            icon: Circle
          },
          {
            name: "Basketbol",
            slug: "basketbol",
            icon: Circle
          },
          {
            name: "Voleybol",
            slug: "voleybol",
            icon: Circle
          }
        ]
      },
      {
        name: "Bireysel Sporlar",
        slug: "bireysel-sporlar",
        icon: Target,
        subcategories: [
          {
            name: "Yüzme",
            slug: "yuzme",
            icon: Bath
          },
          {
            name: "Tenis",
            slug: "tenis",
            icon: Circle
          },
          {
            name: "Golf",
            slug: "golf",
            icon: Circle
          }
        ]
      },
      {
        name: "Eğlence",
        slug: "eglence",
        icon: PartyPopper,
        subcategories: [
          {
            name: "Müzik Aletleri",
            slug: "muzik-aletleri",
            icon: Music2
          },
          {
            name: "Tiyatro",
            slug: "tiyatro",
            icon: Theater
          },
          {
            name: "Parti Malzemeleri",
            slug: "parti-malzemeleri",
            icon: PartyPopper
          }
        ]
      }
    ]
  },
  {
    name: "Anne & Bebek",
    icon: Baby,
    slug: "anne-bebek",
    subcategories: [
      {
        name: "Bebek Giyim",
        slug: "bebek-giyim",
        icon: "👶"
      },
      {
        name: "Bebek Bakım",
        slug: "bebek-bakim",
        icon: "🛏️"
      },
      {
        name: "Bebek Arabası",
        slug: "bebek-arabasi",
        icon: "🚗"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "📱"
      }
    ]
  },
  {
    name: "Eğitim & Kurslar",
    icon: GraduationCap,
    slug: "egitim-kurslar",
    subcategories: [
      {
        name: "Yabancı Dil",
        slug: "yabanci-dil",
        icon: "🌍"
      },
      {
        name: "Müzik",
        slug: "muzik",
        icon: "🎸"
      },
      {
        name: "Spor",
        slug: "spor",
        icon: "🏋️"
      },
      {
        name: "Dans",
        slug: "dans",
        icon: "💃"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "📱"
      }
    ]
  },
  {
    name: "Yemek & İçecek",
    icon: Utensils,
    slug: "yemek-icecek",
    subcategories: [
      {
        name: "Tatlı",
        slug: "tatli",
        icon: "🍰"
      },
      {
        name: "Kahvaltılık",
        slug: "kahvaltilik",
        icon: "🍯"
      },
      {
        name: "İçecek",
        slug: "icecek",
        icon: "☕"
      },
      {
        name: "Kuruyemiş",
        slug: "kuruyemis",
        icon: "🥜"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "🍽️"
      }
    ]
  },
  {
    name: "Turizm & Gecelemeler",
    icon: Hotel,
    slug: "turizm-gecelemeler",
    subcategories: [
      {
        name: "Konaklama",
        slug: "konaklama",
        icon: "🏨"
      },
      {
        name: "Turlar",
        slug: "turlar",
        icon: "🚢"
      },
      {
        name: "Uçak Bileti",
        slug: "ucak-bileti",
        icon: "✈️"
      },
      {
        name: "Araç Kiralama",
        slug: "arac-kiralama",
        icon: "🚗"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "🎒"
      }
    ]
  },
  {
    name: "Sağlık & Güzellik",
    icon: Heart,
    slug: "saglik-guzellik",
    subcategories: [
      {
        name: "Cilt Bakımı",
        slug: "cilt-bakimi",
        icon: "✨"
      },
      {
        name: "Masaj",
        slug: "masaj",
        icon: "💆"
      },
      {
        name: "Saç Bakımı",
        slug: "sac-bakimi",
        icon: "💇"
      },
      {
        name: "Spor & Fitness",
        slug: "spor-fitness",
        icon: "🏋️"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "💅"
      }
    ]
  },
  {
    name: "Sanat & Hobi",
    icon: Palette,
    slug: "sanat-hobi",
    subcategories: [
      {
        name: "Resim",
        slug: "resim",
        icon: "🎨"
      },
      {
        name: "Müzik",
        slug: "muzik",
        icon: "🎵"
      },
      {
        name: "Seramik",
        slug: "seramik",
        icon: "🏺"
      },
      {
        name: "Fotoğrafçılık",
        slug: "fotografcilik",
        icon: "📸"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "🎭"
      }
    ]
  },
  {
    name: "Ücretsiz Gel Al",
    icon: Gift,
    slug: "ucretsiz-gel-al",
    subcategories: [
      {
        name: "Mobilya",
        slug: "mobilya",
        icon: "🪑"
      },
      {
        name: "Oyuncak",
        slug: "oyuncak",
        icon: "🧸"
      },
      {
        name: "Kitap",
        slug: "kitap",
        icon: "📚"
      },
      {
        name: "Giyim",
        slug: "giyim",
        icon: "👕"
      },
      {
        name: "Diğer",
        slug: "diger",
        icon: "🎁"
      }
    ]
  },
  {
    name: "Diğer",
    icon: MoreHorizontal,
    slug: "diger",
    subcategories: [
      {
        name: "Diğer",
        slug: "diger",
        icon: "📱"
      }
    ]
  }
] 