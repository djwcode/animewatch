import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../../hooks';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animationType?: 'scale' | 'fade' | 'bounce' | 'none';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  animationType = 'scale',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const isDisabled = disabled || loading;

  const handlePressIn = () => {
    if (isDisabled || animationType === 'none') return;
    
    switch (animationType) {
      case 'scale':
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        break;
      case 'fade':
        opacity.value = withTiming(0.7, { duration: 100 });
        break;
      case 'bounce':
        scale.value = withSpring(0.9, { damping: 10, stiffness: 400 });
        break;
    }
  };

  const handlePressOut = () => {
    if (isDisabled || animationType === 'none') return;
    
    switch (animationType) {
      case 'scale':
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        break;
      case 'fade':
        opacity.value = withTiming(1, { duration: 100 });
        break;
      case 'bounce':
        scale.value = withSpring(1, { damping: 8, stiffness: 300 });
        break;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    switch (variant) {
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'filled':
      default:
        baseStyle.backgroundColor = theme.colors.primary;
    }

    if (isDisabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          minHeight: 56,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          minHeight: 48,
        };
    }
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      case 'medium':
      default:
        baseStyle.fontSize = 16;
    }

    switch (variant) {
      case 'outline':
      case 'text':
        baseStyle.color = theme.colors.primary;
        break;
      case 'filled':
      default:
        baseStyle.color = theme.colors.background;
    }

    return baseStyle;
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'medium':
      default:
        return 20;
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'outline':
      case 'text':
        return theme.colors.primary;
      case 'filled':
      default:
        return theme.colors.background;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[getButtonStyle(), getSizeStyle(), style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getIconColor()}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      
      {leftIcon && !loading && (
        <Ionicons
          name={leftIcon}
          size={getIconSize()}
          color={getIconColor()}
          style={{ marginRight: theme.spacing.sm }}
        />
      )}
      
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
      
      {rightIcon && !loading && (
        <Ionicons
          name={rightIcon}
          size={getIconSize()}
          color={getIconColor()}
          style={{ marginLeft: theme.spacing.sm }}
        />
      )}
    </AnimatedTouchableOpacity>
  );
};
