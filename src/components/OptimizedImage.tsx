'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
// ImageOptimizer moved to utils
// import { ImageOptimizer } from '@/lib/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);

  useEffect(() => {
    // WebP desteğini kontrol et
    // setSupportsWebP(ImageOptimizer.supportsWebP());
    // Basit WebP desteği kontrolü
    const canvas = document.createElement('canvas');
    setSupportsWebP(canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0);
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Hata durumunda placeholder göster
  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-1">📷</div>
          <div className="text-xs">Resim Yüklenemedi</div>
        </div>
      </div>
    );
  }

  // Yükleme durumunda skeleton göster
  if (isLoading && !priority) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse`}>
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={src.startsWith('http') && !src.includes('unsplash.com')}
        // WebP formatı için otomatik dönüşüm
        {...(supportsWebP && {
          format: 'webp' as any
        })}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

// Lazy loading için wrapper bileşeni
export function LazyImage(props: OptimizedImageProps) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(`[data-lazy-image="${props.src}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [props.src]);

  if (!isInView) {
    return (
      <div 
        data-lazy-image={props.src}
        className={`${props.className} bg-gray-200 animate-pulse`}
      >
        <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
      </div>
    );
  }

  return <OptimizedImage {...props} />;
} 