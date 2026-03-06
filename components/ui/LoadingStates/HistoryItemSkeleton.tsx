import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';
import { VoltageSpinner } from '@/components/animations';

interface HistoryItemSkeletonProps {
  count?: number;
}

export default function HistoryItemSkeleton({ count = 4 }: HistoryItemSkeletonProps) {
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
    <View style={styles.container} accessibilityLabel="Loading history" accessibilityRole="progressbar">
      <View style={styles.spinnerContainer}>
        <VoltageSpinner size={48} message="Loading history..." />
      </View>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.card, { opacity: pulseAnim }]}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <View style={styles.serviceTag} />
            <View style={styles.pricePlaceholder} />
          </View>
          {/* Body lines */}
          <View style={styles.body}>
            <View style={styles.infoRow}>
              <View style={styles.iconDot} />
              <View style={styles.locationLine} />
            </View>
            <View style={styles.infoRow}>
              <View style={styles.iconDot} />
              <View style={styles.dateLine} />
            </View>
          </View>
          {/* Status row */}
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <View style={styles.statusLine} />
          </View>
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
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceTag: {
    width: 72,
    height: 24,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
  },
  pricePlaceholder: {
    width: 80,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.background.tertiary,
  },
  body: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.background.tertiary,
  },
  locationLine: {
    width: '60%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
  dateLine: {
    width: '40%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  statusLine: {
    width: 64,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
});
