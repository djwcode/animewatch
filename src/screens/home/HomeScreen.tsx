import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { useReleasesStore } from '../../stores/releasesStore';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../../components/ui/Button';
import { AnimeList } from '../../components/ui/AnimeList';
import { mockAnimeData, getRandomAnime, getPopularAnime, getLatestAnime } from '../../utils/mockData';
import { Release } from '../../types/api';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { loadLatestReleases, loadPopularReleases, loadRandomReleases } = useReleasesStore();
  const { user, logout } = useAuthStore();

  // Создаем отдельные состояния для разных типов релизов
  const [latestAnime, setLatestAnime] = useState<Release[]>([]);
  const [popularAnime, setPopularAnime] = useState<Release[]>([]);
  const [randomAnime, setRandomAnime] = useState<Release[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

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
      paddingTop: theme.spacing.md,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    searchButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flex: 1,
      paddingBottom: theme.spacing.xl,
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
    debugContainer: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      margin: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    debugTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    debugText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
  });

  // Функции для загрузки разных типов данных
  const loadLatest = async () => {
    setIsLoadingLatest(true);
    try {
      const { apiService } = await import('../../services/api');
      const releases = await apiService.getLatestReleases(14);
      setLatestAnime(releases);
    } catch (error) {
      // В случае ошибки используем мок-данные
      setLatestAnime(getLatestAnime());
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const loadPopular = async () => {
    setIsLoadingPopular(true);
    try {
      const { apiService } = await import('../../services/api');
      const response = await apiService.getCatalogReleases(1, 14, { 
        sorting: 'RATING_DESC' 
      });
      setPopularAnime(response.data);
    } catch (error) {
      // В случае ошибки используем мок-данные
      setPopularAnime(getPopularAnime());
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const loadRandom = async () => {
    setIsLoadingRandom(true);
    try {
      const { apiService } = await import('../../services/api');
      const releases = await apiService.getRandomReleases(5);
      setRandomAnime(releases);
    } catch (error) {
      // В случае ошибки используем мок-данные
      setRandomAnime(getRandomAnime(5));
    } finally {
      setIsLoadingRandom(false);
    }
  };

  useEffect(() => {
    // Загружаем все типы релизов
    loadLatest();
    loadPopular(); 
    loadRandom();
  }, []);

  const handleAnimePress = (anime: Release) => {
    (navigation as any).navigate('ReleaseDetail', {
      releaseId: anime.id!,
      alias: anime.alias
    });
  };

  const handleSeeAllPress = (category: 'latest' | 'popular' | 'random') => {
    // Навигация к каталогу с соответствующим фильтром
    (navigation as any).navigate('CatalogTab', {
      screen: 'Catalog',
      params: { category }
    });
  };

  const isLoading = isLoadingLatest || isLoadingPopular || isLoadingRandom;

  if (isLoading && latestAnime.length === 0 && popularAnime.length === 0 && randomAnime.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Привет{user?.nickname ? `, ${user.nickname}` : ''}!
          </Text>
          <Text style={styles.subtitle}>Что будем смотреть сегодня?</Text>
        </View>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => (navigation as any).navigate('Search')}
        >
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Последние релизы */}
        <AnimeList
          title="Последние релизы"
          data={latestAnime}
          horizontal
          size="medium"
          showSeeAll
          onSeeAllPress={() => handleSeeAllPress('latest')}
          onItemPress={handleAnimePress}
          showStatus
        />

        {/* Популярное */}
        <AnimeList
          title="Популярное"
          data={popularAnime}
          horizontal
          size="medium"
          showSeeAll
          onSeeAllPress={() => handleSeeAllPress('popular')}
          onItemPress={handleAnimePress}
        />

        {/* Случайные аниме */}
        <AnimeList
          title="Рекомендуем к просмотру"
          data={randomAnime}
          horizontal
          size="large"
          showSeeAll
          onSeeAllPress={() => handleSeeAllPress('random')}
          onItemPress={handleAnimePress}
        />


      </ScrollView>
    </SafeAreaView>
  );
};
