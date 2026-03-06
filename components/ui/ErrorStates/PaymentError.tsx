import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Phone } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import ErrorIllustration from '@/components/illustrations/ErrorIllustration';

interface PaymentErrorProps {
  errorType?: 'timeout' | 'insufficient' | 'cancelled' | 'generic';
  message?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

const ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  timeout: {
    title: 'Payment Timed Out',
    message: 'The M-Pesa payment request timed out. Please check your phone for the STK push and try again.',
  },
  insufficient: {
    title: 'Insufficient Funds',
    message: 'Your M-Pesa balance is insufficient for this transaction. Please top up and try again.',
  },
  cancelled: {
    title: 'Payment Cancelled',
    message: 'The M-Pesa payment was cancelled. You can retry or choose a different payment method.',
  },
  generic: {
    title: 'Payment Failed',
    message: 'Something went wrong with the payment. Please try again or contact support.',
  },
};

export default function PaymentError({
  errorType = 'generic',
  message,
  onRetry,
  onContactSupport,
}: PaymentErrorProps) {
  const errorInfo = ERROR_MESSAGES[errorType] || ERROR_MESSAGES.generic;
  const displayMessage = message || errorInfo.message;

  return (
    <View style={styles.container} accessibilityRole="alert">
      <FadeInView delay={100}>
        <ErrorIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>{errorInfo.title}</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>{displayMessage}</Text>
      </FadeInView>

      {onRetry && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onRetry();
            }}
            style={styles.retryButton}
            accessibilityLabel="Retry payment"
          >
            <Text style={styles.retryText}>Retry Payment</Text>
          </AnimatedPressable>
        </FadeInView>
      )}

      {onContactSupport && (
        <FadeInView delay={500}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onContactSupport();
            }}
            style={styles.supportButton}
            accessibilityLabel="Contact support"
          >
            <Phone size={16} color={colors.sos} />
            <Text style={styles.supportText}>Contact Support</Text>
          </AnimatedPressable>
        </FadeInView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: colors.voltage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  retryText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.status.error,
    ...shadows.emergencyGlow,
  },
  supportText: {
    color: colors.sos,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
});
