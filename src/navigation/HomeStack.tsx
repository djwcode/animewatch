import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/search/SearchScreen';

export type HomeStackParamList = {
  Home: undefined;
  Search: { query?: string };
};

// Расширенный тип для навигации к корневым экранам
export type HomeStackNavigation = {
  navigate: (screen: 'ReleaseDetail' | 'VideoPlayer', params: any) => void;
  goBack: () => void;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};
