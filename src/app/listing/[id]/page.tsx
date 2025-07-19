import ListingDetailClient from './ListingDetailClient';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return <ListingDetailClient id={params.id} />;
}

// Statik export için generateStaticParams fonksiyonu
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
} 