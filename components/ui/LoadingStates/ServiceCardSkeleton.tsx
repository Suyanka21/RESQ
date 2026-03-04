import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';

interface ServiceCardSkeletonProps {
  count?: number;
}

export default function ServiceCardSkeleton({ count = 6 }: ServiceCardSkeletonProps) {
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
    <View style={styles.grid} accessibilityLabel="Loading services" accessibilityRole="progressbar">
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View key={i} style={[styles.card, { opacity: pulseAnim }]}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.labelPlaceholder} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
  },
  labelPlaceholder: {
    width: 48,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
});
