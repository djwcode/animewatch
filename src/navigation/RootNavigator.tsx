import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ReleaseDetailScreen } from '../screens/release/ReleaseDetailScreen';
import VideoPlayerScreen from '../screens/video/VideoPlayerScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ReleaseDetail: { releaseId: number; alias?: string };
  VideoPlayer: { episodeId: string; releaseId: number; release?: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="ReleaseDetail" 
              component={ReleaseDetailScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="VideoPlayer" 
              component={VideoPlayerScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
