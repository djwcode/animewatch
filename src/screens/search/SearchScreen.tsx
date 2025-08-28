import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { AnimeList } from '../../components/ui/AnimeList';
import { Button } from '../../components/ui/Button';
import { mockAnimeData } from '../../utils/mockData';
import { Release } from '../../types/api';
import { AppNavigationParams } from '../../types/app';

type SearchRouteProp = RouteProp<AppNavigationParams, 'Search'>;

export const SearchScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<SearchRouteProp>();
  const inputRef = useRef<TextInput>(null);
  
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [searchResults, setSearchResults] = useState<Release[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Атака титанов',
    'Клинок рассекающий демонов',
    'Ван-Пис',
    'Наруто'
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    status: '',
    rating: ''
  });
  
  const searchInputScale = useSharedValue(1);
  const filtersHeight = useSharedValue(0);

  useEffect(() => {
    // Автофокус на поиск
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    // Имитация поиска с задержкой
    setTimeout(() => {
      const filteredResults = mockAnimeData.filter(anime => {
        const searchText = query.toLowerCase();
        const title = anime.title?.main?.toLowerCase() || '';
        const titleRussian = anime.title?.russian?.toLowerCase() || '';
        const titleEnglish = anime.title?.english?.toLowerCase() || '';
        const alias = anime.alias?.toLowerCase() || '';
        
        return title.includes(searchText) || 
               titleRussian.includes(searchText) || 
               titleEnglish.includes(searchText) || 
               alias.includes(searchText);
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0 && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleAnimePress = (anime: Release) => {
    (navigation as any).navigate('ReleaseDetail', {
      releaseId: anime.id,
      alias: anime.alias
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    filtersHeight.value = withTiming(showFilters ? 0 : 200, { duration: 300 });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const onSearchInputFocus = () => {
    searchInputScale.value = withSpring(1.02);
  };

  const onSearchInputBlur = () => {
    searchInputScale.value = withSpring(1);
  };

  const searchInputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchInputScale.value }],
  }));

  const filtersAnimatedStyle = useAnimatedStyle(() => ({
    height: filtersHeight.value,
    opacity: filtersHeight.value / 200,
  }));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    backButton: {
      marginRight: theme.spacing.md,
      padding: theme.spacing.sm,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.md,
      height: 50,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
    filterButton: {
      marginLeft: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    filtersContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      overflow: 'hidden',
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    filterItem: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    filterLabel: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: '500',
    },
    filterValue: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      textAlign: 'center',
    },
    content: {
      flex: 1,
    },
    recentSearchesContainer: {
      padding: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    recentSearchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    recentSearchText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    searchIcon: {
      marginRight: theme.spacing.md,
    },
    resultsContainer: {
      flex: 1,
      paddingTop: theme.spacing.md,
    },
    resultsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.md,
    },
    resultsCount: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyIcon: {
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
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
  });

  const renderRecentSearches = () => (
    <View style={styles.recentSearchesContainer}>
      <Text style={styles.sectionTitle}>Недавние поисковые запросы</Text>
      {recentSearches.map((query, index) => (
        <Animated.View
          key={query}
          entering={FadeIn.delay(index * 100)}
        >
          <TouchableOpacity 
            style={styles.recentSearchItem}
            onPress={() => handleSearch(query)}
          >
            <Ionicons 
              name="time-outline" 
              size={20} 
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <Text style={styles.recentSearchText}>{query}</Text>
            <Ionicons 
              name="arrow-up-outline" 
              size={20} 
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <Ionicons name="search" size={50} color={theme.colors.textSecondary} />
          <Text style={styles.loadingText}>Поиск...</Text>
        </View>
      );
    }

    if (searchResults.length === 0 && searchQuery.length > 0) {
      return (
        <Animated.View 
          entering={FadeIn}
          style={styles.emptyContainer}
        >
          <Ionicons 
            name="search-outline" 
            size={80} 
            color={theme.colors.textSecondary}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTitle}>
            Ничего не найдено
          </Text>
          <Text style={styles.emptyDescription}>
            Попробуйте изменить поисковый запрос или используйте фильтры
          </Text>
        </Animated.View>
      );
    }

    if (searchResults.length > 0) {
      return (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              Найдено: {searchResults.length} результатов
            </Text>
          </View>
          <AnimeList
            data={searchResults}
            horizontal={false}
            numColumns={2}
            size="medium"
            onItemPress={handleAnimePress}
            showRating
            showYear
            showStatus
            emptyMessage="Результаты поиска не найдены"
          />
        </View>
      );
    }

    return renderRecentSearches();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Animated.View style={[styles.searchInputContainer, searchInputAnimatedStyle]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Поиск аниме..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              onFocus={onSearchInputFocus}
              onBlur={onSearchInputBlur}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </Animated.View>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              { backgroundColor: showFilters ? theme.colors.primary : theme.colors.surface }
            ]}
            onPress={toggleFilters}
          >
            <Ionicons 
              name="options" 
              size={20} 
              color={showFilters ? theme.colors.background : theme.colors.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Фильтры */}
        <Animated.View style={[styles.filtersContainer, filtersAnimatedStyle]}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Жанр</Text>
              <Text style={styles.filterValue}>Любой</Text>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Год</Text>
              <Text style={styles.filterValue}>Любой</Text>
            </View>
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Статус</Text>
              <Text style={styles.filterValue}>Любой</Text>
            </View>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Рейтинг</Text>
              <Text style={styles.filterValue}>Любой</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSearchResults()}
      </ScrollView>
    </SafeAreaView>
  );
};
