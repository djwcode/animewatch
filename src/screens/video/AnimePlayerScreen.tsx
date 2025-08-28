import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  BackHandler,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  PanResponder,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Video, ResizeMode, AVPlaybackStatus, Audio } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../hooks';
import { AppNavigationParams } from '../../types/app';
import { Release, Episode } from '../../types/api';

type VideoPlayerRouteProp = RouteProp<AppNavigationParams, 'VideoPlayer'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QualityOption {
  label: string;
  value: '480' | '720' | '1080';
  url: string;
}

interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  isBuffering: boolean;
  videoReady: boolean;
  error: string | null;
  showControls: boolean;
  isFullscreen: boolean;
  showEpisodes: boolean;
  showQualitySelector: boolean;
  currentQuality: '480' | '720' | '1080';
  retryCount: number;
  volume: number;
}

const AnimePlayerScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute<VideoPlayerRouteProp>();
  const navigation = useNavigation();
  
  // Состояние плеера
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: true,
    isBuffering: false,
    videoReady: false,
    error: null,
    showControls: true,
    isFullscreen: false,
    showEpisodes: false,
    showQualitySelector: false,
    currentQuality: '720',
    retryCount: 0,
    volume: 1.0
  });
  
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // Анимация контролов
  const controlsOpacity = useSharedValue(1);
  const { episodeId, releaseId, release } = route.params;
  
  // Рефы
  const videoRef = useRef<Video>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Хелпер функции для обновления состояния
  const updatePlayerState = useCallback((updates: Partial<VideoPlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const setShowControls = useCallback((show: boolean) => {
    updatePlayerState({ showControls: show });
    if (show) {
      controlsOpacity.value = withTiming(1, { duration: 300 });
    } else {
      controlsOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [updatePlayerState, controlsOpacity]);

  const setIsFullscreen = useCallback(async (fullscreen: boolean) => {
    try {
      if (fullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        StatusBar.setHidden(true);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        StatusBar.setHidden(false);
      }
      updatePlayerState({ isFullscreen: fullscreen });
    } catch (error) {
      console.error('Ошибка изменения ориентации:', error);
    }
  }, [updatePlayerState]);

  // Получение URL видео
  const getCurrentVideoUrl = useCallback(() => {
    if (!currentEpisode) return '';
    
    const quality = playerState.currentQuality;
    switch (quality) {
      case '480':
        return currentEpisode.hls_480 || '';
      case '720':
        return currentEpisode.hls_720 || '';
      case '1080':
        return currentEpisode.hls_1080 || '';
      default:
        return currentEpisode.hls_720 || '';
    }
  }, [currentEpisode, playerState.currentQuality]);

  // Обработчики видео
  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    if (status.isBuffering) {
      updatePlayerState({ isBuffering: true });
    } else {
      updatePlayerState({ isBuffering: false });
    }

    if (status.isPlaying !== playerState.isPlaying) {
      updatePlayerState({ isPlaying: status.isPlaying });
    }

    if (status.positionMillis !== playerState.currentTime) {
      updatePlayerState({ currentTime: status.positionMillis });
    }

    if (status.durationMillis && status.durationMillis !== playerState.duration) {
      updatePlayerState({ duration: status.durationMillis });
    }

    if (status.isLoaded && !playerState.videoReady) {
      updatePlayerState({ videoReady: true, isLoading: false });
      // Автоматически запускаем воспроизведение когда видео готово
      if (videoRef.current) {
        videoRef.current.playAsync().catch((error) => {
          console.error('Ошибка автопроигрывания:', error);
        });
      }
    }
  }, [playerState.isPlaying, playerState.currentTime, playerState.duration, playerState.videoReady, updatePlayerState]);

  const onLoadStart = useCallback(() => {
    updatePlayerState({ isLoading: true, error: null });
  }, [updatePlayerState]);

  const onLoad = useCallback(() => {
    updatePlayerState({ isLoading: false, videoReady: true });
  }, [updatePlayerState]);

  const onError = useCallback((error: string) => {
    updatePlayerState({ 
      error, 
      isLoading: false, 
      videoReady: false,
      isPlaying: false 
    });
    
    if (playerState.retryCount < 3) {
      retryTimeoutRef.current = setTimeout(() => {
        setPlayerState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));
        if (videoRef.current) {
          videoRef.current.loadAsync({ uri: getCurrentVideoUrl() });
        }
      }, 2000);
    }
  }, [playerState.retryCount, getCurrentVideoUrl]);

  // Функции управления плеером
  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (playerState.isPlaying) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(0);
        updatePlayerState({ currentTime: 0 });
      } else {
        await videoRef.current.setPositionAsync(0);
        await videoRef.current.playAsync();
        updatePlayerState({ currentTime: 0 });
      }
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
    }
  }, [playerState.isPlaying, updatePlayerState]);

  const seekTo = useCallback(async (time: number) => {
    if (!videoRef.current) return;

    try {
      setIsSeeking(true);
      await videoRef.current.setPositionAsync(time);
      updatePlayerState({ currentTime: time });
      // Автоматически запускаем воспроизведение после перемотки
      await videoRef.current.playAsync();
    } catch (error) {
      console.error('Ошибка перемотки:', error);
    } finally {
      setIsSeeking(false);
    }
  }, [updatePlayerState]);

  const skipTime = useCallback(async (seconds: number) => {
    const newTime = Math.max(0, Math.min(playerState.currentTime + seconds * 1000, playerState.duration));
    await seekTo(newTime);
  }, [playerState.currentTime, playerState.duration, seekTo]);

  const changeQuality = useCallback(async (quality: '480' | '720' | '1080') => {
    if (quality === playerState.currentQuality) return;

    const currentTime = playerState.currentTime;
    updatePlayerState({ currentQuality: quality, isLoading: true });
    
    if (videoRef.current) {
      await videoRef.current.unloadAsync();
      await videoRef.current.loadAsync({ uri: getCurrentVideoUrl() });
      await seekTo(currentTime);
    }
  }, [playerState.currentQuality, playerState.currentTime, updatePlayerState, seekTo, getCurrentVideoUrl]);

  const toggleVolume = useCallback(async () => {
    const newVolume = playerState.volume > 0 ? 0 : 1.0;
    updatePlayerState({ volume: newVolume });
    
    if (videoRef.current) {
      await videoRef.current.setVolumeAsync(newVolume);
    }
  }, [playerState.volume, updatePlayerState]);

  // Управление контролами
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (playerState.isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [setShowControls, playerState.isPlaying]);

  // Обработка жестов
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      showControlsTemporarily();
    },
    onPanResponderMove: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 50) {
        const seekTime = playerState.currentTime + (gestureState.dx / 10) * 1000;
        seekTo(Math.max(0, Math.min(seekTime, playerState.duration)));
      }
    },
    onPanResponderRelease: () => {
      // Обработка отпускания жеста
    }
  }), [showControlsTemporarily, playerState.currentTime, playerState.duration, seekTo]);

  // Эффекты
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (playerState.isFullscreen) {
        setIsFullscreen(false);
        return true;
      }
      return false;
    });

    return () => {
      backHandler.remove();
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [playerState.isFullscreen, setIsFullscreen]);

  useEffect(() => {
    if (release?.episodes) {
      setEpisodes(release.episodes);
      const episode = release.episodes.find((ep: Episode) => ep.id === episodeId);
      setCurrentEpisode(episode || null);
    }
  }, [release, episodeId]);

  // Стили анимации
  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  // Рендер элементов управления
  const renderControls = () => (
    <Animated.View style={[styles.controls, controlsAnimatedStyle]}>
      <View style={styles.topControls}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.topRightControls}>
          <TouchableOpacity onPress={() => updatePlayerState({ showQualitySelector: true })} style={styles.qualityButton}>
            <Text style={styles.qualityText}>{playerState.currentQuality}p</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setIsFullscreen(!playerState.isFullscreen)} style={styles.fullscreenButton}>
            <Ionicons 
              name={playerState.isFullscreen ? "contract" : "expand"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.centerControls}>
        <TouchableOpacity onPress={() => skipTime(-10)} style={styles.skipButton}>
          <Ionicons name="play-back" size={32} color="white" />
          <Text style={styles.skipText}>10</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
          <Ionicons 
            name={playerState.isPlaying ? "pause" : "play"} 
            size={48} 
            color="white" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => skipTime(10)} style={styles.skipButton}>
          <Ionicons name="play-forward" size={32} color="white" />
          <Text style={styles.skipText}>10</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomControls}>
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(playerState.currentTime)}
          </Text>
          
          <Slider
            style={styles.progressSlider}
            minimumValue={0}
            maximumValue={playerState.duration}
            value={playerState.currentTime}
            onSlidingStart={() => setIsSeeking(true)}
            onSlidingComplete={seekTo}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="rgba(255,255,255,0.3)"
          />
          
          <Text style={styles.timeText}>
            {formatTime(playerState.duration)}
          </Text>
        </View>
        
        <View style={styles.bottomRightControls}>
          <TouchableOpacity onPress={toggleVolume} style={styles.volumeButton}>
            <Ionicons 
              name={playerState.volume > 0 ? "volume-high" : "volume-mute"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderQualitySelector = () => (
    <Modal
      visible={playerState.showQualitySelector}
      transparent
      animationType="fade"
      onRequestClose={() => updatePlayerState({ showQualitySelector: false })}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        onPress={() => updatePlayerState({ showQualitySelector: false })}
      >
        <View style={styles.qualityModal}>
          <Text style={styles.qualityModalTitle}>Качество видео</Text>
          {['480', '720', '1080'].map((quality) => (
            <TouchableOpacity
              key={quality}
              style={[
                styles.qualityOption,
                playerState.currentQuality === quality && styles.qualityOptionSelected
              ]}
              onPress={() => {
                changeQuality(quality as '480' | '720' | '1080');
                updatePlayerState({ showQualitySelector: false });
              }}
            >
              <Text style={[
                styles.qualityOptionText,
                playerState.currentQuality === quality && styles.qualityOptionTextSelected
              ]}>
                {quality}p
              </Text>
              {playerState.currentQuality === quality && (
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderEpisodesSelector = () => (
    <Modal
      visible={playerState.showEpisodes}
      transparent
      animationType="slide"
      onRequestClose={() => updatePlayerState({ showEpisodes: false })}
    >
      <View style={styles.episodesModal}>
        <View style={styles.episodesModalHeader}>
          <Text style={styles.episodesModalTitle}>Эпизоды</Text>
          <TouchableOpacity onPress={() => updatePlayerState({ showEpisodes: false })}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.episodesList}>
          {episodes.map((episode) => (
            <TouchableOpacity
              key={episode.id}
              style={[
                styles.episodeItem,
                currentEpisode?.id === episode.id && styles.episodeItemSelected
              ]}
              onPress={() => {
                setCurrentEpisode(episode);
                updatePlayerState({ showEpisodes: false, isLoading: true, error: null });
                if (videoRef.current) {
                  videoRef.current.unloadAsync();
                  videoRef.current.loadAsync({ uri: getCurrentVideoUrl() });
                  setTimeout(() => {
                    if (videoRef.current) {
                      videoRef.current.playAsync();
                    }
                  }, 1000);
                }
              }}
            >
              <Text style={[
                styles.episodeText,
                currentEpisode?.id === episode.id && styles.episodeTextSelected
              ]}>
                Эпизод {episode.ordinal}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={64} color="red" />
      <Text style={styles.errorText}>{playerState.error}</Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={() => {
          updatePlayerState({ error: null, retryCount: 0 });
          if (videoRef.current) {
            videoRef.current.loadAsync({ uri: getCurrentVideoUrl() });
          }
        }}
      >
        <Text style={styles.retryButtonText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={playerState.isFullscreen} />
      
      <View style={styles.videoContainer} {...panResponder.panHandlers}>
        <Video
          ref={videoRef}
          source={{ uri: getCurrentVideoUrl() }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={false}
          onPlaybackStatusUpdate={onPlaybackStatusUpdate}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          useNativeControls={false}
          volume={playerState.volume}
          onError={(error) => onError(`Ошибка загрузки видео: ${error}`)}
        />
        
        {playerState.isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        )}
        
        {playerState.isBuffering && !playerState.isLoading && (
          <View style={styles.bufferingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.bufferingText}>Буферизация...</Text>
          </View>
        )}
        
        {playerState.videoReady && !playerState.error && renderControls()}
        
        {playerState.error && renderError()}
      </View>
      
      {renderQualitySelector()}
      {renderEpisodesSelector()}
    </SafeAreaView>
  );
};

const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 10,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qualityButton: {
    padding: 10,
    marginRight: 10,
  },
  qualityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullscreenButton: {
    padding: 10,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  skipButton: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  skipText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  playPauseButton: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    marginHorizontal: 40,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    minWidth: 50,
  },
  progressSlider: {
    flex: 1,
    marginHorizontal: 15,
  },
  bottomRightControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  volumeButton: {
    padding: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  bufferingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bufferingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qualityModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    minWidth: 250,
  },
  qualityModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  qualityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  qualityOptionSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
  },
  qualityOptionText: {
    color: 'white',
    fontSize: 16,
  },
  qualityOptionTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  episodesModal: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  episodesModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  episodesModalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  episodesList: {
    flex: 1,
    padding: 20,
  },
  episodeItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  episodeItemSelected: {
    backgroundColor: 'rgba(0,122,255,0.2)',
  },
  episodeText: {
    color: 'white',
    fontSize: 16,
  },
  episodeTextSelected: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default AnimePlayerScreen;