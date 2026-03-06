import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import EmptyWalletIllustration from '@/components/illustrations/EmptyWalletIllustration';

interface NoTransactionsProps {
  onRequestService?: () => void;
}

export default function NoTransactions({ onRequestService }: NoTransactionsProps) {
  return (
    <View style={styles.container} accessibilityLabel="No transactions yet">
      <FadeInView delay={100}>
        <EmptyWalletIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Transactions</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>
          Complete your first service to see transaction history here.
        </Text>
      </FadeInView>
      {onRequestService && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onRequestService();
            }}
            style={styles.ctaButton}
            accessibilityLabel="Request a service"
          >
            <Text style={styles.ctaText}>Request Service</Text>
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
