import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import { TOUCH_TARGET, announceForAccessibility } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic, successHaptic } from '@/utils/haptics';

const OTP_LENGTH = 6;

export default function ProviderOTPScreen() {
  const router = useRouter();
  const { setIsProvider, login } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    announceForAccessibility('Enter the 6-digit verification code sent to your phone');
  }, []);

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
    // Guard: only auto-submit when all 6 digits are filled
    if (newOtp.every((d) => d !== '') && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (digits?: string[]) => {
    const code = (digits || otp).join('');
    if (code.length !== OTP_LENGTH) return;
    setIsProvider(true);
    login({ id: 'p1', name: 'James Mwangi', phone: '712345678' });
    router.replace('/provider/dashboard');
  };

  const isComplete = otp.every((d) => d !== '');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to previous screen"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </AnimatedPressable>
      </View>

      <View style={styles.content}>
        <FadeInView delay={100}>
          <Text style={styles.title} accessibilityRole="header">Verify Code</Text>
        </FadeInView>
        <FadeInView delay={200}>
          <Text style={styles.subtitle}>Enter the 6-digit verification code</Text>
        </FadeInView>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <View key={index} style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}>
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                accessibilityLabel={`OTP digit ${index + 1} of ${OTP_LENGTH}`}
                accessibilityHint={`Enter digit ${index + 1} of the verification code`}
              />
            </View>
          ))}
        </View>

        <AnimatedPressable
          onPress={() => {
            successHaptic();
            handleVerify();
          }}
          disabled={!isComplete}
          style={[styles.verifyButton, !isComplete && styles.verifyButtonDisabled]}
          accessibilityLabel="Verify code"
          accessibilityHint="Verifies the entered code and signs you in"
          accessibilityState={{ disabled: !isComplete }}
        >
          <Text style={[styles.verifyText, !isComplete && styles.verifyTextDisabled]}>
            Verify
          </Text>
        </AnimatedPressable>

        <AnimatedPressable
          disabled={countdown > 0}
          onPress={() => {
            mediumHaptic();
            setCountdown(30);
          }}
          accessibilityLabel={countdown > 0 ? `Resend code available in ${countdown} seconds` : 'Resend verification code'}
          accessibilityState={{ disabled: countdown > 0 }}
        >
          <Text style={styles.resendText}>
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
          </Text>
        </AnimatedPressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, alignItems: 'center' },
  title: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text.primary, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.fontSize.sm, color: colors.text.secondary, marginBottom: spacing.xl, textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  otpBox: {
    width: 48, height: 56, borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1, borderColor: colors.background.border,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.metalSunken,
  },
  otpBoxFilled: { borderColor: colors.voltage, shadowColor: colors.voltage, shadowOpacity: 0.3, shadowRadius: 8 },
  otpInput: { color: colors.text.primary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, textAlign: 'center', width: '100%', height: '100%' },
  verifyButton: {
    width: '100%', maxWidth: 360, height: 56,
    backgroundColor: colors.voltage, borderRadius: borderRadius.lg,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
    ...shadows.glow,
  },
  verifyButtonDisabled: { backgroundColor: colors.interactive.disabled, shadowOpacity: 0 },
  verifyText: { color: colors.text.onBrand, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
  verifyTextDisabled: { color: colors.text.disabled },
  resendButton: { minHeight: TOUCH_TARGET.MIN, justifyContent: 'center', alignItems: 'center' },
  resendText: { color: colors.text.secondary, fontSize: typography.fontSize.sm },
});
