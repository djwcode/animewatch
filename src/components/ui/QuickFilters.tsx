import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { CatalogFilters } from '../../types/api';

interface QuickFiltersProps {
  onFilterPress: (filter: Partial<CatalogFilters>) => void;
  activeFilters: CatalogFilters;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  onFilterPress,
  activeFilters,
}) => {
  const theme = useTheme();

  const quickFilters = [
    {
      key: 'latest',
      label: 'Новые',
      icon: 'time-outline',
      filter: { sorting: 'FRESH_AT_DESC' as const },
    },
    {
      key: 'popular',
      label: 'Популярные',
      icon: 'trending-up-outline',
      filter: { sorting: 'RATING_DESC' as const },
    },
    {
      key: 'ongoing',
      label: 'Онгоинг',
      icon: 'play-circle-outline',
      filter: { publish_statuses: ['IS_ONGOING'] },
    },
    {
      key: 'completed',
      label: 'Завершённые',
      icon: 'checkmark-circle-outline',
      filter: { publish_statuses: ['IS_COMPLETED'] },
    },
    {
      key: 'movies',
      label: 'Фильмы',
      icon: 'film-outline',
      filter: { types: ['MOVIE'] },
    },
    {
      key: 'tv',
      label: 'ТВ сериалы',
      icon: 'tv-outline',
      filter: { types: ['TV'] },
    },
  ];

  const isFilterActive = (filter: Partial<CatalogFilters>) => {
    return Object.entries(filter).every(([key, value]) => {
      if (Array.isArray(value)) {
        return JSON.stringify(activeFilters[key as keyof CatalogFilters]) === JSON.stringify(value);
      }
      return activeFilters[key as keyof CatalogFilters] === value;
    });
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    filtersContainer: {
      flexDirection: 'row',
    },
    filterButton: {
      alignItems: 'center',
      marginRight: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      minWidth: 80,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterButtonInactive: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    filterIcon: {
      marginBottom: theme.spacing.xs,
    },
    filterText: {
      fontSize: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
    filterTextActive: {
      color: '#FFFFFF',
    },
    filterTextInactive: {
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Быстрые фильтры</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filtersContainer}>
          {quickFilters.map((quickFilter) => {
            const isActive = isFilterActive(quickFilter.filter);
            return (
              <TouchableOpacity
                key={quickFilter.key}
                style={[
                  styles.filterButton,
                  isActive ? styles.filterButtonActive : styles.filterButtonInactive,
                ]}
                onPress={() => onFilterPress(quickFilter.filter)}
              >
                <Ionicons
                  name={quickFilter.icon as any}
                  size={20}
                  color={isActive ? '#FFFFFF' : theme.colors.text}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive,
                  ]}
                >
                  {quickFilter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

