import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { AnimeList } from '../../components/ui/AnimeList';
import { Button } from '../../components/ui/Button';
import { mockAnimeData } from '../../utils/mockData';
import { Release } from '../../types/api';

export const FavoritesScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { 
    favorites, 
    isLoading, 
    error, 
    loadFavorites, 
    removeFromFavorites,
    clearError 
  } = useFavoritesStore();
  
  const [favoriteReleases, setFavoriteReleases] = useState<Release[]>([]);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  
  const headerScale = useSharedValue(1);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    // Фильтруем мок-данные по избранным ID
    const filteredReleases = mockAnimeData.filter(anime => 
      favorites.includes(anime.id!)
    );
    setFavoriteReleases(filteredReleases);
  }, [favorites]);

  const handleAnimePress = (anime: Release) => {
    (navigation as any).navigate('ReleaseDetail', {
      releaseId: anime.id,
      alias: anime.alias
    });
  };

  const handleRemoveFromFavorites = async (anime: Release) => {
    Alert.alert(
      'Удалить из избранного',
      `Удалить "${anime.title?.main || anime.alias}" из избранного?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            setIsRemoving(anime.id!);
            try {
              await removeFromFavorites(anime.id!);
            } catch (error) {
              console.log('Error removing from favorites:', error);
            } finally {
              setIsRemoving(null);
            }
          },
        },
      ]
    );
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: headerScale.value }],
  }));

  const onHeaderPress = () => {
    headerScale.value = withSpring(0.95, {}, () => {
      headerScale.value = withSpring(1);
    });
  };

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
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    refreshButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    content: {
      flex: 1,
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
      marginBottom: theme.spacing.xl,
      lineHeight: 24,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
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
    animeListContainer: {
      flex: 1,
      paddingTop: theme.spacing.md,
    },
    removeButton: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={[styles.headerLeft, headerAnimatedStyle]}>
            <Ionicons 
              name="heart" 
              size={28} 
              color={theme.colors.error} 
            />
            <Text style={styles.title}>Избранное</Text>
          </Animated.View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Загрузка избранного...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Animated.View style={[styles.headerLeft, headerAnimatedStyle]}>
            <Ionicons 
              name="heart" 
              size={28} 
              color={theme.colors.error} 
            />
            <Text style={styles.title}>Избранное</Text>
          </Animated.View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Повторить"
            onPress={() => {
              clearError();
              loadFavorites();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onHeaderPress}>
          <Animated.View style={[styles.headerLeft, headerAnimatedStyle]}>
            <Ionicons 
              name="heart" 
              size={28} 
              color={theme.colors.error} 
            />
            <View>
              <Text style={styles.title}>Избранное</Text>
              <Text style={styles.subtitle}>
                {favorites.length} {favorites.length === 1 ? 'аниме' : 'аниме'}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadFavorites}
        >
          <Ionicons name="refresh" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {favoriteReleases.length === 0 ? (
          <Animated.View 
            entering={FadeIn.delay(200)}
            style={styles.emptyContainer}
          >
            <Ionicons 
              name="heart-outline" 
              size={80} 
              color={theme.colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>
              Пока пусто
            </Text>
            <Text style={styles.emptyDescription}>
              Добавляйте аниме в избранное, нажимая на сердечко.{'\n'}
              Здесь будут храниться ваши любимые релизы.
            </Text>
            <Button
              title="Перейти к каталогу"
              onPress={() => navigation.navigate('CatalogTab' as never)}
              leftIcon="grid"
            />
          </Animated.View>
        ) : (
          <View style={styles.animeListContainer}>
            <AnimeList
              data={favoriteReleases}
              horizontal={false}
              numColumns={2}
              size="medium"
              onItemPress={handleAnimePress}
              showRating
              showYear
              showStatus
              emptyMessage="Избранные аниме не найдены"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
