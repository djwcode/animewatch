import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  isLoading: boolean;
}

interface SettingsStore extends SettingsState {
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const SETTINGS_STORAGE_KEY = 'animeviewer_settings';

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // Initial state
  themeMode: 'system',
  isLoading: false,

  // Actions
  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    
    try {
      const settings = { themeMode: mode };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  },

  loadSettings: async () => {
    set({ isLoading: true });
    
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const settings = JSON.parse(stored);
        set({ 
          themeMode: settings.themeMode || 'system',
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoading: false });
    }
  },
}));
