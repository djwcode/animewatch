import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { FavoriteItem, Release } from '../types/api';
import { FavoritesState } from '../types/app';

interface FavoritesStore extends FavoritesState {
  // Actions
  loadFavorites: () => Promise<void>;
  loadFavoriteReleases: (page?: number, filters?: any) => Promise<Release[]>;
  addToFavorites: (releaseId: number) => Promise<void>;
  removeFromFavorites: (releaseId: number) => Promise<void>;
  toggleFavorite: (releaseId: number) => Promise<void>;
  isFavorite: (releaseId: number) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: [],
      isLoading: false,
      error: null,

      // Actions
      loadFavorites: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const favorites = await apiService.getFavorites();
          set({
            favorites,
            isLoading: false,
          });
        } catch (error: any) {
          // If user is not authenticated, just clear favorites
          if (error.response?.status === 403 || error.response?.status === 401) {
            set({
              favorites: [],
              isLoading: false,
              error: null,
            });
          } else {
            const errorMessage = error.response?.data?.message || 'Ошибка загрузки избранного';
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
        }
      },

      loadFavoriteReleases: async (page = 1, filters) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.getFavoriteReleases(page, 20, filters);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка загрузки релизов из избранного';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return [];
        }
      },

      addToFavorites: async (releaseId: number) => {
        const state = get();
        
        // Optimistic update
        set({
          favorites: [...state.favorites, releaseId],
        });

        try {
          const items: FavoriteItem[] = [{ release_id: releaseId }];
          const updatedFavorites = await apiService.addToFavorites(items);
          set({
            favorites: updatedFavorites,
            error: null,
          });
        } catch (error: any) {
          // Revert optimistic update
          set({
            favorites: state.favorites,
          });
          
          const errorMessage = error.response?.data?.message || 'Ошибка добавления в избранное';
          set({ error: errorMessage });
          throw error;
        }
      },

      removeFromFavorites: async (releaseId: number) => {
        const state = get();
        
        // Optimistic update
        set({
          favorites: state.favorites.filter(id => id !== releaseId),
        });

        try {
          const items: FavoriteItem[] = [{ release_id: releaseId }];
          const updatedFavorites = await apiService.removeFromFavorites(items);
          set({
            favorites: updatedFavorites,
            error: null,
          });
        } catch (error: any) {
          // Revert optimistic update
          set({
            favorites: state.favorites,
          });
          
          const errorMessage = error.response?.data?.message || 'Ошибка удаления из избранного';
          set({ error: errorMessage });
          throw error;
        }
      },

      toggleFavorite: async (releaseId: number) => {
        const state = get();
        const isFavorite = state.favorites.includes(releaseId);
        
        if (isFavorite) {
          await get().removeFromFavorites(releaseId);
        } else {
          await get().addToFavorites(releaseId);
        }
      },

      isFavorite: (releaseId: number) => {
        return get().favorites.includes(releaseId);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
