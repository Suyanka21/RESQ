import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { useRequestStore } from '@/stores/requestStore';

export default function SearchingScreen() {
  const router = useRouter();
  const serviceType = useRequestStore((s) => s.serviceType);

  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  // Skeleton shimmer
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing circles
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    createPulse(pulse1, 0).start();
    createPulse(pulse2, 600).start();
    createPulse(pulse3, 1200).start();

    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate finding a provider
    const timer = setTimeout(() => {
      router.replace('/customer/live-tracking');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const renderPulse = (anim: Animated.Value, size: number) => (
    <Animated.View
      style={[
        styles.pulse,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: Animated.subtract(1, anim),
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 2],
              }),
            },
          ],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {/* Pulsing rings */}
        <View style={styles.pulseContainer}>
          {renderPulse(pulse1, 200)}
          {renderPulse(pulse2, 200)}
          {renderPulse(pulse3, 200)}
          <View style={styles.searchIcon}>
            <Search size={32} color={colors.voltage} />
          </View>
        </View>

        <Text style={styles.title}>Searching for Provider</Text>
        <Text style={styles.subtitle}>
          Finding nearest {serviceType || 'service'} provider...
        </Text>

        {/* Skeleton Cards */}
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <Animated.View
              key={i}
              style={[styles.skeleton, { opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }) }]}
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
