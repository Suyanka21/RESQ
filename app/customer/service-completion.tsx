import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

export default function ServiceCompletionScreen() {
  const router = useRouter();
  const scaleValue = useSharedValue(0);
  const fadeValue = useSharedValue(0);

  useEffect(() => {
    // Spring scale animation followed by fade
    scaleValue.value = withSpring(1, { damping: 4, stiffness: 80 });
    fadeValue.value = withDelay(
      600, // delay to let spring finish
      withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
    );
  }, []);

  const scaleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const fadeAnimStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Checkmark Animation */}
        <Animated.View style={[styles.checkContainer, scaleAnimStyle]}>
          <View style={styles.checkGlow} />
          <CheckCircle size={72} color={colors.status.success} />
        </Animated.View>

        <Animated.View style={[styles.textBlock, fadeAnimStyle]}>
          <Text style={styles.title}>Service Complete!</Text>
          <Text style={styles.subtitle}>Your vehicle has been serviced successfully</Text>

          {/* Summary */}
          <MetalSurface variant="glass" radius="xl" style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service</Text>
              <Text style={styles.summaryValue}>Towing</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Provider</Text>
              <Text style={styles.summaryValue}>James Mwangi</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration</Text>
              <Text style={styles.summaryValue}>45 min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryAmount}>KES 5,000</Text>
            </View>
          </MetalSurface>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => router.push('/customer/payment')}
          style={styles.payButton}
          accessibilityLabel="Proceed to payment"
          accessibilityRole="button"
        >
          <Text style={styles.payText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  checkContainer: {
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,230,118,0.1)',
  },
  textBlock: {
    alignItems: 'center',
    width: '100%',
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
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    padding: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  summaryAmount: {
    color: colors.voltage,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extrabold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background.border,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  payButton: {
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  payText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
