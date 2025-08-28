import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { useTheme } from '../../hooks';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { AnimePoster } from '../../components/ui/AnimePoster';
import { Button } from '../../components/ui/Button';
import { mockAnimeData } from '../../utils/mockData';
import { Release } from '../../types/api';
import { AppNavigationParams } from '../../types/app';
import { getLocalizedTitle, getSubtitle, getLocalizedStatus } from '../../utils/titleUtils';

type ReleaseDetailRouteProp = RouteProp<AppNavigationParams, 'ReleaseDetail'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 60;
const POSTER_HEIGHT = 300;

export const ReleaseDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<ReleaseDetailRouteProp>();
  const navigation = useNavigation();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore();
  
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  
  const scrollY = useSharedValue(0);
  const favoriteScale = useSharedValue(1);

  const { releaseId, alias } = route.params;

  useEffect(() => {
    const loadReleaseData = async () => {
      setLoading(true);
      try {
        // Сначала пытаемся найти в мок данных
        let foundRelease = mockAnimeData.find(item => 
          item.id === releaseId || item.alias === alias
        );

        if (!foundRelease) {
          // Если не найдено в мок данных, пытаемся загрузить из API
          try {
            const { apiService } = await import('../../services/api');
            const apiRelease = await apiService.getRelease(releaseId);
            foundRelease = apiRelease;
          } catch (apiError) {
            console.log('API error, using mock data:', apiError);
            // В случае ошибки API используем первое аниме из мок данных
            foundRelease = mockAnimeData[0];
          }
        }

        setRelease(foundRelease);
        
        // Показываем предупреждение для 18+ контента
        if (foundRelease?.age_rating?.is_adult) {
          setShowAgeWarning(true);
        }
      } catch (error) {
        console.log('Error loading release:', error);
        // В случае ошибки используем первое аниме из мок данных
        setRelease(mockAnimeData[0]);
      } finally {
        setLoading(false);
      }
    };

    loadReleaseData();
  }, [releaseId, alias]);

  const handleFavoritePress = () => {
    if (!release) return;
    
    favoriteScale.value = withTiming(0.8, { duration: 100 }, () => {
      favoriteScale.value = withTiming(1, { duration: 100 });
    });

    if (isFavorite(release.id!)) {
      removeFromFavorites(release.id!);
    } else {
      addToFavorites(release.id!);
    }
  };

  const handleWatchPress = (episodeIndex?: number) => {
    if (!release) return;
    
    // Проверяем возрастное ограничение
    if (release.age_rating?.is_adult) {
      setShowAgeWarning(true);
      return;
    }
    
    // Навигация к видео плееру через корневой навигатор
    (navigation as any).navigate('VideoPlayer', {
      episodeId: `episode-${episodeIndex || 1}`,
      releaseId: release.id,
      release: release
    });
  };

  const handleAgeWarningConfirm = () => {
    setShowAgeWarning(false);
    if (release) {
      (navigation as any).navigate('VideoPlayer', {
        episodeId: 'episode-1',
        releaseId: release.id,
        release: release
      });
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, POSTER_HEIGHT - HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  const posterAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, POSTER_HEIGHT],
      [1, 1.2],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, POSTER_HEIGHT],
      [0, -POSTER_HEIGHT * 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const favoriteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favoriteScale.value }],
  }));

  const onScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };

  const getAgeRatingColor = (rating: string) => {
    switch (rating) {
      case 'R0_PLUS': return '#4CAF50';
      case 'R6_PLUS': return '#8BC34A';
      case 'R12_PLUS': return '#FFC107';
      case 'R16_PLUS': return '#FF9800';
      case 'R18_PLUS': return '#F44336';
      default: return theme.colors.primary;
    }
  };

  const getStatusText = (release: Release) => {
    if (release.is_ongoing) return 'Онгоинг';
    if (release.is_in_production) return 'В производстве';
    if (release.episodes_total && release.episodes && release.episodes.length >= release.episodes_total) {
      return 'Завершён';
    }
    return 'Неизвестно';
  };

  const getDurationText = (release: Release) => {
    if (release.average_duration_of_episode) {
      return `${release.average_duration_of_episode} мин`;
    }
    if (release.episodes && release.episodes.length > 0) {
      const avgDuration = Math.round(
        release.episodes.reduce((sum, ep) => sum + ep.duration, 0) / release.episodes.length / 60
      );
      return `${avgDuration} мин`;
    }
    return '~24 мин';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_HEIGHT + 44, // +44 for status bar
      backgroundColor: theme.colors.background,
      zIndex: 10,
      paddingTop: 44,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: theme.spacing.md,
    },
    posterContainer: {
      height: POSTER_HEIGHT,
      position: 'relative',
      overflow: 'hidden',
    },
    posterBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
    },
    posterContent: {
      flex: 1,
      flexDirection: 'row',
      padding: theme.spacing.lg,
      alignItems: 'flex-end',
    },
    posterImage: {
      marginRight: theme.spacing.lg,
    },
    posterInfo: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    metaInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    metaText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    ratingText: {
      fontSize: 14,
      color: theme.colors.background,
      fontWeight: '600',
      marginLeft: 4,
    },
    ageRatingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    ageRatingText: {
      fontSize: 14,
      color: '#fff',
      fontWeight: '600',
      marginLeft: 4,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
    },
    showMoreButton: {
      marginTop: theme.spacing.sm,
    },
    showMoreText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    episodesContainer: {
      marginTop: theme.spacing.md,
    },
    episodeItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
    },
    episodeNumber: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    episodeNumberText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.background,
    },
    episodeInfo: {
      flex: 1,
    },
    episodeTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    episodeDuration: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    playButton: {
      padding: theme.spacing.sm,
    },
    actionButtons: {
      flexDirection: 'row',
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    favoriteButton: {
      flex: 1,
    },
    watchButton: {
      flex: 2,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    infoItem: {
      width: '48%',
      marginBottom: theme.spacing.sm,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    genreTag: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
    },
    genreText: {
      color: theme.colors.background,
      fontSize: 14,
      fontWeight: '500',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      margin: theme.spacing.lg,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    modalDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
      lineHeight: 24,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    modalButton: {
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      minWidth: 100,
    },
    modalButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonSecondary: {
      backgroundColor: theme.colors.border,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    modalButtonTextPrimary: {
      color: theme.colors.background,
    },
    modalButtonTextSecondary: {
      color: theme.colors.text,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.metaText, { marginTop: theme.spacing.md }]}>
            Загрузка деталей релиза...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!release) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.metaText}>Релиз не найден</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(release.id!);
  const description = release.description || 'Описание отсутствует';
  const shouldShowMore = description.length > 200;
  const displayDescription = shouldShowMore && !showFullDescription 
    ? description.slice(0, 200) + '...' 
    : description;

  // Используем реальные эпизоды из API или мок данные
  const episodes = release.episodes || Array.from({ length: 12 }, (_, i) => ({
    id: `episode-${i + 1}`,
    name: `Эпизод ${i + 1}`,
    ordinal: i + 1,
    duration: 1440, // 24 минуты в секундах
  }));

  return (
    <View style={styles.container}>
      {/* Анимированный заголовок */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {getLocalizedTitle(release)}
        </Text>
        <Animated.View style={favoriteAnimatedStyle}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleFavoritePress}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={24} 
              color={isFav ? theme.colors.error : theme.colors.text} 
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.content}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Постер секция */}
        <View style={styles.posterContainer}>
          <Animated.View style={[styles.posterBackground, posterAnimatedStyle]} />
          <View style={styles.posterContent}>
            <AnimePoster
              poster={release.poster}
              size="medium"
              style={styles.posterImage}
            />
            <View style={styles.posterInfo}>
              <Text style={styles.title} numberOfLines={2}>
                {getLocalizedTitle(release)}
              </Text>
              {getSubtitle(release) && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {getSubtitle(release)}
                </Text>
              )}
              
              <View style={styles.metaInfo}>
                <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.metaText}>{release.year}</Text>
              </View>

              {release.type && (
                <View style={styles.metaInfo}>
                  <Ionicons name="information-circle-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {release.type.description}
                  </Text>
                </View>
              )}

              {release.season && (
                <View style={styles.metaInfo}>
                  <Ionicons name="leaf-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {release.season.description}
                  </Text>
                </View>
              )}
              
              {/* Рейтинг */}
              {release.rating && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={theme.colors.background} />
                  <Text style={styles.ratingText}>
                    {release.rating.toFixed(1)}
                  </Text>
                </View>
              )}

              {/* Возрастное ограничение */}
              {release.age_rating && (
                <View style={[
                  styles.ageRatingContainer, 
                  { backgroundColor: getAgeRatingColor(release.age_rating.value) }
                ]}>
                  <Ionicons 
                    name={release.age_rating.is_adult ? "warning" : "shield-checkmark"} 
                    size={14} 
                    color="#fff" 
                  />
                  <Text style={styles.ageRatingText}>
                    {release.age_rating.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionButtons}>
          <View style={styles.watchButton}>
            <Button
              title="Смотреть"
              leftIcon="play"
              onPress={() => handleWatchPress()}
            />
          </View>
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>
            {displayDescription}
          </Text>
          {shouldShowMore && (
            <TouchableOpacity 
              style={styles.showMoreButton}
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={styles.showMoreText}>
                {showFullDescription ? 'Скрыть' : 'Показать полностью'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Жанры */}
        {release.genres && release.genres.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Жанры</Text>
            <View style={styles.genresContainer}>
              {release.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Информация о релизе */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Тип:</Text>
              <Text style={styles.infoValue}>
                {release.type?.description || 'Аниме сериал'}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Статус:</Text>
              <Text style={styles.infoValue}>
                {getStatusText(release)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Эпизодов:</Text>
              <Text style={styles.infoValue}>
                {release.episodes_total || episodes.length}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Длительность:</Text>
              <Text style={styles.infoValue}>
                {getDurationText(release)}
              </Text>
            </View>
            {release.publish_day && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>День выхода:</Text>
                <Text style={styles.infoValue}>
                  {release.publish_day.description}
                </Text>
              </View>
            )}
            {release.added_in_users_favorites && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>В избранном:</Text>
                <Text style={styles.infoValue}>
                  {release.added_in_users_favorites.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Эпизоды */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Эпизоды</Text>
          <View style={styles.episodesContainer}>
            {episodes.map((episode) => (
              <TouchableOpacity
                key={episode.id || episode.ordinal}
                style={styles.episodeItem}
                onPress={() => handleWatchPress(episode.ordinal)}
              >
                <View style={styles.episodeNumber}>
                  <Text style={styles.episodeNumberText}>
                    {episode.ordinal}
                  </Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle}>
                    {episode.name}
                  </Text>
                  <Text style={styles.episodeDuration}>
                    ~{Math.round(episode.duration / 60)} мин
                  </Text>
                </View>
                <View style={styles.playButton}>
                  <Ionicons 
                    name="play-circle-outline" 
                    size={28} 
                    color={theme.colors.primary} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Модальное окно возрастного предупреждения */}
      <Modal
        visible={showAgeWarning}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAgeWarning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons 
              name="warning" 
              size={48} 
              color={theme.colors.error} 
              style={{ marginBottom: theme.spacing.md }}
            />
            <Text style={styles.modalTitle}>Возрастное ограничение</Text>
            <Text style={styles.modalDescription}>
              Данный контент предназначен для лиц старше 18 лет. 
              Содержит материалы, которые могут быть неприемлемы для несовершеннолетних.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowAgeWarning(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>
                  Отмена
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAgeWarningConfirm}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Продолжить
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
