import React from 'react';

export default function EvEsyalari() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Ev Eşyaları</h1>
          <p className="text-xl mb-8">Mobilya, beyaz eşya ve ev dekorasyon ürünleri</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mobilya</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Oturma Grubu</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Yatak Odası</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Yemek Odası</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Ofis Mobilyası</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Beyaz Eşya</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Buzdolabı</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Çamaşır Makinesi</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Bulaşık Makinesi</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Fırın & Ocak</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Dekorasyon</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Halı & Kilim</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Perde & Stor</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Aydınlatma</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Ev Tekstili</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 