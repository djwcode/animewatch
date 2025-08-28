import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { CollectionItem, CollectionType, Release } from '../types/api';
import { CollectionsState } from '../types/app';

interface CollectionsStore extends CollectionsState {
  // Actions
  loadCollections: () => Promise<void>;
  loadCollectionReleases: (type: CollectionType, page?: number, filters?: any) => Promise<Release[]>;
  addToCollection: (releaseId: number, type: CollectionType) => Promise<void>;
  removeFromCollection: (releaseId: number) => Promise<void>;
  moveToCollection: (releaseId: number, newType: CollectionType) => Promise<void>;
  getReleaseCollectionType: (releaseId: number) => CollectionType | null;
  clearError: () => void;
}

export const useCollectionsStore = create<CollectionsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      collections: {},
      isLoading: false,
      error: null,

      // Actions
      loadCollections: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const collectionsData = await apiService.getCollections();
          
          // Transform array to object structure
          const collections: Record<string, number[]> = {
            PLANNED: [],
            WATCHED: [],
            WATCHING: [],
            POSTPONED: [],
            ABANDONED: [],
          };

          collectionsData.forEach((item: any) => {
            if (Array.isArray(item) && item.length === 2) {
              const [releaseId, type] = item;
              if (collections[type]) {
                collections[type].push(releaseId);
              }
            }
          });

          set({
            collections,
            isLoading: false,
          });
        } catch (error: any) {
          // If user is not authenticated, just clear collections
          if (error.response?.status === 403 || error.response?.status === 401) {
            set({
              collections: {},
              isLoading: false,
              error: null,
            });
          } else {
            const errorMessage = error.response?.data?.message || 'Ошибка загрузки коллекций';
            set({
              isLoading: false,
              error: errorMessage,
            });
          }
        }
      },

      loadCollectionReleases: async (type: CollectionType, page = 1, filters) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiService.getCollectionReleases(type, page, 20, filters);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || `Ошибка загрузки коллекции ${type}`;
          set({
            isLoading: false,
            error: errorMessage,
          });
          return [];
        }
      },

      addToCollection: async (releaseId: number, type: CollectionType) => {
        const state = get();
        
        // Remove from all other collections first (optimistic update)
        const newCollections = { ...state.collections };
        Object.keys(newCollections).forEach(collectionType => {
          newCollections[collectionType] = newCollections[collectionType]?.filter(id => id !== releaseId) || [];
        });
        
        // Add to new collection
        if (!newCollections[type]) {
          newCollections[type] = [];
        }
        newCollections[type].push(releaseId);
        
        set({ collections: newCollections });

        try {
          const items: CollectionItem[] = [{ release_id: releaseId, type_of_collection: type }];
          await apiService.addToCollection(items);
          
          // Reload collections to get the actual server state
          await get().loadCollections();
          
          set({ error: null });
        } catch (error: any) {
          // Revert optimistic update
          set({ collections: state.collections });
          
          const errorMessage = error.response?.data?.message || 'Ошибка добавления в коллекцию';
          set({ error: errorMessage });
          throw error;
        }
      },

      removeFromCollection: async (releaseId: number) => {
        const state = get();
        
        // Remove from all collections (optimistic update)
        const newCollections = { ...state.collections };
        Object.keys(newCollections).forEach(collectionType => {
          newCollections[collectionType] = newCollections[collectionType]?.filter(id => id !== releaseId) || [];
        });
        
        set({ collections: newCollections });

        try {
          const items = [{ release_id: releaseId }];
          await apiService.removeFromCollection(items);
          
          set({ error: null });
        } catch (error: any) {
          // Revert optimistic update
          set({ collections: state.collections });
          
          const errorMessage = error.response?.data?.message || 'Ошибка удаления из коллекции';
          set({ error: errorMessage });
          throw error;
        }
      },

      moveToCollection: async (releaseId: number, newType: CollectionType) => {
        await get().addToCollection(releaseId, newType);
      },

      getReleaseCollectionType: (releaseId: number) => {
        const state = get();
        
        for (const [type, releases] of Object.entries(state.collections)) {
          if (releases?.includes(releaseId)) {
            return type as CollectionType;
          }
        }
        
        return null;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        collections: state.collections,
      }),
    }
  )
);
