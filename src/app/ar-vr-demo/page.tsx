'use client';

import React, { useState } from 'react';
import Product3DViewer from '@/components/Product3DViewer';
import ARExperience from '@/components/ARExperience';
import VRExperience from '@/components/VRExperience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Camera, Glasses, Smartphone, Monitor, Zap } from 'lucide-react';

export default function ARVRDemoPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAR, setShowAR] = useState(false);
  const [showVR, setShowVR] = useState(false);

  // Demo ürünler
  const demoProducts = [
    {
      id: 'demo-1',
      title: 'iPhone 15 Pro',
      price: '45.000 TL',
      images: ['/images/placeholder.svg'],
      category: 'Elektronik',
      description: 'En yeni iPhone modeli ile AR deneyimi yaşayın'
    },
    {
      id: 'demo-2',
      title: 'Samsung 4K TV',
      price: '12.500 TL',
      images: ['/images/placeholder.svg'],
      category: 'Ev Eşyası',
      description: 'Büyük ekran TV\'yi odanızda görün'
    },
    {
      id: 'demo-3',
      title: 'MacBook Air M2',
      price: '35.000 TL',
      images: ['/images/placeholder.svg'],
      category: 'Bilgisayar',
      description: 'Laptop\'u 3D olarak inceleyin'
    }
  ];

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: '3D Görüntüleme',
      description: 'Ürünleri 360° açıdan görüntüleyin'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'AR Deneyimi',
      description: 'Ürünleri gerçek ortamınızda görün'
    },
    {
      icon: <Glasses className="w-6 h-6" />,
      title: 'VR Deneyimi',
      description: 'Sanal gerçeklik ile ürün keşfi'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobil Uyumlu',
      description: 'Tüm cihazlarda çalışır'
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Yüksek Performans',
      description: 'Hızlı ve akıcı deneyim'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Gerçek Zamanlı',
      description: 'Anında güncellenen görüntüler'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🥽 AR/VR Deneyimi
            </h1>
            <p className="text-lg text-gray-600">
              Geleceğin teknolojisi ile ürünlerinizi keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Özellikler */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Teknolojik Özellikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-blue-500">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Demo Ürünler */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Demo Ürünler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <p className="text-2xl font-bold text-blue-600">{product.price}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      3D Görüntüle
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowAR(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      AR
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowVR(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Glasses className="w-4 h-4 mr-2" />
                      VR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 3D Görüntüleyici */}
        {selectedProduct && !showAR && !showVR && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                3D Görüntüleyici
              </h2>
              <Button
                onClick={() => setSelectedProduct(null)}
                variant="outline"
                size="sm"
              >
                Kapat
              </Button>
            </div>
            <Product3DViewer
              productId={selectedProduct.id}
              productName={selectedProduct.title}
              productImages={selectedProduct.images}
            />
          </div>
        )}

        {/* Bilgi Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Camera className="w-5 h-5" />
                AR (Artırılmış Gerçeklik)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Gerçek ortamınızda ürünleri görün</li>
                <li>• Boyut ve uyum kontrolü yapın</li>
                <li>• Fotoğraf çekin ve paylaşın</li>
                <li>• Mobil cihazlarda çalışır</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Glasses className="w-5 h-5" />
                VR (Sanal Gerçeklik)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Tam immersif deneyim</li>
                <li>• 360° ürün inceleme</li>
                <li>• Gerçekçi ışıklandırma</li>
                <li>• VR gözlük desteği</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Teknik Bilgiler */}
        <div className="mt-12">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Teknik Özellikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">3D Teknolojisi</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Three.js WebGL</li>
                    <li>• Gerçek zamanlı render</li>
                    <li>• Responsive tasarım</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AR Teknolojisi</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• WebRTC kamera erişimi</li>
                    <li>• Canvas overlay</li>
                    <li>• Dokunmatik kontroller</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">VR Teknolojisi</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• WebVR API</li>
                    <li>• Tam ekran desteği</li>
                    <li>• Hareket algılama</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AR Deneyimi Modal */}
      {showAR && selectedProduct && (
        <ARExperience
          productId={selectedProduct.id}
          productName={selectedProduct.title}
          productImage={selectedProduct.images[0]}
          onClose={() => setShowAR(false)}
        />
      )}

      {/* VR Deneyimi Modal */}
      {showVR && selectedProduct && (
        <VRExperience
          productId={selectedProduct.id}
          productName={selectedProduct.title}
          productImages={selectedProduct.images}
          onClose={() => setShowVR(false)}
        />
      )}
    </div>
  );
} 
