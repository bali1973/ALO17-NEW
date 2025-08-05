'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ARExperienceProps {
  productId: string;
  productName: string;
  productImage: string;
  onClose: () => void;
}

export default function ARExperience({ 
  productId, 
  productName, 
  productImage, 
  onClose 
}: ARExperienceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startAR();
    return () => {
      stopAR();
    };
  }, []);

  const startAR = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kamera erişimi iste
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Arka kamera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('AR başlatma hatası:', err);
      setError('Kamera erişimi sağlanamadı. Lütfen kamera iznini kontrol edin.');
      setIsLoading(false);
    }
  };

  const stopAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreamActive(false);
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        // Fotoğrafı indir
        const link = document.createElement('a');
        link.download = `ar-${productId}-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const handleClose = () => {
    stopAR();
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AR Başlatılamadı
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
              <p className="text-sm opacity-75">AR Deneyimi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={capturePhoto}
              className="bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-100 transition"
            >
              📸 Fotoğraf Çek
            </button>
          </div>
        </div>
      </div>

      {/* AR Görüntü Alanı */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>AR Deneyimi Başlatılıyor...</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Ürün Overlay */}
        {isStreamActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-24 h-24 object-cover rounded"
                />
                <p className="text-xs text-gray-700 mt-1 text-center">{productName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Alt Kontrol Çubuğu */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">📱</div>
              <p className="text-xs">Kamerayı ürünün üzerine tutun</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">👆</div>
              <p className="text-xs">Dokunarak ürünü yerleştirin</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">📸</div>
              <p className="text-xs">Fotoğraf çekin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gizli Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
} 