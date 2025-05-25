'use client';

import React, { useState } from 'react';

const TURKIYE_ILLERI = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin',
  'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 'Kırklareli', 'Kırşehir',
  'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
  'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

export default function IlanVerPage() {
  const [showPhone, setShowPhone] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [city, setCity] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">İlan Ver</h1>
      
      {/* Konum Seçimi */}
      <div className="mb-6">
        <label className="block font-medium mb-2" htmlFor="city">Konum (Şehir)</label>
        <select
          id="city"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Şehir seçiniz</option>
          {TURKIYE_ILLERI.map(il => (
            <option key={il} value={il}>{il}</option>
          ))}
        </select>
      </div>

      {/* Premium İlan Seçeneği */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-blue-800">Premium İlan</h2>
            <p className="text-gray-600">İlanınızı öne çıkarın, daha fazla görüntülenme ve etkileşim alın!</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-800">99.00 ₺</p>
            <p className="text-sm text-gray-500">/ aylık</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>İlanınız kategorisinde en üstte gösterilir</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Premium rozeti ile öne çıkar</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>3 kat daha fazla görüntülenme</span>
          </div>
        </div>

        <label className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={() => setIsPremium(!isPremium)}
            className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div>
            <span className="font-medium">Premium İlan Yap</span>
            <p className="text-sm text-gray-500">Aylık 99.00 ₺ ile ilanınızı premium yapın</p>
          </div>
        </label>
      </div>

      {/* Normal İlan Formu */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4">İlan Bilgileri</h2>
        
        {/* Telefon Görünürlüğü Seçeneği */}
        <div className="mb-6">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={showPhone}
              onChange={() => setShowPhone(!showPhone)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span>Telefon numaram ilanda görünsün</span>
          </label>
        </div>

        {/* Diğer form alanları buraya eklenecek */}
        <p className="text-gray-600">İlan detayları ve diğer form alanları buraya eklenecektir.</p>
      </div>
    </div>
  );
} 