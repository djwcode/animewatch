import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';
import { useSettingsStore, ThemeMode } from '../../stores/settingsStore';
import { useAuthStore } from '../../stores/authStore';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { themeMode, setThemeMode, loadSettings } = useSettingsStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.text,
    },
    themeOptions: {
      marginTop: theme.spacing.sm,
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    themeOptionActive: {
      backgroundColor: theme.colors.primary,
    },
    themeOptionText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    themeOptionTextActive: {
      color: '#FFFFFF',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.error,
      padding: theme.spacing.md,
      margin: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    logoutText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
  });

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return 'sunny-outline';
      case 'dark':
        return 'moon-outline';
      case 'system':
        return 'phone-portrait-outline';
      default:
        return 'phone-portrait-outline';
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Тёмная';
      case 'system':
        return 'Системная';
      default:
        return 'Системная';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Тема оформления</Text>
          </View>
          
          <View style={styles.themeOptions}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeOption,
                  themeMode === mode && styles.themeOptionActive,
                ]}
                onPress={() => handleThemeChange(mode)}
              >
                <Ionicons
                  name={getThemeIcon(mode)}
                  size={20}
                  color={themeMode === mode ? '#FFFFFF' : theme.colors.text}
                />
                <Text
                  style={[
                    styles.themeOptionText,
                    themeMode === mode && styles.themeOptionTextActive,
                  ]}
                >
                  {getThemeLabel(mode)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Пользователь</Text>
          <Text style={styles.settingLabel}>
            {user?.username || 'Гость'}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Выйти</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
