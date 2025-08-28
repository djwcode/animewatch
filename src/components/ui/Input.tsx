import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const containerStyle: ViewStyle = {
    marginBottom: theme.spacing.md,
  };

  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? theme.colors.surface : theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    minHeight: multiline ? 80 : 48,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  };

  const errorStyle: TextStyle = {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  };

  const iconStyle = {
    marginHorizontal: theme.spacing.xs,
  };

  const handleRightIconPress = () => {
    if (secureTextEntry && !onRightIconPress) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIcon = () => {
    if (secureTextEntry && !rightIcon) {
      return isPasswordVisible ? 'eye-off' : 'eye';
    }
    return rightIcon;
  };

  return (
    <View style={[containerStyle, style]}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={theme.colors.textSecondary}
            style={iconStyle}
          />
        )}
        <TextInput
          style={[textInputStyle, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {(getRightIcon() || secureTextEntry) && (
          <TouchableOpacity onPress={handleRightIconPress} style={iconStyle}>
            <Ionicons
              name={getRightIcon() as any}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};
