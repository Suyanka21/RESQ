import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface EmptyWalletProps {
  onAddPayment?: () => void;
}

export default function EmptyWallet({ onAddPayment }: EmptyWalletProps) {
  return (
    <View style={styles.container} accessibilityLabel="Empty wallet">
      <View style={styles.iconContainer}>
        <CreditCard size={48} color={colors.service.towing} />
      </View>
      <Text style={styles.title}>No Transactions</Text>
      <Text style={styles.message}>
        Add M-Pesa to start saving. Your transaction history will appear here.
      </Text>
      {onAddPayment && (
        <TouchableOpacity
          onPress={onAddPayment}
          style={styles.ctaButton}
          accessibilityLabel="Add M-Pesa payment method"
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Add M-Pesa</Text>
        </TouchableOpacity>
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
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
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
