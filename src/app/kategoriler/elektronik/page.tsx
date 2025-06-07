import React from 'react';

export default function Elektronik() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Elektronik İlanları</h1>
          <p className="text-xl mb-8">Telefon, bilgisayar ve diğer elektronik ürünler</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Telefon</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Cep Telefonu</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Akıllı Telefon</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Tablet</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Telefon Aksesuarları</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Bilgisayar</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Dizüstü Bilgisayar</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Masaüstü Bilgisayar</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Bilgisayar Parçaları</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Bilgisayar Aksesuarları</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diğer</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">TV & Ses Sistemleri</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Fotoğraf & Kamera</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Oyun Konsolları</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Diğer Elektronik</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 