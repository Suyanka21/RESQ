import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useAuthStore } from '@/stores/authStore';
import MetalSurface from '@/components/MetalSurface';
import { TOUCH_TARGET } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { heavyHaptic, lightHaptic } from '@/utils/haptics';

export default function LandingScreen() {
  const router = useRouter();
  const setAuthMode = useAuthStore((s) => s.setAuthMode);

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.bgGlow} />

      <View style={styles.content}>
        {/* Hero */}
        <FadeInView delay={100} slideDistance={20}>
          <MetalSurface variant="extruded" radius="xl" style={styles.iconBox}>
            <ShieldAlert size={48} color={colors.voltage} />
          </MetalSurface>
        </FadeInView>

        <FadeInView delay={200}>
          <Text style={styles.title}>Help Is On The Way</Text>
        </FadeInView>
        <FadeInView delay={300}>
          <Text style={styles.subtitle}>
            24/7 Emergency Roadside & Medical Assistance
          </Text>
        </FadeInView>

        {/* Actions */}
        <FadeInView delay={400} style={styles.actions}>
          <AnimatedPressable
            onPress={() => {
              heavyHaptic();
              setAuthMode('signup');
              router.push('/auth/phone');
            }}
            style={styles.primaryButton}
            accessibilityLabel="Get Started"
            accessibilityHint="Create a new ResQ account"
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => {
              setAuthMode('signin');
              router.push('/auth/phone');
            }}
            style={styles.signInButton}
            accessibilityLabel="Sign In"
            accessibilityHint="Sign in to your existing account"
          >
            <Text style={styles.signInText}>
              Already have an account? Sign In
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => {
              lightHaptic();
              router.push('/provider/login');
            }}
            style={styles.partnerButton}
            accessibilityLabel="Partner Login"
            accessibilityHint="Sign in as a service provider"
          >
            <Text style={styles.providerText}>Partner Login</Text>
          </AnimatedPressable>
        </FadeInView>
      </View>

      <Text style={styles.legal}>
        By continuing, you agree to Terms & Privacy
      </Text>
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
    opacity: 0.05,
    top: '20%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 360,
  },
  iconBox: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.lg,
  },
  primaryButton: {
    width: '100%',
    height: 80,
    backgroundColor: colors.base,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    ...shadows.metalExtruded,
  },
  primaryButtonText: {
    color: colors.voltage,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  signInButton: {
    minHeight: TOUCH_TARGET.MIN,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  signInText: {
    color: colors.voltage,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  partnerButton: {
    minHeight: TOUCH_TARGET.MIN,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  providerText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  legal: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
  },
});
