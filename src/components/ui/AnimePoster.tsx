import React, { useState } from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';

interface AnimePosterProps {
  poster?: {
    src?: string;
    preview?: string;
    thumbnail?: string;
    optimized?: {
      src?: string;
      preview?: string;
      thumbnail?: string;
    };
  };
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  size?: 'small' | 'medium' | 'large';
  showPlaceholder?: boolean;
}

export const AnimePoster: React.FC<AnimePosterProps> = ({
  poster,
  style,
  imageStyle,
  size = 'medium',
  showPlaceholder = true,
}) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Функция для преобразования относительных путей в абсолютные URL
  const convertToAbsoluteUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/storage')) return `https://anilibria.top${url}`;
    if (url.startsWith('/')) return `https://anilibria.top${url}`;
    return `https://anilibria.top/${url}`;
  };

  // Получаем наилучший доступный URL изображения
  const getImageUrl = (): string => {
    const urls = [
      poster?.optimized?.src,
      poster?.optimized?.preview,
      poster?.src,
      poster?.preview,
      poster?.thumbnail
    ];

    for (const url of urls) {
      if (url) {
        return convertToAbsoluteUrl(url);
      }
    }

    return '';
  };

  const imageUrl = getImageUrl();



  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 60,
          height: 90,
          borderRadius: 6,
        };
      case 'medium':
        return {
          width: 120,
          height: 180,
          borderRadius: 8,
        };
      case 'large':
        return {
          width: 160,
          height: 240,
          borderRadius: 12,
        };
      default:
        return {
          width: 120,
          height: 180,
          borderRadius: 8,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      ...sizeStyles,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.border,
    },
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.border,
    },
  });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const renderPlaceholder = () => (
    <View style={styles.placeholder}>
      <Ionicons
        name="image-outline"
        size={size === 'small' ? 24 : size === 'large' ? 40 : 32}
        color={theme.colors.textSecondary}
      />
    </View>
  );

  const renderLoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <Ionicons
        name="ellipsis-horizontal"
        size={size === 'small' ? 20 : size === 'large' ? 32 : 24}
        color={theme.colors.textSecondary}
      />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {!imageUrl || imageError ? (
        showPlaceholder ? renderPlaceholder() : null
      ) : (
        <>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, imageStyle]}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="cover"
          />
          {isLoading && renderLoadingOverlay()}
        </>
      )}

    </View>
  );
};
