import { AppTheme } from '../types/app';

// Light Theme
export const lightTheme: AppTheme = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// Dark Theme
export const darkTheme: AppTheme = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
  },
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};
