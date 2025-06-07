import React from 'react';

export default function Hizmetler() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hizmet İlanları</h1>
          <p className="text-xl mb-8">Profesyonel hizmetler ve servisler</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ev Hizmetleri</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Temizlik</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Tadilat</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Nakliyat</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Bakım</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Eğitim</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Özel Ders</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kurs</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Danışmanlık</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Eğitmen</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sağlık</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Doktor</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Diş Hekimi</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Psikolog</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Fizyoterapist</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 