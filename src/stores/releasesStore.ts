import { create } from 'zustand';
import { apiService } from '../services/api';
import { Release, CatalogFilters } from '../types/api';
import { ReleasesState } from '../types/app';

interface ReleasesStore extends ReleasesState {
  // Actions
  loadCatalogReleases: (page?: number, filters?: CatalogFilters) => Promise<void>;
  loadMoreReleases: () => Promise<void>;
  setFilters: (filters: CatalogFilters) => void;
  clearFilters: () => void;
  searchReleases: (query: string) => Promise<void>;
  loadLatestReleases: () => Promise<void>;
  loadPopularReleases: () => Promise<void>;
  loadRandomReleases: () => Promise<void>;
  loadRecommendedReleases: (releaseId?: number) => Promise<void>;
  loadRelease: (idOrAlias: string | number) => Promise<void>;
  clearCurrentRelease: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialFilters: CatalogFilters = {};

export const useReleasesStore = create<ReleasesStore>((set, get) => ({
  // Initial state
  releases: [],
  currentRelease: null,
  isLoading: false,
  error: null,
  filters: initialFilters,
  hasMore: true,
  page: 1,

  // Actions
  loadCatalogReleases: async (page = 1, filters) => {
    const state = get();
    const newFilters = filters || state.filters;
    
    set({ 
      isLoading: true, 
      error: null,
      ...(page === 1 && { releases: [] })
    });

    try {
      const response = await apiService.getCatalogReleases(page, 20, newFilters);
      const newReleases = response.data;
      
      set((state) => ({
        releases: page === 1 ? newReleases : [...state.releases, ...newReleases],
        isLoading: false,
        hasMore: response.meta?.pagination 
          ? response.meta.pagination.current_page < response.meta.pagination.total_pages
          : newReleases.length === 20,
        page,
        filters: newFilters,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки релизов';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadMoreReleases: async () => {
    const state = get();
    if (!state.hasMore || state.isLoading) return;
    
    await get().loadCatalogReleases(state.page + 1);
  },

  setFilters: (filters: CatalogFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  },

  searchReleases: async (query: string) => {
    set({ isLoading: true, error: null, releases: [] });
    
    try {
      const releases = await apiService.searchReleases(query);
      set({
        releases,
        isLoading: false,
        hasMore: false,
        page: 1,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка поиска';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadLatestReleases: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const releases = await apiService.getLatestReleases();
      set({
        releases,
        isLoading: false,
        hasMore: false,
        page: 1,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки последних релизов';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadPopularReleases: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Используем каталог с сортировкой по популярности (по количеству в избранном)
      const response = await apiService.getCatalogReleases(1, 20, { 
        sorting: 'RATING_DESC' // или можно использовать другую сортировку
      });
      set({
        releases: response.data,
        isLoading: false,
        hasMore: false,
        page: 1,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки популярных релизов';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadRandomReleases: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const releases = await apiService.getRandomReleases();
      set({
        releases,
        isLoading: false,
        hasMore: false,
        page: 1,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки случайных релизов';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadRecommendedReleases: async (releaseId?: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const releases = await apiService.getRecommendedReleases(5, releaseId);
      set({
        releases,
        isLoading: false,
        hasMore: false,
        page: 1,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки рекомендаций';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  loadRelease: async (idOrAlias: string | number) => {
    set({ isLoading: true, error: null, currentRelease: null });
    
    try {
      const release = await apiService.getRelease(idOrAlias);
      set({
        currentRelease: release,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка загрузки релиза';
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  clearCurrentRelease: () => {
    set({ currentRelease: null });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      releases: [],
      currentRelease: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      hasMore: true,
      page: 1,
    });
  },
}));
