import React from 'react';

export default function Emlak() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Emlak İlanları</h1>
          <p className="text-xl mb-8">Satılık ve kiralık emlak ilanları</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Konut</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Daire</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kiralık Daire</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Müstakil</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kiralık Müstakil</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">İş Yeri</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Dükkan</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kiralık Dükkan</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Ofis</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kiralık Ofis</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Arsa</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Arsa</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Tarla</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Bağ</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satılık Bahçe</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 