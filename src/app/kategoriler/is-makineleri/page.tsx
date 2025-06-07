import React from 'react';

export default function IsMakineleri() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">İş Makineleri</h1>
          <p className="text-xl mb-8">İnşaat, tarım ve sanayi makineleri</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Alt Kategoriler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">İnşaat</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Ekskavatör</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Buldozer</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Kepçe</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Forklift</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tarım</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Traktör</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Biçerdöver</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Pulluk</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Tarım Aletleri</a></li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sanayi</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">CNC Makineleri</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Torna</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Freze</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Diğer Sanayi Makineleri</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 