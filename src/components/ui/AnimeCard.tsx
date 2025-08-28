import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { AnimePoster } from './AnimePoster';
import { Release } from '../../types/api';
import { getLocalizedTitle, getSubtitle, getLocalizedStatus } from '../../utils/titleUtils';

interface AnimeCardProps {
  anime: Release;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  showRating?: boolean;
  showYear?: boolean;
  showStatus?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  style,
  size = 'medium',
  onPress,
  showRating = true,
  showYear = true,
  showStatus = false,
}) => {
  const theme = useTheme();

  const getCardWidth = () => {
    switch (size) {
      case 'small':
        return 80;
      case 'medium':
        return 140;
      case 'large':
        return 180;
      default:
        return 140;
    }
  };

  const cardWidth = getCardWidth();

  const styles = StyleSheet.create({
    container: {
      width: cardWidth,
      marginRight: theme.spacing.md,
    },
    posterContainer: {
      marginBottom: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: size === 'small' ? 14 : size === 'large' ? 20 : 16,
    },
    subtitle: {
      fontSize: size === 'small' ? 10 : size === 'large' ? 12 : 11,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    metaText: {
      fontSize: size === 'small' ? 10 : 11,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      fontSize: size === 'small' ? 10 : 11,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: 2,
    },
    statusBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: 9,
      color: theme.colors.background,
      fontWeight: '600',
    },
  });

  const renderRating = () => {
    if (!showRating || !anime.rating) return null;

    return (
      <View style={styles.ratingContainer}>
        <Ionicons
          name="star"
          size={size === 'small' ? 10 : 12}
          color={theme.colors.warning}
        />
        <Text style={styles.ratingText}>
          {anime.rating.toFixed(1)}
        </Text>
      </View>
    );
  };

  const renderYear = () => {
    if (!showYear || !anime.year) return null;

    return (
      <View style={styles.metaRow}>
        <Ionicons
          name="calendar-outline"
          size={size === 'small' ? 10 : 12}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.metaText}>{anime.year}</Text>
      </View>
    );
  };

  const renderStatus = () => {
    if (!showStatus || !anime.publish_status) return null;

    return (
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          {getLocalizedStatus(anime.publish_status)}
        </Text>
      </View>
    );
  };



  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        <AnimePoster
          poster={anime.poster}
          size={size}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {getLocalizedTitle(anime)}
        </Text>
        
        {getSubtitle(anime) && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {getSubtitle(anime)}
          </Text>
        )}
        
        {renderRating()}
        {renderYear()}
        {renderStatus()}
      </View>
    </TouchableOpacity>
  );
};
