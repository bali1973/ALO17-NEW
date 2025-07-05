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

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  fallbackSrc = '/images/placeholder.jpg',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

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