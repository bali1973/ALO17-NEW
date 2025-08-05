'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// URL'nin geçerli olup olmadığını kontrol eden fonksiyon
const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Eğer relative URL ise (http/https ile başlamıyorsa) geçerli kabul et
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }
    
    // Absolute URL için URL constructor kullan
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  fallbackSrc = '/images/placeholder.svg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  // Güvenli src değeri - URL kontrolü ile
  const getSafeSrc = (inputSrc: string) => {
    if (!inputSrc || typeof inputSrc !== 'string') return fallbackSrc;
    
    const trimmedSrc = inputSrc.trim();
    if (trimmedSrc === '') return fallbackSrc;
    
    // JSON string kontrolü
    if (trimmedSrc.startsWith('[') && trimmedSrc.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmedSrc);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const firstImage = parsed[0];
          return isValidUrl(firstImage) ? firstImage : fallbackSrc;
        }
      } catch (error) {
        console.error('Image URL JSON parse hatası:', error);
        return fallbackSrc;
      }
    }
    
    // Normal string kontrolü
    return isValidUrl(trimmedSrc) ? trimmedSrc : fallbackSrc;
  };
  
  const [imageSrc, setImageSrc] = useState(getSafeSrc(src));
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const newSafeSrc = getSafeSrc(src);
    setImageSrc(newSafeSrc);
    setIsLoading(true);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-500',
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-sm">Resim yüklenemedi</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <LoadingSpinner size="sm" text="Yükleniyor..." />
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        onLoad={handleLoad}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}

// Lazy loading image component
export function LazyImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={false}
      {...props}
    />
  );
}

// Hero image component for above-the-fold content
export function HeroImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={true}
      quality={90}
      {...props}
    />
  );
}

// Thumbnail image component
export function ThumbnailImage({
  src,
  alt,
  className,
  ...props
}: Omit<OptimizedImageProps, 'quality' | 'priority'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      quality={60}
      priority={false}
      {...props}
    />
  );
} 