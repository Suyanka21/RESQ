/**
 * Onboarding Screen 2: How It Works
 * 3-step visual guide: Select Service -> Get Matched -> Help Arrives
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Navigation, UserCheck, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import MetalSurface from '@/components/MetalSurface';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { lightHaptic, mediumHaptic } from '@/utils/haptics';

interface StepItemProps {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function StepItem({ step, title, description, icon, delay }: StepItemProps) {
  return (
    <FadeInView delay={delay}>
      <View style={stepStyles.container}>
        <View style={stepStyles.iconContainer}>
          <MetalSurface variant="extruded" radius="xl" style={stepStyles.iconBox}>
            {icon}
          </MetalSurface>
          {step < 3 && <View style={stepStyles.connector} />}
        </View>
        <View style={stepStyles.textContainer}>
          <Text style={stepStyles.stepLabel}>STEP {step}</Text>
          <Text style={stepStyles.title}>{title}</Text>
          <Text style={stepStyles.description}>{description}</Text>
        </View>
      </View>
    </FadeInView>
  );
}

const stepStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconBox: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    width: 2,
    height: 32,
    backgroundColor: colors.voltage,
    opacity: 0.3,
    marginTop: spacing.xs,
  },
  textContainer: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.voltage,
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});

export default function HowItWorksScreen() {
  const router = useRouter();
  const skipOnboarding = useOnboardingStore((s) => s.skipOnboarding);
  const setOnboardingStep = useOnboardingStore((s) => s.setOnboardingStep);

  const handleNext = () => {
    mediumHaptic();
    setOnboardingStep(2);
    router.push('/onboarding/permissions');
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

      {/* Title */}
      <FadeInView delay={100}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>Three simple steps to safety</Text>
      </FadeInView>

      {/* Steps */}
      <View style={styles.stepsContainer}>
        <StepItem
          step={1}
          title="Select Service"
          description="Choose what you need - towing, fuel, battery, tire, medical, or diagnostics."
          icon={<Navigation size={24} color={colors.voltage} />}
          delay={200}
        />
        <StepItem
          step={2}
          title="Get Matched"
          description="We instantly connect you with the nearest verified provider. See their ETA in real-time."
          icon={<UserCheck size={24} color={colors.safety} />}
          delay={300}
        />
        <StepItem
          step={3}
          title="Help Arrives"
          description="Track your provider on the map. Pay securely via M-Pesa. Rate the service."
          icon={<MapPin size={24} color={colors.status.info} />}
          delay={400}
        />
      </View>

      {/* Page indicator */}
      <FadeInView delay={450}>
        <View style={styles.pageIndicator}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
      </FadeInView>

      {/* Next button */}
      <FadeInView delay={500} style={styles.bottomSection}>
        <AnimatedPressable
          onPress={handleNext}
          style={styles.nextButton}
          accessibilityLabel="Next"
          accessibilityHint="Continue to permissions setup"
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
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  bgGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.safety,
    opacity: 0.03,
    top: '30%',
    left: -100,
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
  sectionTitle: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
  },
  stepsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
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
