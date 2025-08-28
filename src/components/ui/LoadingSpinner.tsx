import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
  type?: 'spinner' | 'dots' | 'pulse';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color,
  style,
  type = 'spinner',
}) => {
  const theme = useTheme();
  const spinnerColor = color || theme.colors.primary;

  // Spinner animation
  const rotation = useSharedValue(0);
  
  // Dots animation
  const dot1Scale = useSharedValue(1);
  const dot2Scale = useSharedValue(1);
  const dot3Scale = useSharedValue(1);
  
  // Pulse animation
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (type === 'spinner') {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1
      );
    } else if (type === 'dots') {
      const dotAnimation = (delay: number) =>
        withRepeat(
          withSequence(
            withTiming(0.5, { duration: 600 }),
            withTiming(1, { duration: 600 })
          ),
          -1
        );

      dot1Scale.value = dotAnimation(0);
      setTimeout(() => {
        dot2Scale.value = dotAnimation(200);
      }, 200);
      setTimeout(() => {
        dot3Scale.value = dotAnimation(400);
      }, 400);
    } else if (type === 'pulse') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1
      );
    }
  }, [type]);

  const spinnerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const dot1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }],
  }));

  const dot2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }],
  }));

  const dot3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dot: {
      width: size / 4,
      height: size / 4,
      borderRadius: size / 8,
      backgroundColor: spinnerColor,
      marginHorizontal: 2,
    },
  });

  if (type === 'spinner') {
    return (
      <View style={[styles.container, style]}>
        <Animated.View style={spinnerAnimatedStyle}>
          <Ionicons
            name="refresh"
            size={size}
            color={spinnerColor}
          />
        </Animated.View>
      </View>
    );
  }

  if (type === 'dots') {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, dot1AnimatedStyle]} />
          <Animated.View style={[styles.dot, dot2AnimatedStyle]} />
          <Animated.View style={[styles.dot, dot3AnimatedStyle]} />
        </View>
      </View>
    );
  }

  if (type === 'pulse') {
    return (
      <View style={[styles.container, style]}>
        <Animated.View style={pulseAnimatedStyle}>
          <Ionicons
            name="heart"
            size={size}
            color={spinnerColor}
          />
        </Animated.View>
      </View>
    );
  }

  return null;
};
