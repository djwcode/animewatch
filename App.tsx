import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useSettingsStore } from './src/stores';

export default function App() {
  const colorScheme = useColorScheme();
  const loadSettings = useSettingsStore(state => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <>
      <StatusBar 
        style={colorScheme === 'dark' ? 'light' : 'dark'} 
        backgroundColor="transparent"
        translucent={true}
      />
      <RootNavigator />
    </>
  );
}
