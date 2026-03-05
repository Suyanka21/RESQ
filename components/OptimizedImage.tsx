import React from 'react';
import { StyleProp, ImageStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

interface OptimizedImageProps {
  source: string | { uri: string };
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  placeholder?: string;
  transition?: number;
  recyclingKey?: string;
}

/**
 * Performance-optimized image component using expo-image.
 * Features:
 * - Automatic disk + memory caching
 * - Lazy loading (only loads when visible)
 * - Smooth fade-in transition
 * - BlurHash placeholder support
 * - Memory-efficient recycling for lists
 */
function OptimizedImage({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  transition = 200,
  recyclingKey,
}: OptimizedImageProps) {
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <Image
      source={imageSource}
      style={style}
      contentFit={contentFit}
      placeholder={placeholder}
      transition={transition}
      cachePolicy="memory-disk"
      recyclingKey={recyclingKey}
    />
  );
}

export default React.memo(OptimizedImage);
