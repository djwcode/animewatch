// App-specific Types
export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
}

export interface NavigationProps {
  navigation: any;
  route?: any;
}

export interface VideoQuality {
  label: string;
  value: '480p' | '720p' | '1080p';
  url: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  quality: VideoQuality;
  isFullscreen: boolean;
  showControls: boolean;
}

export interface DownloadItem {
  id: string;
  episodeId: string;
  releaseName: string;
  episodeName: string;
  quality: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'paused';
  localUri?: string;
  size: number;
}

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: 'episode' | 'release' | 'system';
  releaseId?: number;
  episodeId?: string;
  timestamp: Date;
  isRead: boolean;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  resultsCount: number;
}

export interface WatchHistoryItem {
  releaseId: number;
  episodeId: string;
  progress: number;
  timestamp: Date;
  releaseName: string;
  episodeName: string;
  poster?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  autoplay: boolean;
  defaultQuality: VideoQuality['value'];
  skipIntro: boolean;
  skipOutro: boolean;
  downloadQuality: VideoQuality['value'];
  notifications: {
    newEpisodes: boolean;
    favoriteUpdates: boolean;
    systemMessages: boolean;
  };
  language: 'ru' | 'en';
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Navigation Type Definitions
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ReleaseDetail: { releaseId: number; alias?: string };
  VideoPlayer: { episodeId: string; releaseId: number };
  Search: { query?: string };
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Favorites: undefined;
  Collections: undefined;
  Profile: undefined;
};

export type CatalogStackParamList = {
  CatalogList: undefined;
  CatalogFilters: undefined;
  ReleaseDetail: { releaseId: number; alias?: string };
};

// Общие типы навигации для приложения
export type AppNavigationParams = {
  ReleaseDetail: { releaseId: number; alias?: string };
  VideoPlayer: { episodeId: string; releaseId: number; release?: any };
  Search: { query?: string };
};

// Store Types
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface ReleasesState {
  releases: any[];
  currentRelease: any | null;
  isLoading: boolean;
  error: string | null;
  filters: any;
  hasMore: boolean;
  page: number;
}

export interface FavoritesState {
  favorites: number[];
  isLoading: boolean;
  error: string | null;
}

export interface CollectionsState {
  collections: Record<string, number[]>;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  theme: AppTheme;
  settings: AppSettings;
  isLoading: boolean;
  error: AppError | null;
  notifications: NotificationData[];
  watchHistory: WatchHistoryItem[];
  searchHistory: SearchHistoryItem[];
}

// Component Props Types
export interface ReleaseCardProps {
  release: any;
  onPress: () => void;
  showAddToFavorites?: boolean;
  showCollectionStatus?: boolean;
}

export interface EpisodeCardProps {
  episode: any;
  onPress: () => void;
  progress?: number;
  isWatched?: boolean;
}

export interface GenreChipProps {
  genre: any;
  isSelected?: boolean;
  onPress?: () => void;
}

export interface LoadingStateProps {
  size?: 'small' | 'large';
  text?: string;
}

export interface ErrorStateProps {
  error: string | AppError;
  onRetry?: () => void;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

// Hook Types
export interface UseReleasesReturn {
  releases: any[];
  isLoading: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  hasMore: boolean;
}

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface UseVideoPlayerReturn {
  state: PlayerState;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setQuality: (quality: VideoQuality) => void;
  toggleFullscreen: () => void;
  setVolume: (volume: number) => void;
}
