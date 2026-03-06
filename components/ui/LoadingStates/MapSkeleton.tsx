import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';
import { VoltageSpinner } from '@/components/animations';

export default function MapSkeleton() {
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
    <View style={styles.container} accessibilityLabel="Loading map" accessibilityRole="progressbar">
      {/* Map area */}
      <Animated.View style={[styles.mapArea, { opacity: pulseAnim }]}>
        {/* Grid lines to simulate map */}
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineVertical]} />
        <View style={[styles.gridLine, { top: '60%' }]} />
        <View style={[styles.gridLine, styles.gridLineVertical, { left: '70%' }]} />

        {/* Center pin placeholder */}
        <View style={styles.pinContainer}>
          <VoltageSpinner size={40} />
        </View>
      </Animated.View>

      {/* ETA banner skeleton */}
      <Animated.View style={[styles.etaBanner, { opacity: pulseAnim }]}>
        <View style={styles.etaLabel} />
        <View style={styles.etaValue} />
      </Animated.View>

      {/* Bottom panel skeleton */}
      <Animated.View style={[styles.bottomPanel, { opacity: pulseAnim }]}>
        <View style={styles.handle} />
        <View style={styles.statusLine} />
        <View style={styles.providerCard}>
          <View style={styles.providerAvatar} />
          <View style={styles.providerInfo}>
            <View style={styles.providerName} />
            <View style={styles.providerDetail} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
  mapArea: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.background.border,
  },
  gridLineVertical: {
    top: 0,
    bottom: 0,
    left: '40%',
    right: undefined,
    width: 1,
    height: '100%',
  },
  pinContainer: {
    position: 'absolute',
    top: '45%',
    left: '48%',
    alignItems: 'center',
  },
  pin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
    borderWidth: 3,
    borderColor: colors.background.border,
  },
  pinShadow: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.background.border,
    marginTop: spacing.xs,
  },
  etaBanner: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: colors.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  etaLabel: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  etaValue: {
    width: 56,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.tertiary,
  },
  bottomPanel: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.background.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  statusLine: {
    width: 180,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
  },
  providerInfo: {
    flex: 1,
    gap: spacing.sm,
  },
  providerName: {
    width: '60%',
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.background.tertiary,
  },
  providerDetail: {
    width: '40%',
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background.tertiary,
  },
});
