import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { useRequestStore } from '@/stores/requestStore';
import { useReducedMotion, announceForAccessibility } from '@/utils/accessibility';

export default function SearchingScreen() {
  const router = useRouter();
  const serviceType = useRequestStore((s) => s.serviceType);
  const prefersReducedMotion = useReducedMotion();

  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);
  const pulse3 = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    // Announce to screen readers
    announceForAccessibility(`Searching for ${serviceType || 'service'} provider nearby`);

    // Respect prefers-reduced-motion
    if (!prefersReducedMotion) {
      // Pulsing circles with staggered delays
      const createPulseAnim = (delay: number) =>
        withRepeat(
          withDelay(
            delay,
            withSequence(
              withTiming(1, { duration: 2000, easing: Easing.linear }),
              withTiming(0, { duration: 0 })
            )
          ),
          -1,
          false
        );

      pulse1.value = createPulseAnim(0);
      pulse2.value = createPulseAnim(600);
      pulse3.value = createPulseAnim(1200);

      // Shimmer animation
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    // Simulate finding a provider
    const timer = setTimeout(() => {
      router.replace('/customer/live-tracking');
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  const pulseStyle1 = useAnimatedStyle(() => ({
    opacity: 1 - pulse1.value,
    transform: [{ scale: interpolate(pulse1.value, [0, 1], [0.5, 2]) }],
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    opacity: 1 - pulse2.value,
    transform: [{ scale: interpolate(pulse2.value, [0, 1], [0.5, 2]) }],
  }));

  const pulseStyle3 = useAnimatedStyle(() => ({
    opacity: 1 - pulse3.value,
    transform: [{ scale: interpolate(pulse3.value, [0, 1], [0.5, 2]) }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.6]),
  }));

  return (
    <View style={styles.container} accessibilityRole="none">
      <View style={styles.center}>
        {/* Pulsing rings - hidden from screen reader, status conveyed via text */}
        <View style={styles.pulseContainer} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Animated.View style={[styles.pulse, styles.pulseSize, pulseStyle1]} />
          <Animated.View style={[styles.pulse, styles.pulseSize, pulseStyle2]} />
          <Animated.View style={[styles.pulse, styles.pulseSize, pulseStyle3]} />
          <View style={styles.searchIcon}>
            <Search size={32} color={colors.voltage} />
          </View>
        </View>

        <Text style={styles.title} accessibilityRole="header">Searching for Provider</Text>
        <Text style={styles.subtitle} accessibilityLiveRegion="polite">
          Finding nearest {serviceType || 'service'} provider...
        </Text>

        {/* Skeleton Cards */}
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <Animated.View
              key={i}
              style={[styles.skeleton, shimmerStyle]}
            >
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonLines}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { width: '60%' }]} />
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pulseContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  pulse: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.voltage,
  },
  pulseSize: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  searchIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xxl,
  },
  skeletonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  skeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
  },
  skeletonLines: {
    flex: 1,
    gap: spacing.sm,
  },
  skeletonLine: {
    height: 10,
    backgroundColor: colors.background.tertiary,
    borderRadius: 5,
    width: '80%',
  },
});
