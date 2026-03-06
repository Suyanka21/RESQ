/**
 * Onboarding Screen 1: Welcome + Value Proposition
 * "Emergency Help, Instantly"
 * Visual of ResQ in action with Next button
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polygon, Circle, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { lightHaptic, mediumHaptic } from '@/utils/haptics';

export default function WelcomeScreen() {
  const router = useRouter();
  const skipOnboarding = useOnboardingStore((s) => s.skipOnboarding);
  const setOnboardingStep = useOnboardingStore((s) => s.setOnboardingStep);

  const handleNext = () => {
    mediumHaptic();
    setOnboardingStep(1);
    router.push('/onboarding/how-it-works');
  };

  const handleSkip = async () => {
    lightHaptic();
    await skipOnboarding();
    router.replace('/auth/landing');
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.bgGlow} />

      {/* Skip button */}
      <AnimatedPressable
        onPress={handleSkip}
        style={styles.skipButton}
        accessibilityLabel="Skip onboarding"
        accessibilityHint="Skip the introduction and go to sign in"
      >
        <Text style={styles.skipText}>Skip</Text>
      </AnimatedPressable>

      {/* Hero illustration */}
      <FadeInView delay={100} slideDistance={20}>
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationGlow} />
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <Defs>
              <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.background.tertiary} />
                <Stop offset="50%" stopColor={colors.surface} />
                <Stop offset="100%" stopColor={colors.mapBackground} />
              </LinearGradient>
              <LinearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.voltage} stopOpacity="0.3" />
                <Stop offset="100%" stopColor={colors.voltage} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            {/* Pulse rings */}
            <Circle cx="100" cy="100" r="90" fill="none" stroke={colors.voltage} strokeOpacity="0.08" strokeWidth="1" />
            <Circle cx="100" cy="100" r="70" fill="none" stroke={colors.voltage} strokeOpacity="0.12" strokeWidth="1" />
            {/* Shield */}
            <Polygon
              points="100,30 150,55 150,115 100,145 50,115 50,55"
              fill="url(#shieldGrad)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
            {/* SOS text */}
            <Circle cx="100" cy="88" r="25" fill={colors.sos} fillOpacity="0.2" />
            {/* Location pin */}
            <Circle cx="140" cy="65" r="8" fill={colors.voltage} fillOpacity="0.6" />
            <Circle cx="140" cy="65" r="3" fill={colors.text.primary} />
            {/* Connection line */}
            <Line x1="100" y1="88" x2="140" y2="65" stroke={colors.voltage} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,4" />
          </Svg>
        </View>
      </FadeInView>

      {/* Title */}
      <FadeInView delay={200}>
        <Text style={styles.title}>Emergency Help,{'\n'}Instantly</Text>
      </FadeInView>

      {/* Subtitle */}
      <FadeInView delay={300}>
        <Text style={styles.subtitle}>
          24/7 verified roadside & medical assistance at your fingertips. One tap is all it takes.
        </Text>
      </FadeInView>

      {/* Page indicator */}
      <FadeInView delay={350}>
        <View style={styles.pageIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </FadeInView>

      {/* Next button */}
      <FadeInView delay={400} style={styles.bottomSection}>
        <AnimatedPressable
          onPress={handleNext}
          style={styles.nextButton}
          accessibilityLabel="Next"
          accessibilityHint="Continue to learn how ResQ works"
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </AnimatedPressable>
      </FadeInView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  bgGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.voltage,
    opacity: 0.04,
    top: '15%',
  },
  skipButton: {
    position: 'absolute',
    top: 56,
    right: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  skipText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  illustrationGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.voltage,
    opacity: 0.06,
  },
  title: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  pageIndicator: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.tertiary,
  },
  dotActive: {
    backgroundColor: colors.voltage,
    width: 24,
    ...shadows.glow,
  },
  bottomSection: {
    width: '100%',
    marginTop: 'auto',
  },
  nextButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  nextButtonText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
