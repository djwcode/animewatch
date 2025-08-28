import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { 
  ApiResponse, 
  Release, 
  Episode, 
  Genre, 
  AuthTokenResponse, 
  LoginRequest, 
  OtpRequest, 
  OtpResponse, 
  OtpLoginRequest, 
  User,
  CatalogFilters,
  CollectionItem,
  FavoriteItem,
  ViewTimecode,
  ScheduleResponse,
  SearchResponse
} from '../types/api';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'https://anilibria.top/api/v1';
  private storageBaseURL = 'https://anilibria.top';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }



  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('auth_token');
        if (token) {
          // Skip adding auth header for temp tokens to avoid API calls
          if (!token.startsWith('temp-auth-token-')) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await SecureStore.deleteItemAsync('auth_token');
          // You might want to navigate to login screen here
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<AuthTokenResponse> {
    const response = await this.api.post<AuthTokenResponse>('/accounts/users/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/accounts/users/auth/logout');
    await SecureStore.deleteItemAsync('auth_token');
  }

  async requestOtp(request: OtpRequest): Promise<OtpResponse> {
    const response = await this.api.post<OtpResponse>('/accounts/otp/get', request);
    return response.data;
  }

  async loginWithOtp(request: OtpLoginRequest): Promise<AuthTokenResponse> {
    const response = await this.api.post<AuthTokenResponse>('/accounts/otp/login', request);
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/accounts/users/me/profile');
    return response.data;
  }

  // Releases Methods
  async getCatalogReleases(
    page: number = 1,
    limit: number = 20,
    filters?: CatalogFilters
  ): Promise<ApiResponse<Release[]>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(`f[${key}]`, value.join(','));
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue !== undefined && subValue !== null) {
                params.append(`f[${key}][${subKey}]`, subValue.toString());
              }
            });
          } else {
            params.append(`f[${key}]`, value.toString());
          }
        }
      });
    }

    const response = await this.api.get<ApiResponse<Release[]>>(`/anime/catalog/releases?${params}`);
    return response.data;
  }

  async getRelease(idOrAlias: string | number): Promise<Release> {
    const response = await this.api.get<Release>(`/anime/releases/${idOrAlias}`);
    return response.data;
  }

  async getLatestReleases(limit: number = 14): Promise<Release[]> {
    const response = await this.api.get<Release[]>(`/anime/releases/latest?limit=${limit}`);
    return response.data || [];
  }

  async getRandomReleases(limit: number = 5): Promise<Release[]> {
    const response = await this.api.get<Release[]>(`/anime/releases/random?limit=${limit}`);
    return response.data || [];
  }

  async getRecommendedReleases(limit: number = 5, releaseId?: number): Promise<Release[]> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (releaseId) {
      params.append('release_id', releaseId.toString());
    }
    const response = await this.api.get<Release[]>(`/anime/releases/recommended?${params}`);
    return response.data || [];
  }

  async searchReleases(query: string): Promise<Release[]> {
    const response = await this.api.get<Release[]>(`/app/search/releases?query=${encodeURIComponent(query)}`);
    return response.data || [];
  }

  // Episodes Methods
  async getEpisode(episodeId: string): Promise<Episode> {
    const response = await this.api.get<Episode>(`/anime/releases/episodes/${episodeId}`);
    return response.data;
  }

  async getEpisodeTimecode(episodeId: string): Promise<any> {
    const response = await this.api.get(`/anime/releases/episodes/${episodeId}/timecode`);
    return response.data;
  }

  async updateTimecodes(timecodes: ViewTimecode[]): Promise<void> {
    await this.api.post('/accounts/users/me/views/timecodes', timecodes);
  }

  async getTimecodes(since?: string): Promise<any[]> {
    const params = since ? `?since=${encodeURIComponent(since)}` : '';
    const response = await this.api.get(`/accounts/users/me/views/timecodes${params}`);
    return response.data;
  }

  // Genres Methods
  async getGenres(): Promise<Genre[]> {
    const response = await this.api.get<Genre[]>('/anime/genres');
    return response.data;
  }

  async getGenre(genreId: number): Promise<Genre> {
    const response = await this.api.get<Genre>(`/anime/genres/${genreId}`);
    return response.data;
  }

  async getGenreReleases(genreId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<Release[]>> {
    const response = await this.api.get<ApiResponse<Release[]>>(
      `/anime/genres/${genreId}/releases?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Collections Methods
  async getCollections(): Promise<any[]> {
    const response = await this.api.get('/accounts/users/me/collections/ids');
    return response.data;
  }

  async getCollectionReleases(
    type: string,
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<ApiResponse<Release[]>> {
    const params = {
      page,
      limit,
      type_of_collection: type,
      f: filters,
    };
    const response = await this.api.post<ApiResponse<Release[]>>('/accounts/users/me/collections/releases', params);
    return response.data;
  }

  async addToCollection(items: CollectionItem[]): Promise<any[]> {
    const response = await this.api.post('/accounts/users/me/collections', items);
    return response.data;
  }

  async removeFromCollection(items: { release_id: number }[]): Promise<any[]> {
    const response = await this.api.delete('/accounts/users/me/collections', { data: items });
    return response.data;
  }

  // Favorites Methods
  async getFavorites(): Promise<number[]> {
    const response = await this.api.get<{ data: number[] }>('/accounts/users/me/favorites/ids');
    return response.data.data || response.data;
  }

  async getFavoriteReleases(
    page: number = 1,
    limit: number = 20,
    filters?: any
  ): Promise<ApiResponse<Release[]>> {
    const params = {
      page,
      limit,
      f: filters,
    };
    const response = await this.api.post<ApiResponse<Release[]>>('/accounts/users/me/favorites/releases', params);
    return response.data;
  }

  async addToFavorites(items: FavoriteItem[]): Promise<number[]> {
    const response = await this.api.post<number[]>('/accounts/users/me/favorites', items);
    return response.data;
  }

  async removeFromFavorites(items: FavoriteItem[]): Promise<number[]> {
    const response = await this.api.delete('/accounts/users/me/favorites', { data: items });
    return response.data;
  }

  // Schedule Methods
  async getScheduleNow(): Promise<ScheduleResponse> {
    const response = await this.api.get<ScheduleResponse>('/anime/schedule/now');
    return response.data;
  }

  async getScheduleWeek(): Promise<any> {
    const response = await this.api.get('/anime/schedule/week');
    return response.data;
  }

  // References Methods
  async getCatalogGenres(): Promise<any[]> {
    const response = await this.api.get('/anime/catalog/references/genres');
    return response.data;
  }

  async getCatalogTypes(): Promise<any[]> {
    const response = await this.api.get('/anime/catalog/references/types');
    return response.data;
  }

  async getCatalogSeasons(): Promise<any[]> {
    const response = await this.api.get('/anime/catalog/references/seasons');
    return response.data;
  }

  async getCatalogYears(): Promise<number[]> {
    const response = await this.api.get<number[]>('/anime/catalog/references/years');
    return response.data;
  }

  async getCatalogAgeRatings(): Promise<any[]> {
    const response = await this.api.get('/anime/catalog/references/age-ratings');
    return response.data;
  }

  async getCatalogSorting(): Promise<any[]> {
    const response = await this.api.get('/anime/catalog/references/sorting');
    return response.data;
  }

  // Utility Methods
  async getApiStatus(): Promise<any> {
    const response = await this.api.get('/app/status');
    return response.data;
  }

  // Store token after successful login
  async storeToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  // Get stored token
  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  // Clear stored token
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }
}

export const apiService = new ApiService();
export default apiService;
