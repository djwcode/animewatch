import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogScreen } from '../screens/catalog/CatalogScreen';
import { CatalogFiltersScreen } from '../screens/catalog/CatalogFiltersScreen';
import { SearchScreen } from '../screens/search/SearchScreen';

export type CatalogStackParamList = {
  Catalog: { 
    category?: 'latest' | 'popular' | 'random';
    filters?: any;
  } | undefined;
  CatalogFilters: undefined;
  Search: { query?: string };
};

// Расширенный тип для навигации к корневым экранам
export type CatalogStackNavigation = {
  navigate: (screen: 'ReleaseDetail' | 'VideoPlayer', params: any) => void;
  goBack: () => void;
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export const CatalogStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Catalog" component={CatalogScreen} />
      <Stack.Screen name="CatalogFilters" component={CatalogFiltersScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};
