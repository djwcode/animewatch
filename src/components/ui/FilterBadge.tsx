import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';

interface FilterBadgeProps {
  count: number;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({ count }) => {
  const theme = useTheme();

  if (count === 0) return null;

  const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      top: -5,
      right: -5,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
    },
    text: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

