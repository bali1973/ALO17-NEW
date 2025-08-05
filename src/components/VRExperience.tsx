'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface VRExperienceProps {
  productId: string;
  productName: string;
  productImages: string[];
  onClose: () => void;
}

export default function VRExperience({ 
  productId, 
  productName, 
  productImages, 
  onClose 
}: VRExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // VR sahne kurulumu
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Gökyüzü mavisi

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Göz seviyesi

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Işıklandırma
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Zemin
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    // Ürün modeli (gelişmiş küp)
    const productGeometry = new THREE.BoxGeometry(1, 1, 1);
    const productMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.9
    });
    const product = new THREE.Mesh(productGeometry, productMaterial);
    product.position.set(0, 0, 0);
    scene.add(product);

    // Ürün etrafında dönen ışık
    const productLight = new THREE.PointLight(0xffffff, 1, 10);
    productLight.position.set(0, 2, 0);
    scene.add(productLight);

    // Kontroller
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);

    // Animasyon
    const animate = () => {
      requestAnimationFrame(animate);

      // Kamera rotasyonu
      targetRotationX += (mouseY * 0.5 - targetRotationX) * 0.05;
      targetRotationY += (mouseX * 0.5 - targetRotationY) * 0.05;

      camera.rotation.x = targetRotationX;
      camera.rotation.y = targetRotationY;

      // Ürün animasyonu
      product.rotation.y += 0.01;
      productLight.position.x = Math.sin(Date.now() * 0.001) * 3;
      productLight.position.z = Math.cos(Date.now() * 0.001) * 3;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Pencere boyutu değişikliği
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Temizlik
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              VR Başlatılamadı
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Üst Kontrol Çubuğu */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-full transition"
            >
              ✕
            </button>
            <div>
              <h3 className="font-semibold">{productName}</h3>
              <p className="text-sm opacity-75">VR Deneyimi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-100 transition"
            >
              {isFullscreen ? '🔲' : '⛶'} Tam Ekran
            </button>
          </div>
        </div>
      </div>

      {/* VR Görüntü Alanı */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>VR Deneyimi Başlatılıyor...</p>
            </div>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Alt Kontrol Çubuğu */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl mb-1">🥽</div>
            <p className="text-xs">VR gözlüğü takın</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">👆</div>
            <p className="text-xs">Fare ile bakış açısını değiştirin</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⛶</div>
            <p className="text-xs">Tam ekran deneyimi</p>
          </div>
        </div>
      </div>
    </div>
  );
} 