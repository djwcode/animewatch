import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks';
import { useReleasesStore } from '../../stores/releasesStore';
import { CatalogFilters } from '../../components/ui/CatalogFilters';
import { CatalogFilters as CatalogFiltersType } from '../../types/api';

export const CatalogFiltersScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { filters, setFilters, loadCatalogReleases } = useReleasesStore();
  const [localFilters, setLocalFilters] = useState<CatalogFiltersType>(filters);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  const handleFiltersChange = useCallback((newFilters: CatalogFiltersType) => {
    setLocalFilters(newFilters);
  }, []);

  const handleApplyFilters = useCallback(async () => {
    setFilters(localFilters);
    await loadCatalogReleases(1, localFilters);
    navigation.goBack();
  }, [localFilters, setFilters, loadCatalogReleases, navigation]);

  const handleResetFilters = useCallback(() => {
    const emptyFilters: CatalogFiltersType = {};
    setLocalFilters(emptyFilters);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <CatalogFilters
        filters={localFilters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </SafeAreaView>
  );
};
