import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { TOUCH_TARGET } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';

export default function ProviderLoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  const isValid = phone.length >= 9;

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
          <View
            style={styles.iconBox}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ShieldCheck size={32} color={colors.voltage} />
          </View>
        </FadeInView>

        <FadeInView delay={200}>
          <Text style={styles.title} accessibilityRole="header">Provider Login</Text>
        </FadeInView>
        <FadeInView delay={300}>
          <Text style={styles.subtitle}>Sign in to your provider account</Text>
        </FadeInView>

        {/* Form label separated from placeholder */}
        <Text style={styles.inputLabel} accessibilityRole="text">
          Phone Number
        </Text>
        <MetalSurface variant="sunken" radius="lg" style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.prefix}>+254</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="712 345 678"
              placeholderTextColor={colors.text.disabled}
              keyboardType="phone-pad"
              maxLength={10}
              accessibilityLabel="Provider phone number, country code plus 254"
              accessibilityHint="Enter your 9 or 10 digit phone number"
            />
          </View>
        </MetalSurface>

        <AnimatedPressable
          onPress={() => {
            mediumHaptic();
            router.push('/provider/otp');
          }}
          disabled={!isValid}
          style={[styles.loginButton, !isValid && styles.loginButtonDisabled]}
          accessibilityLabel="Continue to OTP verification"
          accessibilityHint="Sends a verification code to your phone number"
          accessibilityState={{ disabled: !isValid }}
        >
          <Text style={[styles.loginText, !isValid && styles.loginTextDisabled]}>
            Continue
          </Text>
        </AnimatedPressable>

        <Text style={styles.biometricText}>
          Biometric login available after first sign-in
        </Text>
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
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.metalExtruded,
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
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    alignSelf: 'center',
    marginBottom: spacing.sm,
    maxWidth: 360,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 360,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prefix: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 2,
  },
  loginButton: {
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
  loginButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
    shadowOpacity: 0,
  },
  loginText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  loginTextDisabled: {
    color: colors.text.disabled,
  },
  biometricText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
});
