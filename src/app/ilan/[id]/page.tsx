export default function ListingDetail() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* İlan Detayları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - İlan Bilgileri */}
        <div className="lg:col-span-2">
          {/* ... existing listing details ... */}
        </div>

        {/* Sağ Kolon - Reklam ve İletişim */}
        <div className="space-y-8">
          {/* İletişim Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* ... existing contact info ... */}
          </div>
        </div>
      </div>
    </div>
  );
} 