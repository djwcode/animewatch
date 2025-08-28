// API Types for AniLiberty
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links?: {
        previous?: string;
        next?: string;
      };
    };
  };
}

// Release Types
export interface Release {
  id: number;
  type?: ReleaseType;
  year: number;
  name?: ReleaseName;
  title?: ReleaseName; // Alias for name for easier use
  alias: string;
  season?: ReleaseSeason;
  poster: ImageWithOptimized;
  fresh_at?: string;
  created_at?: string;
  updated_at?: string;
  is_ongoing?: boolean;
  age_rating?: AgeRating;
  publish_day?: PublishDay;
  description?: string;
  notification?: string;
  episodes_total?: number;
  external_player?: string;
  is_in_production?: boolean;
  is_blocked_by_geo?: boolean;
  is_blocked_by_copyrights?: boolean;
  added_in_users_favorites?: number;
  average_duration_of_episode?: number;
  added_in_planned_collection?: number;
  added_in_watched_collection?: number;
  added_in_watching_collection?: number;
  added_in_postponed_collection?: number;
  added_in_abandoned_collection?: number;
  genres?: Genre[];
  episodes?: Episode[];
  members?: ReleaseMember[];
  torrents?: Torrent[];
  sponsor?: Sponsor;
  // Additional fields for easier app usage
  rating?: number;
  publish_status?: string;
  duration?: number;
}

export interface ReleaseType {
  value: 'TV' | 'ONA' | 'WEB' | 'OVA' | 'OAD' | 'MOVIE' | 'DORAMA' | 'SPECIAL';
  description: string;
}

export interface ReleaseName {
  main: string;
  english: string;
  russian?: string;
  japanese?: string;
  alternative?: string;
}

export interface ReleaseSeason {
  value: 'winter' | 'spring' | 'summer' | 'autumn';
  description: string;
}

export interface AgeRating {
  value: 'R0_PLUS' | 'R6_PLUS' | 'R12_PLUS' | 'R16_PLUS' | 'R18_PLUS';
  label: string;
  is_adult: boolean;
  description: string;
}

export interface PublishDay {
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  description: string;
}

// Image Types
export interface Image {
  src?: string;
  preview?: string;
  thumbnail?: string;
}

export interface ImageWithOptimized extends Image {
  optimized?: Image;
}

// Episode Types
export interface Episode {
  id: string;
  name: string;
  ordinal: number;
  ending?: EpisodeSkip;
  opening?: EpisodeSkip;
  preview?: ImageWithOptimized;
  hls_480?: string;
  hls_720?: string;
  hls_1080?: string;
  duration: number;
  rutube_id?: string;
  youtube_id?: string;
  updated_at: string;
  sort_order: number;
  release_id: number;
  name_english?: string;
}

export interface EpisodeSkip {
  start: number;
  stop: number;
}

// Genre Types
export interface Genre {
  id: number;
  name: string;
  image?: ImageWithOptimized;
  total_releases?: number;
}

// Member Types
export interface ReleaseMember {
  id: string;
  role: MemberRole;
  user?: MemberUser;
  nickname: string;
}

export interface MemberRole {
  value: 'poster' | 'timing' | 'voicing' | 'editing' | 'decorating' | 'translating';
  description: string;
}

export interface MemberUser {
  id: number;
  avatar?: ImageWithOptimized;
}

// Torrent Types
export interface Torrent {
  id: number;
  hash: string;
  size: number;
  type: TorrentType;
  color: TorrentColor;
  codec: TorrentCodec;
  label: string;
  quality: TorrentQuality;
  magnet: string;
  filename: string;
  seeders: number;
  bitrate: number;
  leechers: number;
  sort_order: number;
  updated_at: string;
  is_hardsub: boolean;
  description: string;
  created_at: string;
  completed_times: number;
}

export interface TorrentType {
  value: 'BDRip' | 'HDRip' | 'TVRip' | 'WEBRip' | 'DTVRip' | 'DVDRip' | 'HDTVRip' | 'WEB-DL' | 'WEB-DLRip';
  description: string;
}

export interface TorrentColor {
  value: '8bit' | '10Bit';
  description: string;
}

export interface TorrentCodec {
  value: 'AV1' | 'x264/AVC' | 'x265/HEVC' | 'x265hq/HEVC-HQ';
  label: string;
  description: string;
  label_color: string;
  label_is_visible: boolean;
}

export interface TorrentQuality {
  value: '360p' | '480p' | '576p' | '720p' | '1080p' | '2k' | '4k' | '8k';
  description: string;
}

// Sponsor Types
export interface Sponsor {
  id: string;
  title: string;
  description: string;
  url_title: string;
  url: string;
}

// Authentication Types
export interface AuthTokenResponse {
  token: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface OtpRequest {
  device_id: string;
}

export interface OtpResponse {
  otp: {
    code: string;
    user_id: number;
    device_id: string;
    expired_at: string;
  };
  remaining_time: number;
}

export interface OtpLoginRequest {
  code: number;
  device_id: string;
}

// User Types
export interface User {
  id: number;
  login?: string;
  email?: string;
  nickname: string;
  avatar?: ImageWithOptimized;
  torrents?: {
    passkey?: string;
    uploaded: number;
    downloaded: number;
  };
  is_banned: boolean;
  created_at: string;
  is_with_ads: boolean;
}

// Catalog Filter Types
export interface CatalogFilters {
  genres?: number[];
  types?: string[];
  seasons?: string[];
  years?: {
    from_year?: number;
    to_year?: number;
  };
  search?: string;
  sorting?: 'FRESH_AT_DESC' | 'FRESH_AT_ASC' | 'RATING_DESC' | 'RATING_ASC' | 'YEAR_DESC' | 'YEAR_ASC';
  age_ratings?: string[];
  publish_statuses?: string[];
  production_statuses?: string[];
}

// Collection Types
export type CollectionType = 'PLANNED' | 'WATCHED' | 'WATCHING' | 'POSTPONED' | 'ABANDONED';

export interface CollectionItem {
  release_id: number;
  type_of_collection: CollectionType;
}

// Favorites Types
export interface FavoriteItem {
  release_id: number;
}

// View History Types
export interface ViewTimecode {
  time: number;
  is_watched: boolean;
  release_episode_id: string;
}

// Schedule Types
export interface ScheduleRelease {
  release: Release;
  full_season_is_released: boolean;
  published_release_episode?: Episode;
  next_release_episode_number?: number;
}

export interface ScheduleResponse {
  today: ScheduleRelease[];
  tomorrow: ScheduleRelease[];
  yesterday: ScheduleRelease[];
}

// Search Types
export interface SearchResponse {
  data: Release[];
}
