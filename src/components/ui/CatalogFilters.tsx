import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { CatalogFilters as CatalogFiltersType } from '../../types/api';
import { apiService } from '../../services/api';
import { Genre } from '../../types/api';

interface CatalogFiltersProps {
  filters: CatalogFiltersType;
  onFiltersChange: (filters: CatalogFiltersType) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const theme = useTheme();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);

  // Константы для фильтров
  const releaseTypes = [
    { value: 'TV', label: 'ТВ сериал' },
    { value: 'ONA', label: 'ONA' },
    { value: 'WEB', label: 'Веб-сериал' },
    { value: 'OVA', label: 'OVA' },
    { value: 'OAD', label: 'OAD' },
    { value: 'MOVIE', label: 'Фильм' },
    { value: 'DORAMA', label: 'Дорама' },
    { value: 'SPECIAL', label: 'Спешл' },
  ];

  const seasons = [
    { value: 'winter', label: 'Зима' },
    { value: 'spring', label: 'Весна' },
    { value: 'summer', label: 'Лето' },
    { value: 'autumn', label: 'Осень' },
  ];

  const ageRatings = [
    { value: 'R0_PLUS', label: '0+' },
    { value: 'R6_PLUS', label: '6+' },
    { value: 'R12_PLUS', label: '12+' },
    { value: 'R16_PLUS', label: '16+' },
    { value: 'R18_PLUS', label: '18+' },
  ];

  const publishStatuses = [
    { value: 'IS_ONGOING', label: 'Онгоинг' },
    { value: 'IS_COMPLETED', label: 'Завершён' },
    { value: 'IS_ANNOUNCED', label: 'Анонсирован' },
  ];

  const productionStatuses = [
    { value: 'IS_IN_PRODUCTION', label: 'В производстве' },
    { value: 'IS_NOT_IN_PRODUCTION', label: 'Не в производстве' },
  ];

  const sortingOptions = [
    { value: 'FRESH_AT_DESC', label: 'Сначала новые' },
    { value: 'FRESH_AT_ASC', label: 'Сначала старые' },
    { value: 'RATING_DESC', label: 'По рейтингу (высокий)' },
    { value: 'RATING_ASC', label: 'По рейтингу (низкий)' },
    { value: 'YEAR_DESC', label: 'По году (новые)' },
    { value: 'YEAR_ASC', label: 'По году (старые)' },
  ];

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const genresData = await apiService.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Ошибка загрузки жанров:', error);
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const updateFilter = (key: keyof CatalogFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof CatalogFiltersType, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const toggleGenre = (genreId: number) => {
    const currentGenres = filters.genres || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(id => id !== genreId)
      : [...currentGenres, genreId];
    updateFilter('genres', newGenres);
  };

  const isGenreSelected = (genreId: number) => {
    return (filters.genres || []).includes(genreId);
  };

  const isArrayFilterSelected = (key: keyof CatalogFiltersType, value: string) => {
    return (filters[key] as string[])?.includes(value) || false;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    section: {
      marginBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    filterRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
    },
    filterChipSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipUnselected: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    filterChipText: {
      fontSize: 14,
      fontWeight: '500',
    },
    filterChipTextSelected: {
      color: '#FFFFFF',
    },
    filterChipTextUnselected: {
      color: theme.colors.text,
    },
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    yearInputsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    yearInput: {
      flex: 0.48,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    actionsContainer: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    applyButton: {
      backgroundColor: theme.colors.primary,
    },
    resetButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    applyButtonText: {
      color: '#FFFFFF',
    },
    resetButtonText: {
      color: theme.colors.text,
    },
    loadingText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Поиск */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Поиск</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Название аниме..."
            placeholderTextColor={theme.colors.textSecondary}
            value={filters.search || ''}
            onChangeText={(text) => updateFilter('search', text)}
          />
        </View>
      </View>

      {/* Сортировка */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сортировка</Text>
        <View style={styles.filterRow}>
          {sortingOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterChip,
                filters.sorting === option.value
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => updateFilter('sorting', option.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.sorting === option.value
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Типы релизов */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Тип релиза</Text>
        <View style={styles.filterRow}>
          {releaseTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.filterChip,
                isArrayFilterSelected('types', type.value)
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => toggleArrayFilter('types', type.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isArrayFilterSelected('types', type.value)
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Жанры */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Жанры</Text>
        {isLoadingGenres ? (
          <Text style={styles.loadingText}>Загрузка жанров...</Text>
        ) : (
          <View style={styles.filterRow}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.filterChip,
                  isGenreSelected(genre.id)
                    ? styles.filterChipSelected
                    : styles.filterChipUnselected,
                ]}
                onPress={() => toggleGenre(genre.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isGenreSelected(genre.id)
                      ? styles.filterChipTextSelected
                      : styles.filterChipTextUnselected,
                  ]}
                >
                  {genre.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Сезоны */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сезоны</Text>
        <View style={styles.filterRow}>
          {seasons.map((season) => (
            <TouchableOpacity
              key={season.value}
              style={[
                styles.filterChip,
                isArrayFilterSelected('seasons', season.value)
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => toggleArrayFilter('seasons', season.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isArrayFilterSelected('seasons', season.value)
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {season.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Годы */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Годы выпуска</Text>
        <View style={styles.yearInputsContainer}>
          <TextInput
            style={styles.yearInput}
            placeholder="От"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={filters.years?.from_year?.toString() || ''}
            onChangeText={(text) => {
              const year = parseInt(text) || undefined;
              updateFilter('years', {
                ...filters.years,
                from_year: year,
              });
            }}
          />
          <TextInput
            style={styles.yearInput}
            placeholder="До"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={filters.years?.to_year?.toString() || ''}
            onChangeText={(text) => {
              const year = parseInt(text) || undefined;
              updateFilter('years', {
                ...filters.years,
                to_year: year,
              });
            }}
          />
        </View>
      </View>

      {/* Возрастные рейтинги */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Возрастной рейтинг</Text>
        <View style={styles.filterRow}>
          {ageRatings.map((rating) => (
            <TouchableOpacity
              key={rating.value}
              style={[
                styles.filterChip,
                isArrayFilterSelected('age_ratings', rating.value)
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => toggleArrayFilter('age_ratings', rating.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isArrayFilterSelected('age_ratings', rating.value)
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {rating.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Статус публикации */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статус публикации</Text>
        <View style={styles.filterRow}>
          {publishStatuses.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.filterChip,
                isArrayFilterSelected('publish_statuses', status.value)
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => toggleArrayFilter('publish_statuses', status.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isArrayFilterSelected('publish_statuses', status.value)
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Статус производства */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Статус производства</Text>
        <View style={styles.filterRow}>
          {productionStatuses.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.filterChip,
                isArrayFilterSelected('production_statuses', status.value)
                  ? styles.filterChipSelected
                  : styles.filterChipUnselected,
              ]}
              onPress={() => toggleArrayFilter('production_statuses', status.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isArrayFilterSelected('production_statuses', status.value)
                    ? styles.filterChipTextSelected
                    : styles.filterChipTextUnselected,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Кнопки действий */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={onResetFilters}
        >
          <Text style={[styles.actionButtonText, styles.resetButtonText]}>
            Сбросить
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.applyButton]}
          onPress={onApplyFilters}
        >
          <Text style={[styles.actionButtonText, styles.applyButtonText]}>
            Применить
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
