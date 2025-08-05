'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Product3DViewerProps {
  productId: string;
  productName: string;
  productImages: string[];
  className?: string;
}

export default function Product3DViewer({ 
  productId, 
  productName, 
  productImages, 
  className = '' 
}: Product3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'3D' | 'AR' | 'VR'>('3D');

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js kurulumu
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(400, 400);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Işıklandırma
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Ürün geometrisi (basit küp)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.9
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Kamera pozisyonu
    camera.position.z = 5;

    // Animasyon
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (currentView === '3D') {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Temizlik
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentView]);

  const handleViewChange = (view: '3D' | 'AR' | 'VR') => {
    setCurrentView(view);
  };

  const handleARLaunch = () => {
    // AR deneyimi başlat
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          setCurrentView('AR');
          // AR deneyimi başlatılacak
        })
        .catch((err) => {
          setError('AR kamera erişimi sağlanamadı');
        });
    } else {
      setError('AR bu cihazda desteklenmiyor');
    }
  };

  const handleVRLaunch = () => {
    // VR deneyimi başlat
    setCurrentView('VR');
    // VR deneyimi başlatılacak
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <span className="text-lg">⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {productName} - 3D Görüntüleyici
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewChange('3D')}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              currentView === '3D' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3D
          </button>
          <button
            onClick={handleARLaunch}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              currentView === 'AR' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            AR
          </button>
          <button
            onClick={handleVRLaunch}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              currentView === 'VR' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            VR
          </button>
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <div 
          ref={mountRef} 
          className="w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center"
        >
          {currentView === 'AR' && (
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-gray-600">AR Deneyimi Başlatılıyor...</p>
              <p className="text-sm text-gray-500 mt-2">Kameranızı ürünün üzerine tutun</p>
            </div>
          )}
          
          {currentView === 'VR' && (
            <div className="text-center">
              <div className="text-4xl mb-4">🥽</div>
              <p className="text-gray-600">VR Deneyimi Başlatılıyor...</p>
              <p className="text-sm text-gray-500 mt-2">VR gözlüğünüzü takın</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>3D: Ürünü 360° döndürün</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>AR: Gerçek ortamda görüntüleyin</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>VR: Sanal gerçeklik deneyimi</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Ürün ID: {productId}</span>
          <span>{productImages.length} görsel</span>
        </div>
      </div>
    </div>
  );
} 