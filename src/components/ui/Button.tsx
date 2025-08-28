import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = theme.spacing.md;
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.surface;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.border;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'filled':
        baseStyle.backgroundColor = theme.colors.primary;
        break;
      default:
        baseStyle.backgroundColor = theme.colors.primary;
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default:
        baseStyle.fontSize = 16;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.color = theme.colors.text;
        break;
      case 'outline':
        baseStyle.color = theme.colors.primary;
        break;
      case 'text':
        baseStyle.color = theme.colors.primary;
        break;
      case 'filled':
        baseStyle.color = '#FFFFFF';
        break;
      default:
        baseStyle.color = '#FFFFFF';
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
      case 'secondary':
        return theme.colors.text;
      case 'outline':
      case 'text':
        return theme.colors.primary;
      case 'filled':
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
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
    </TouchableOpacity>
  );
};
