import React from 'react';

export default function IsIlanlari() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">İş İlanları</h1>
          <p className="text-xl mb-8">Tam zamanlı, yarı zamanlı ve freelance iş fırsatları</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tam Zamanlı</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Mühendislik</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Bilgi Teknolojileri</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Satış & Pazarlama</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Muhasebe & Finans</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Yarı Zamanlı</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Öğrenci İşleri</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Part Time</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Garsonluk</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kasiyerlik</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Freelance</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Yazılım Geliştirme</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Tasarım</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">İçerik Üretimi</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Danışmanlık</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 