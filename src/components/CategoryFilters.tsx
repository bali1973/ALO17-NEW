import React from 'react';

const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Şanlıurfa", "Siirt", "Sinop", "Şırnak", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

const priceRanges = [
  { value: '', label: 'Tüm Fiyatlar' },
  { value: '0-1000', label: '0 - 1.000 TL' },
  { value: '1000-5000', label: '1.000 - 5.000 TL' },
  { value: '5000-10000', label: '5.000 - 10.000 TL' },
  { value: '10000+', label: '10.000 TL ve üzeri' },
];

export interface CategoryFiltersProps {
  city: string;
  onCityChange: (city: string) => void;
  priceRange: string;
  onPriceRangeChange: (range: string) => void;
  premiumOnly: boolean;
  onPremiumOnlyChange: (val: boolean) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  city,
  onCityChange,
  priceRange,
  onPriceRangeChange,
  premiumOnly,
  onPremiumOnlyChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filtreler</h2>
      {/* Şehir */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Şehir</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={city}
          onChange={e => onCityChange(e.target.value)}
        >
          <option value="">Tüm Şehirler</option>
          {cities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {/* Fiyat Aralığı */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Fiyat Aralığı</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={priceRange}
          onChange={e => onPriceRangeChange(e.target.value)}
        >
          {priceRanges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      {/* Premium */}
      <div className="mb-2 flex items-center">
        <input
          type="checkbox"
          id="premiumOnly"
          checked={premiumOnly}
          onChange={e => onPremiumOnlyChange(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="premiumOnly" className="font-medium">Sadece Premium İlanlar</label>
      </div>
    </div>
  );
};

export default CategoryFilters; 