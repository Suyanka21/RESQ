import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';

interface ProviderCardSkeletonProps {
  count?: number;
}

export default function ProviderCardSkeleton({ count = 3 }: ProviderCardSkeletonProps) {
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
    <View style={styles.container} accessibilityLabel="Loading providers" accessibilityRole="progressbar">
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.avatar} />
          <View style={styles.info}>
            <View style={styles.nameLine} />
            <View style={styles.detailLine} />
            <View style={styles.ratingLine} />
          </View>
          <View style={styles.etaBox} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
  },
  info: {
    flex: 1,
    gap: spacing.sm,
  },
  nameLine: {
    width: '70%',
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
  },
  detailLine: {
    width: '50%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
  ratingLine: {
    width: '30%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
  etaBox: {
    width: 48,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.tertiary,
  },
});
