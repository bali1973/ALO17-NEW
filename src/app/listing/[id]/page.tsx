import ListingDetail from './ListingDetail';

interface ListingDetailPageProps {
  params: { id: string };
};

// Statik ilan verisi (örnek)
const listings = [
  { id: '1', title: 'Listing 1', price: '1000 TL' },
  { id: '2', title: 'Listing 2', price: '2000 TL' },
  { id: '3', title: 'Listing 3', price: '3000 TL' },
];

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const ilan = listings.find(l => l.id === params.id);

  if (!ilan) {
    return <div className="p-8">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{ilan.title}</h1>
      <div className="text-lg text-gray-700">Price: {ilan.price}</div>
      <div className="text-gray-500 mt-4">Static export sample listing detail page.</div>
    </div>
  );
}

// Statik export için generateStaticParams fonksiyonu
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 