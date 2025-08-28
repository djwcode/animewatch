import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';
import { useSettingsStore } from '../stores';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useSettingsStore();
  
  // Determine which theme to use based on user preference
  const shouldUseDark = 
    themeMode === 'dark' || 
    (themeMode === 'system' && systemColorScheme === 'dark');
  
  // Fallback to light theme if settings are not loaded yet
  if (themeMode === undefined) {
    return lightTheme;
  }
  
  return shouldUseDark ? darkTheme : lightTheme;
};

export default useTheme;
