import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { useReleasesStore } from '../../stores/releasesStore';
import { AnimeList } from '../../components/ui/AnimeList';
import { FilterBadge } from '../../components/ui/FilterBadge';
import { QuickFilters } from '../../components/ui/QuickFilters';
import { mockAnimeData } from '../../utils/mockData';
import { Release } from '../../types/api';
import { CatalogStackParamList } from '../../navigation/CatalogStack';

type CatalogRouteProp = RouteProp<CatalogStackParamList, 'Catalog'>;

export const CatalogScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<CatalogRouteProp>();
  const { releases, isLoading, hasMore, loadCatalogReleases, loadMoreReleases, filters, setFilters, clearFilters } = useReleasesStore();
  const [gridColumns, setGridColumns] = useState<2 | 4>(2);

  // Используем реальные данные из API или мок-данные как fallback
  const catalogData = releases.length > 0 ? releases : mockAnimeData;
  
  // Получаем категорию из параметров маршрута
  const category = route.params?.category;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
    },
    headerButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      marginLeft: theme.spacing.sm,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    activeFiltersContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    activeFiltersTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    activeFiltersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    activeFilterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    activeFilterText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
      marginRight: theme.spacing.xs,
    },
    clearFiltersButton: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    clearFiltersText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    // Загружаем данные в зависимости от категории
    if (category) {
      switch (category) {
        case 'latest':
          loadCatalogReleases(1, { sorting: 'FRESH_AT_DESC' });
          break;
        case 'popular':
          loadCatalogReleases(1, { sorting: 'RATING_DESC' });
          break;
        case 'random':
          loadCatalogReleases(1, { sorting: 'YEAR_DESC' }); // Или любая другая сортировка для "случайных"
          break;
        default:
          loadCatalogReleases();
      }
    } else if (releases.length === 0) {
      loadCatalogReleases();
    }
  }, [category, loadCatalogReleases]);

  const handleAnimePress = (anime: Release) => {
    (navigation as any).navigate('ReleaseDetail', {
      releaseId: anime.id!,
      alias: anime.alias
    });
  };

  const toggleGridMode = () => {
    setGridColumns(gridColumns === 2 ? 4 : 2);
  };

  const openFilters = () => {
    (navigation as any).navigate('CatalogFilters');
  };

  const handleClearFilters = () => {
    clearFilters();
    loadCatalogReleases(1);
  };

  const handleQuickFilter = (filter: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...filter };
    setFilters(newFilters);
    loadCatalogReleases(1, newFilters);
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'latest':
        return 'Последние релизы';
      case 'popular':
        return 'Популярное';
      case 'random':
        return 'Рекомендуем к просмотру';
      default:
        return 'Каталог';
    }
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key as keyof typeof filters];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== undefined && v !== null);
      }
      return value !== undefined && value !== null && value !== '';
    });
  };

  const getActiveFiltersText = () => {
    const activeFilters: string[] = [];
    
    if (filters.search) {
      activeFilters.push(`Поиск: "${filters.search}"`);
    }
    
    if (filters.genres && filters.genres.length > 0) {
      activeFilters.push(`Жанры: ${filters.genres.length}`);
    }
    
    if (filters.types && filters.types.length > 0) {
      activeFilters.push(`Типы: ${filters.types.length}`);
    }
    
    if (filters.seasons && filters.seasons.length > 0) {
      activeFilters.push(`Сезоны: ${filters.seasons.length}`);
    }
    
    if (filters.years?.from_year || filters.years?.to_year) {
      const yearText = [];
      if (filters.years.from_year) yearText.push(`от ${filters.years.from_year}`);
      if (filters.years.to_year) yearText.push(`до ${filters.years.to_year}`);
      activeFilters.push(`Годы: ${yearText.join(' ')}`);
    }
    
    if (filters.age_ratings && filters.age_ratings.length > 0) {
      activeFilters.push(`Рейтинг: ${filters.age_ratings.length}`);
    }
    
    if (filters.publish_statuses && filters.publish_statuses.length > 0) {
      activeFilters.push(`Статус: ${filters.publish_statuses.length}`);
    }
    
    if (filters.production_statuses && filters.production_statuses.length > 0) {
      activeFilters.push(`Производство: ${filters.production_statuses.length}`);
    }
    
    if (filters.sorting) {
      const sortingLabels: Record<string, string> = {
        'FRESH_AT_DESC': 'Сначала новые',
        'FRESH_AT_ASC': 'Сначала старые',
        'RATING_DESC': 'По рейтингу (высокий)',
        'RATING_ASC': 'По рейтингу (низкий)',
        'YEAR_DESC': 'По году (новые)',
        'YEAR_ASC': 'По году (старые)',
      };
      activeFilters.push(`Сортировка: ${sortingLabels[filters.sorting]}`);
    }
    
    return activeFilters;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    if (filters.search) count++;
    if (filters.genres && filters.genres.length > 0) count++;
    if (filters.types && filters.types.length > 0) count++;
    if (filters.seasons && filters.seasons.length > 0) count++;
    if (filters.years?.from_year || filters.years?.to_year) count++;
    if (filters.age_ratings && filters.age_ratings.length > 0) count++;
    if (filters.publish_statuses && filters.publish_statuses.length > 0) count++;
    if (filters.production_statuses && filters.production_statuses.length > 0) count++;
    if (filters.sorting) count++;
    
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getCategoryTitle()}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleGridMode}>
            <Ionicons 
              name={gridColumns === 2 ? 'apps' : 'grid'} 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={openFilters}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="options" size={24} color={theme.colors.text} />
              <FilterBadge count={getActiveFiltersCount()} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Показываем активные фильтры */}
      {hasActiveFilters() && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Активные фильтры:</Text>
          <View style={styles.activeFiltersRow}>
            {getActiveFiltersText().map((filterText, index) => (
              <View key={index} style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{filterText}</Text>
                <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              </View>
            ))}
            <TouchableOpacity style={styles.clearFiltersButton} onPress={handleClearFilters}>
              <Text style={styles.clearFiltersText}>Очистить все</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Быстрые фильтры */}
      <QuickFilters
        onFilterPress={handleQuickFilter}
        activeFilters={filters}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <AnimeList
          data={catalogData}
          horizontal={false}
          numColumns={gridColumns}
          size={gridColumns === 4 ? 'small' : 'medium'}
          onItemPress={handleAnimePress}
          showRating
          showYear
          showStatus
          emptyMessage="Релизы не найдены. Попробуйте изменить фильтры поиска."
        />
      </ScrollView>
    </SafeAreaView>
  );
};
