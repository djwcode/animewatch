import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  ViewStyle,
  ListRenderItem 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { AnimeCard } from './AnimeCard';
import { Release } from '../../types/api';

interface AnimeListProps {
  title?: string;
  data: Release[];
  style?: ViewStyle;
  horizontal?: boolean;
  numColumns?: number;
  size?: 'small' | 'medium' | 'large';
  showSeeAll?: boolean;
  onSeeAllPress?: () => void;
  onItemPress?: (item: Release) => void;
  showRating?: boolean;
  showYear?: boolean;
  showStatus?: boolean;
  emptyMessage?: string;
}

export const AnimeList: React.FC<AnimeListProps> = ({
  title,
  data,
  style,
  horizontal = false,
  numColumns = 1,
  size = 'medium',
  showSeeAll = false,
  onSeeAllPress,
  onItemPress,
  showRating = true,
  showYear = true,
  showStatus = false,
  emptyMessage = 'Список пуст',
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingHorizontal: horizontal ? theme.spacing.lg : 0,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    seeAllText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginRight: theme.spacing.xs,
    },
    scrollContainer: {
      paddingHorizontal: horizontal ? theme.spacing.lg : 0,
    },
    gridContainer: {
      paddingHorizontal: theme.spacing.lg,
      justifyContent: 'center',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyIcon: {
      marginBottom: theme.spacing.md,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  const renderHeader = () => {
    if (!title && !showSeeAll) return null;

    return (
      <View style={styles.header}>
        {title && (
          <Text style={styles.title}>{title}</Text>
        )}
        {showSeeAll && onSeeAllPress && (
          <View style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Смотреть все</Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.primary}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="film-outline"
        size={48}
        color={theme.colors.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  const renderItem: ListRenderItem<Release> = ({ item, index }) => {
    const isGrid = numColumns > 1;
    const gridItemStyle = isGrid ? {
      flex: 1,
      maxWidth: `${100 / numColumns}%` as any,
      paddingHorizontal: theme.spacing.xs,
    } : {};

    return (
      <View style={gridItemStyle}>
        <AnimeCard
          anime={item}
          size={size}
          onPress={() => onItemPress?.(item)}
          showRating={showRating}
          showYear={showYear}
          showStatus={showStatus}
          style={isGrid ? { marginRight: 0, width: '100%' } : undefined}
        />
      </View>
    );
  };

  const getItemLayout = (data: any, index: number) => ({
    length: size === 'small' ? 120 : size === 'large' ? 200 : 160,
    offset: (size === 'small' ? 120 : size === 'large' ? 200 : 160) * index,
    index,
  });

  const renderContent = () => {
    if (!data || data.length === 0) {
      return renderEmpty();
    }

    if (horizontal) {
      return (
        <FlatList
          key="horizontal"
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || item.alias || Math.random().toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      );
    }

    if (numColumns > 1) {
      return (
        <FlatList
          key={`grid-${numColumns}`}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id?.toString() || item.alias || Math.random().toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />
      );
    }

    return (
      <FlatList
        key="list-1"
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id?.toString() || item.alias || Math.random().toString()}
        contentContainerStyle={styles.gridContainer}
        scrollEnabled={false}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};
