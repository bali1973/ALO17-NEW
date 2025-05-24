import GoogleAdsense from '@/components/ads/GoogleAdsense';

export default function ListingDetail() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Banner Reklam */}
      <div className="mb-8">
        <GoogleAdsense
          slot="YOUR_LISTING_TOP_SLOT"
          style={{ minHeight: '90px' }}
          format="horizontal"
        />
      </div>

      {/* İlan Detayları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon - İlan Bilgileri */}
        <div className="lg:col-span-2">
          {/* ... existing listing details ... */}
        </div>

        {/* Sağ Kolon - Reklam ve İletişim */}
        <div className="space-y-8">
          {/* Sağ Sidebar Reklam */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <GoogleAdsense
              slot="YOUR_LISTING_SIDEBAR_SLOT"
              style={{ minHeight: '600px' }}
              format="vertical"
            />
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* ... existing contact info ... */}
          </div>
        </div>
      </div>

      {/* Alt Banner Reklam */}
      <div className="mt-8">
        <GoogleAdsense
          slot="YOUR_LISTING_BOTTOM_SLOT"
          style={{ minHeight: '90px' }}
          format="horizontal"
        />
      </div>
    </div>
  );
} 