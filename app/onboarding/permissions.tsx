/**
 * Onboarding Screen 3: Permissions
 * Location + Notification permission explanations
 * "Get Started" button to complete onboarding
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, Shield } from 'lucide-react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import MetalSurface from '@/components/MetalSurface';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { lightHaptic, mediumHaptic, successHaptic } from '@/utils/haptics';

interface PermissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  granted: boolean;
  onRequest: () => void;
  delay: number;
}

function PermissionCard({ icon, title, description, granted, onRequest, delay }: PermissionCardProps) {
  return (
    <FadeInView delay={delay}>
      <MetalSurface variant={granted ? 'sunken' : 'extruded'} radius="lg" style={permStyles.card}>
        <View style={permStyles.iconContainer}>
          {icon}
        </View>
        <View style={permStyles.textContainer}>
          <Text style={permStyles.title}>{title}</Text>
          <Text style={permStyles.description}>{description}</Text>
        </View>
        {granted ? (
          <View style={permStyles.grantedBadge}>
            <Text style={permStyles.grantedText}>ON</Text>
          </View>
        ) : (
          <AnimatedPressable
            onPress={onRequest}
            style={permStyles.enableButton}
            accessibilityLabel={`Enable ${title}`}
          >
            <Text style={permStyles.enableText}>Enable</Text>
          </AnimatedPressable>
        )}
      </MetalSurface>
    </FadeInView>
  );
}

const permStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  grantedBadge: {
    backgroundColor: colors.safety,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  grantedText: {
    color: colors.text.onBrand,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  enableButton: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  enableText: {
    color: colors.voltage,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
});

export default function PermissionsScreen() {
  const router = useRouter();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const skipOnboarding = useOnboardingStore((s) => s.skipOnboarding);
  const markPermissionRequested = useOnboardingStore((s) => s.markPermissionRequested);
  const setPermissionGranted = useOnboardingStore((s) => s.setPermissionGranted);
  const grantedPermissions = useOnboardingStore((s) => s.grantedPermissions);

  const [locationGranted, setLocationGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);

  const handleRequestLocation = useCallback(async () => {
    mediumHaptic();
    await markPermissionRequested('location');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setLocationGranted(granted);
      setPermissionGranted('location', granted);
      if (granted) {
        successHaptic();
      } else {
        Alert.alert(
          'Location Access',
          'ResQ needs your location to find nearby service providers. You can enable this later in Settings.',
          [{ text: 'OK' }]
        );
      }
    } catch {
      // Handle error silently - user can enable later
    }
  }, [markPermissionRequested, setPermissionGranted]);

  const handleRequestNotifications = useCallback(async () => {
    mediumHaptic();
    await markPermissionRequested('notifications');
    try {
      if (Platform.OS === 'web') {
        setNotifGranted(true);
        setPermissionGranted('notifications', true);
        return;
      }
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setNotifGranted(granted);
      setPermissionGranted('notifications', granted);
      if (granted) {
        successHaptic();
      } else {
        Alert.alert(
          'Notifications',
          'Enable notifications to know when your provider is arriving. You can change this in Settings.',
          [{ text: 'OK' }]
        );
      }
    } catch {
      // Handle error silently
    }
  }, [markPermissionRequested, setPermissionGranted]);

  const handleGetStarted = async () => {
    successHaptic();
    await completeOnboarding();
    router.replace('/auth/landing');
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
        accessibilityLabel="Skip permissions"
        accessibilityHint="Skip permissions and go to sign in. You can grant them later."
      >
        <Text style={styles.skipText}>Skip</Text>
      </AnimatedPressable>

      {/* Header */}
      <FadeInView delay={100}>
        <View style={styles.headerIcon}>
          <Shield size={32} color={colors.voltage} />
        </View>
        <Text style={styles.sectionTitle}>Stay Protected</Text>
        <Text style={styles.sectionSubtitle}>
          Allow these permissions so ResQ can help you faster in emergencies.
        </Text>
      </FadeInView>

      {/* Permission cards */}
      <View style={styles.permissionsContainer}>
        <PermissionCard
          icon={<MapPin size={24} color={colors.voltage} />}
          title="Location"
          description="Find nearby providers and dispatch help to your exact location."
          granted={locationGranted}
          onRequest={handleRequestLocation}
          delay={200}
        />
        <PermissionCard
          icon={<Bell size={24} color={colors.status.info} />}
          title="Notifications"
          description="Know when your provider is arriving and get service updates."
          granted={notifGranted}
          onRequest={handleRequestNotifications}
          delay={300}
        />
      </View>

      {/* Privacy note */}
      <FadeInView delay={400}>
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            Your data stays private. Permissions can be changed anytime in your device settings.
          </Text>
        </View>
      </FadeInView>

      {/* Page indicator */}
      <FadeInView delay={450}>
        <View style={styles.pageIndicator}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      </FadeInView>

      {/* Get Started button */}
      <FadeInView delay={500} style={styles.bottomSection}>
        <AnimatedPressable
          onPress={handleGetStarted}
          style={styles.getStartedButton}
          accessibilityLabel="Get Started"
          accessibilityHint="Complete onboarding and start using ResQ"
        >
          <Text style={styles.getStartedText}>Get Started</Text>
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
    backgroundColor: colors.status.info,
    opacity: 0.03,
    top: '20%',
    right: -100,
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
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginBottom: spacing.xxl,
    lineHeight: 24,
    maxWidth: 320,
  },
  permissionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  privacyNote: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  privacyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
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
  getStartedButton: {
    width: '100%',
    height: 56,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  getStartedText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
