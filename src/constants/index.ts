export * from './theme';

// App Constants
export const APP_VERSION = '1.0.0';
export const API_BASE_URL = 'https://aniliberty.top/api/v1';
export const IMAGE_BASE_URL = 'https://aniliberty.top';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_SETTINGS: 'user_settings',
  WATCH_HISTORY: 'watch_history',
  SEARCH_HISTORY: 'search_history',
  THEME_PREFERENCE: 'theme_preference',
} as const;

// Collection Types
export const COLLECTION_TYPES = {
  PLANNED: 'PLANNED',
  WATCHED: 'WATCHED',
  WATCHING: 'WATCHING',
  POSTPONED: 'POSTPONED',
  ABANDONED: 'ABANDONED',
} as const;

// Video Quality Options
export const VIDEO_QUALITIES = [
  { label: '480p', value: '480p' as const },
  { label: '720p', value: '720p' as const },
  { label: '1080p', value: '1080p' as const },
] as const;

// Age Ratings
export const AGE_RATINGS = {
  'R0_PLUS': { label: '0+', color: '#10B981' },
  'R6_PLUS': { label: '6+', color: '#3B82F6' },
  'R12_PLUS': { label: '12+', color: '#F59E0B' },
  'R16_PLUS': { label: '16+', color: '#EF4444' },
  'R18_PLUS': { label: '18+', color: '#DC2626' },
} as const;

// Release Types
export const RELEASE_TYPES = {
  TV: 'ТВ сериал',
  ONA: 'ONA',
  WEB: 'WEB',
  OVA: 'OVA',
  OAD: 'OAD',
  MOVIE: 'Фильм',
  DORAMA: 'Дорама',
  SPECIAL: 'Спецвыпуск',
} as const;

// Seasons
export const SEASONS = {
  winter: 'Зима',
  spring: 'Весна',
  summer: 'Лето',
  autumn: 'Осень',
} as const;

// Sorting Options
export const SORTING_OPTIONS = [
  { value: 'FRESH_AT_DESC', label: 'По дате обновления ↓' },
  { value: 'FRESH_AT_ASC', label: 'По дате обновления ↑' },
  { value: 'RATING_DESC', label: 'По рейтингу ↓' },
  { value: 'RATING_ASC', label: 'По рейтингу ↑' },
  { value: 'YEAR_DESC', label: 'По году ↓' },
  { value: 'YEAR_ASC', label: 'По году ↑' },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  AUTH_REQUIRED: 'Необходимо войти в аккаунт',
  INVALID_CREDENTIALS: 'Неверный логин или пароль',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  NOT_FOUND: 'Запрашиваемый контент не найден',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Вход выполнен успешно',
  LOGOUT_SUCCESS: 'Выход выполнен успешно',
  ADDED_TO_FAVORITES: 'Добавлено в избранное',
  REMOVED_FROM_FAVORITES: 'Удалено из избранного',
  ADDED_TO_COLLECTION: 'Добавлено в коллекцию',
  REMOVED_FROM_COLLECTION: 'Удалено из коллекции',
} as const;

// Device Info
export const DEVICE_TYPES = {
  PHONE: 'phone',
  TABLET: 'tablet',
  TV: 'tv',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;

// Layout Constants
export const LAYOUT = {
  HEADER_HEIGHT: 56,
  TAB_BAR_HEIGHT: 80,
  CARD_ASPECT_RATIO: 3 / 4,
  EPISODE_CARD_HEIGHT: 120,
} as const;
