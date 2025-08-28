import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../hooks';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface OtpScreenProps {
  route: {
    params: {
      deviceId: string;
    };
  };
}

export const OtpScreen: React.FC<OtpScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { loginWithOtp, isLoading, error, clearError } = useAuthStore();
  const [otpCode, setOtpCode] = useState('');
  const { deviceId } = route.params;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
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
    error: {
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      fontSize: 14,
    },
  });

  const handleOtpLogin = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Ошибка', 'Введите корректный 6-значный код');
      return;
    }

    clearError();

    try {
      await loginWithOtp({
        code: parseInt(otpCode, 10),
        device_id: deviceId,
      });
    } catch (error) {
      // Error is handled in the store
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Введите код OTP</Text>
      <Text style={styles.subtitle}>
        Мы отправили вам 6-значный код для входа
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.form}>
        <Input
          label="Код OTP"
          placeholder="Введите 6-значный код"
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="numeric"
          maxLength={6}
        />
        <Button
          title="Войти"
          onPress={handleOtpLogin}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};
