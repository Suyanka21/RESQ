import React from 'react';
import { View, Text, StyleSheet, Linking, Platform } from 'react-native';
import { Settings } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import ErrorIllustration from '@/components/illustrations/ErrorIllustration';

interface PermissionErrorProps {
  permissionType?: 'location' | 'camera' | 'notifications';
  message?: string;
  onRetry?: () => void;
}

const PERMISSION_MESSAGES: Record<string, string> = {
  location: 'Location access is required to find nearby providers and track your service.',
  camera: 'Camera access is needed to scan documents and capture incident photos.',
  notifications: 'Enable notifications to receive real-time updates on your service request.',
};

export default function PermissionError({
  permissionType = 'location',
  message,
  onRetry,
}: PermissionErrorProps) {
  const displayMessage = message || PERMISSION_MESSAGES[permissionType];

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  return (
    <View style={styles.container} accessibilityRole="alert">
      <FadeInView delay={100}>
        <ErrorIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>Permission Required</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>{displayMessage}</Text>
      </FadeInView>

      <FadeInView delay={400}>
        <AnimatedPressable
          onPress={() => {
            mediumHaptic();
            openSettings();
          }}
          style={styles.settingsButton}
          accessibilityLabel="Open device settings"
        >
          <Settings size={18} color={colors.text.onBrand} />
          <Text style={styles.settingsText}>Open Settings</Text>
        </AnimatedPressable>
      </FadeInView>

      {onRetry && (
        <FadeInView delay={500}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onRetry();
            }}
            style={styles.retryButton}
            accessibilityLabel="Retry permission check"
          >
            <Text style={styles.retryText}>I've Enabled It</Text>
          </AnimatedPressable>
        </FadeInView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.voltage,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  settingsText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  retryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  retryText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
