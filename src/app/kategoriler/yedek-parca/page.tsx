import React from 'react';

export default function YedekParca() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Yedek Parça</h1>
          <p className="text-xl mb-8">Otomotiv, iş makinesi ve diğer yedek parçalar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Otomotiv</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Motor Parçaları</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kaporta</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Elektronik</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Aksesuar</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">İş Makinesi</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Hidrolik</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Motor</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Şanzıman</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Diğer Parçalar</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Diğer</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Elektrikli Aletler</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Beyaz Eşya</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Sanayi</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Genel Parçalar</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 