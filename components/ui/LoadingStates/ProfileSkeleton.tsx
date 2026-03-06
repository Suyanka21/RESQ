import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';
import { VoltageSpinner } from '@/components/animations';

export default function ProfileSkeleton() {
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
    <Animated.View
      style={[styles.container, { opacity: pulseAnim }]}
      accessibilityLabel="Loading profile"
      accessibilityRole="progressbar"
    >
      {/* Spinner */}
      <View style={styles.spinnerContainer}>
        <VoltageSpinner size={48} message="Loading profile..." />
      </View>
      {/* Avatar */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.nameLine} />
        <View style={styles.phoneLine} />
      </View>

      {/* Menu items */}
      <View style={styles.menu}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.menuItem}>
            <View style={styles.menuIcon} />
            <View style={styles.menuLabel} />
            <View style={styles.menuChevron} />
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingBottom: spacing.xxl,
  },
  spinnerContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.background.border,
  },
  nameLine: {
    width: 120,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background.tertiary,
    marginBottom: spacing.sm,
  },
  phoneLine: {
    width: 100,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
  },
  menu: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
  },
  menuLabel: {
    flex: 1,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.background.tertiary,
  },
  menuChevron: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background.tertiary,
  },
});
