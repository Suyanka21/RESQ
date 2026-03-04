import React, { useState } from 'react';
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
import { ArrowLeft, Phone } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

export default function PhoneEntryScreen() {
  const router = useRouter();
  const { authMode, setPhone, setAuthMode } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');

  const isValid = phoneNumber.length >= 9;
  const isSignUp = authMode === 'signup';

  const handleContinue = () => {
    setPhone(phoneNumber);
    router.push('/auth/otp');
  };

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
        <View style={styles.iconContainer}>
          <Phone size={32} color={colors.voltage} />
        </View>

        <Text style={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          Enter your phone number to {isSignUp ? 'get started' : 'sign in'}
        </Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>+254</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="712 345 678"
            placeholderTextColor={colors.text.disabled}
            keyboardType="phone-pad"
            maxLength={10}
            accessibilityLabel="Phone number input"
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!isValid}
          style={[styles.continueButton, !isValid && styles.continueButtonDisabled]}
          accessibilityLabel="Continue"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isValid }}
        >
          <Text
            style={[
              styles.continueText,
              !isValid && styles.continueTextDisabled,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>

        {/* Switch Mode */}
        <TouchableOpacity
          onPress={() => setAuthMode(isSignUp ? 'signin' : 'signup')}
          accessibilityLabel={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
          accessibilityRole="button"
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
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
  iconContainer: {
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
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.metalSunken,
  },
  prefix: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.background.border,
  },
  prefixText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 2,
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
    shadowOpacity: 0,
  },
  continueText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  continueTextDisabled: {
    color: colors.text.disabled,
  },
  switchText: {
    color: colors.voltage,
    fontSize: typography.fontSize.sm,
  },
});
