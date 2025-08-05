import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageProps, View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ImageOptimizer, networkOptimizer } from '../services/performanceService';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  width: number;
  height: number;
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: 'low' | 'normal' | 'high';
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  width,
  height,
  placeholder,
  fallback,
  onLoad,
  onError,
  priority = 'normal',
  quality,
  style,
  ...props
}) => {
  const [imageUri, setImageUri] = useState<string>(placeholder || uri);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<Image>(null);

  // Get optimized image URL based on network conditions
  const getOptimizedUri = (originalUri: string): string => {
    if (!originalUri) return fallback || '';
    
    const networkQuality = networkOptimizer.getImageQuality();
    const shouldUseLowQuality = networkOptimizer.shouldUseLowQualityImages();
    
    // If network is slow, use lower quality
    if (shouldUseLowQuality) {
      return ImageOptimizer.getOptimizedImageUrl(originalUri, width / 2, height / 2);
    }
    
    // Use custom quality if provided
    if (quality) {
      return ImageOptimizer.getOptimizedImageUrl(originalUri, width, height);
    }
    
    return originalUri;
  };

  // Preload image if high priority
  useEffect(() => {
    if (priority === 'high' && uri) {
      ImageOptimizer.preloadImage(uri);
    }
  }, [uri, priority]);

  // Handle image loading
  const handleLoad = () => {
    setIsLoading(false);
    setIsLoaded(true);
    setImageUri(uri);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    if (fallback && imageUri !== fallback) {
      setImageUri(fallback);
      setIsLoading(true);
    } else {
      onError?.();
    }
  };

  // Retry loading with fallback
  const retryLoad = () => {
    if (fallback && !hasError) {
      setImageUri(fallback);
      setIsLoading(true);
      setHasError(false);
    }
  };

  // Show loading indicator
  if (isLoading && !isLoaded) {
    return (
      <View style={[styles.container, { width, height }, style]}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  // Show error state
  if (hasError && !fallback) {
    return (
      <View style={[styles.errorContainer, { width, height }, style]}>
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>📷</Text>
          <Text style={styles.errorSubtext}>Resim yüklenemedi</Text>
        </View>
      </View>
    );
  }

  return (
    <Image
      ref={imageRef}
      source={{ uri: getOptimizedUri(imageUri) }}
      style={[
        styles.image,
        { width, height },
        style
      ]}
      onLoad={handleLoad}
      onError={handleError}
      resizeMode="cover"
      fadeDuration={300}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    borderRadius: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  errorContent: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 24,
    marginBottom: 4,
  },
  errorSubtext: {
    fontSize: 12,
    color: '#666',
  },
});

export default OptimizedImage; 