import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiService } from '../services/api';
import { User, LoginRequest, OtpRequest, OtpLoginRequest } from '../types/api';
import { AuthState } from '../types/app';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithOtp: (request: OtpLoginRequest) => Promise<void>;
  requestOtp: (request: OtpRequest) => Promise<any>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          // Temporary authentication for test/test
          if (credentials.login === 'test' && credentials.password === 'test') {
            const tempToken = 'temp-auth-token-' + Date.now();
            const tempUser = {
              id: 1,
              username: 'test',
              email: 'test@example.com',
              avatar: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            await apiService.storeToken(tempToken);
            
            set({
              isAuthenticated: true,
              token: tempToken,
              user: tempUser,
              isLoading: false,
              error: null,
            });
            return;
          }
          
          const response = await apiService.login(credentials);
          await apiService.storeToken(response.token);
          
          // Get user profile
          const user = await apiService.getProfile();
          
          set({
            isAuthenticated: true,
            token: response.token,
            user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка входа';
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      loginWithOtp: async (request: OtpLoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.loginWithOtp(request);
          await apiService.storeToken(response.token);
          
          // Get user profile
          const user = await apiService.getProfile();
          
          set({
            isAuthenticated: true,
            token: response.token,
            user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка входа с OTP';
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      requestOtp: async (request: OtpRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiService.requestOtp(request);
          set({ isLoading: false });
          return response;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка запроса OTP';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiService.logout();
        } catch (error) {
          // Even if logout fails on server, clear local data
          console.log('Logout error:', error);
        } finally {
          await apiService.clearToken();
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      },

      loadStoredAuth: async () => {
        set({ isLoading: true });
        try {
          const token = await apiService.getStoredToken();
          if (token) {
            // Check if it's a temporary token
            if (token.startsWith('temp-auth-token-')) {
              const tempUser = {
                id: 1,
                username: 'test',
                email: 'test@example.com',
                avatar: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              set({
                isAuthenticated: true,
                token,
                user: tempUser,
                isLoading: false,
                error: null,
              });
            } else {
              // Verify token by getting profile
              const user = await apiService.getProfile();
              set({
                isAuthenticated: true,
                token,
                user,
                isLoading: false,
                error: null,
              });
            }
          } else {
            set({
              isAuthenticated: false,
              token: null,
              user: null,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          // Token is invalid, clear it
          await apiService.clearToken();
          set({
            isAuthenticated: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
          });
        }
      },

      getProfile: async () => {
        try {
          const user = await apiService.getProfile();
          set({ user });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка получения профиля';
          set({ error: errorMessage });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist non-sensitive data
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
