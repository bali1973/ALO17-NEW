import React from 'react';

export default function Vasita() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Vasıta İlanları</h1>
          <p className="text-xl mb-8">Otomobil, ticari araç ve diğer vasıtalar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Otomobil</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Sıfır Otomobil</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">İkinci El Otomobil</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Hasarlı Otomobil</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Klasik Otomobil</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ticari Araç</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Minivan</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Panelvan</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kamyonet</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kamyon</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diğer</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Motosiklet</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">ATV</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Deniz Aracı</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Hava Aracı</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 