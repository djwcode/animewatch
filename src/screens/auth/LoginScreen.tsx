import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as Device from 'expo-device';

export const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { login, requestOtp, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    form: {
      marginBottom: theme.spacing.lg,
    },
    button: {
      marginBottom: theme.spacing.md,
    },
    switchButton: {
      marginTop: theme.spacing.lg,
    },
    error: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontSize: 14,
    },
  });

  const generateDeviceId = () => {
    return `${Device.deviceName}-${Device.osName}-${Date.now()}`;
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    clearError();
    
    try {
      await login({ login: email, password });
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleOtpRequest = async () => {
    clearError();
    
    try {
      const deviceId = generateDeviceId();
      const response = await requestOtp({ device_id: deviceId });
      
      Alert.alert(
        'OTP отправлен',
        `Ваш код: ${response.otp.code}\nВремя действия: ${response.remaining_time} секунд`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Here you would navigate to OTP screen
              // navigation.navigate('Otp', { deviceId });
            },
          },
        ]
      );
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>AniViewer</Text>
          <Text style={styles.subtitle}>
            {isOtpMode ? 'Войти с помощью OTP' : 'Добро пожаловать в мир аниме'}
          </Text>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.form}>
            {!isOtpMode ? (
              <>
                <Input
                  label="Email или логин"
                  placeholder="Введите email или логин"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="person"
                />
                <Input
                  label="Пароль"
                  placeholder="Введите пароль"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon="lock-closed"
                />
                <Button
                  title="Войти"
                  onPress={handleLogin}
                  loading={isLoading}
                  style={styles.button}
                />
              </>
            ) : (
              <Button
                title="Получить OTP"
                onPress={handleOtpRequest}
                loading={isLoading}
                style={styles.button}
              />
            )}
          </View>

          <Button
            title={isOtpMode ? 'Войти по паролю' : 'Войти через OTP'}
            onPress={() => setIsOtpMode(!isOtpMode)}
            variant="text"
            style={styles.switchButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
