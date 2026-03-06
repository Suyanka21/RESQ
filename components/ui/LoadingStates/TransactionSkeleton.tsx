import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';
import { VoltageSpinner } from '@/components/animations';

interface TransactionSkeletonProps {
  count?: number;
}

export default function TransactionSkeleton({ count = 4 }: TransactionSkeletonProps) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container} accessibilityLabel="Loading transactions" accessibilityRole="progressbar">
      <View style={styles.spinnerContainer}>
        <VoltageSpinner size={48} message="Loading transactions..." />
      </View>
      {/* Balance card skeleton */}
      <Animated.View style={[styles.balanceCard, { opacity: pulseAnim }]}>
        <View style={styles.balanceLabel} />
        <View style={styles.balanceAmount} />
        <View style={styles.balanceButton} />
      </Animated.View>

      {/* Transaction rows */}
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.row, { opacity: pulseAnim }]}>
          <View style={styles.txIcon} />
          <View style={styles.txInfo}>
            <View style={styles.txDescLine} />
            <View style={styles.txDateLine} />
          </View>
          <View style={styles.txAmount} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  spinnerContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  balanceCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  balanceLabel: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
  },
  balanceAmount: {
    width: 160,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
    marginVertical: spacing.sm,
  },
  balanceButton: {
    width: 96,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.tertiary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.border,
    gap: spacing.md,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
  },
  txInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  txDescLine: {
    width: '60%',
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
  },
  txDateLine: {
    width: '30%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
  txAmount: {
    width: 56,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.background.tertiary,
  },
});
