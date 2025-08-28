import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';

export const CollectionsScreen: React.FC = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: theme.colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Экран коллекций</Text>
    </SafeAreaView>
  );
};
