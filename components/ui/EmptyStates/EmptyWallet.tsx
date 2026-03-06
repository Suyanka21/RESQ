import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import EmptyWalletIllustration from '@/components/illustrations/EmptyWalletIllustration';

interface EmptyWalletProps {
  onAddPayment?: () => void;
}

export default function EmptyWallet({ onAddPayment }: EmptyWalletProps) {
  return (
    <View style={styles.container} accessibilityLabel="Empty wallet">
      <FadeInView delay={100}>
        <EmptyWalletIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Transactions</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>
          Add M-Pesa to start saving. Your transaction history will appear here.
        </Text>
      </FadeInView>
      {onAddPayment && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onAddPayment();
            }}
            style={styles.ctaButton}
            accessibilityLabel="Add M-Pesa payment method"
          >
            <Text style={styles.ctaText}>Add M-Pesa</Text>
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
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 260,
  },
  ctaButton: {
    backgroundColor: colors.voltage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.glow,
  },
  ctaText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
