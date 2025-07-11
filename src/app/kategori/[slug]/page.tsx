import dynamic from 'next/dynamic';

interface CategoryPageProps {
  params: { slug: string };
};

// Statik kategori verisi (örnek)
const categories = [
  {
    slug: 'elektronik',
    name: 'Elektronik',
    subCategories: [
      { slug: 'telefon', name: 'Telefon' },
      { slug: 'bilgisayar', name: 'Bilgisayar' },
    ],
  },
  {
    slug: 'ev-bahce',
    name: 'Ev & Bahçe',
    subCategories: [
      { slug: 'mobilya', name: 'Mobilya' },
      { slug: 'dekorasyon', name: 'Dekorasyon' },
    ],
  },
  // ... diğer kategoriler ...
];

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(cat => cat.slug === params.slug);

  if (!category) {
    return <div className="p-8">Kategori bulunamadı.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Sadece alt kategoriler */}
      <aside className="w-64 p-4 border-r bg-white">
        <h2 className="text-lg font-semibold mb-4">Alt Kategoriler</h2>
        <div className="space-y-2">
          {category.subCategories.map((sub) => (
            <div key={sub.slug} className="block p-3 rounded-md bg-blue-50">
              {sub.name}
            </div>
          ))}
        </div>
      </aside>
      {/* Ana içerik */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <div className="text-gray-500">Statik export için örnek kategori sayfası.</div>
        </div>
      </div>
    </div>
  );
}

// Statik export için örnek generateStaticParams fonksiyonu
export async function generateStaticParams() {
  return [
    { slug: 'elektronik' },
    { slug: 'ev-bahce' },
    { slug: 'giyim' },
    { slug: 'anne-bebek' },
    { slug: 'egitim-kurslar' },
    { slug: 'yemek-icecek' },
    { slug: 'turizm-gecelemeler' },
    { slug: 'saglik-guzellik' },
    { slug: 'sanat-hobi' },
    { slug: 'is' },
    { slug: 'ucretsiz-gel-al' },
    { slug: 'hizmetler' },
    { slug: 'diger' },
  ];
} 