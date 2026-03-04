import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const { phone, login } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === OTP_LENGTH) {
      handleVerify();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    login({
      id: '1',
      name: 'John Doe',
      phone: phone,
    });
    router.replace('/(tabs)');
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to +254 {phone}
        </Text>

        {/* OTP Input */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
              ]}
            >
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={1}
                accessibilityLabel={`OTP digit ${index + 1}`}
              />
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={!isComplete}
          style={[styles.verifyButton, !isComplete && styles.verifyButtonDisabled]}
          accessibilityLabel="Verify OTP"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.verifyText,
              !isComplete && styles.verifyTextDisabled,
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity
          disabled={countdown > 0}
          onPress={() => setCountdown(30)}
          accessibilityLabel={countdown > 0 ? `Resend code in ${countdown} seconds` : 'Resend code'}
          accessibilityRole="button"
        >
          <Text style={styles.resendText}>
            {countdown > 0
              ? `Resend code in ${countdown}s`
              : 'Resend Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.metalSunken,
  },
  otpBoxFilled: {
    borderColor: colors.voltage,
    shadowColor: colors.voltage,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  otpInput: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  verifyButton: {
    width: '100%',
    maxWidth: 360,
    height: 56,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.glow,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
    shadowOpacity: 0,
  },
  verifyText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  verifyTextDisabled: {
    color: colors.text.disabled,
  },
  resendText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
});
