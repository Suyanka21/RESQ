import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { ShieldOff, Settings } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

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
      <View style={styles.iconContainer}>
        <ShieldOff size={48} color={colors.status.warning} />
      </View>
      <Text style={styles.title}>Permission Required</Text>
      <Text style={styles.message}>{displayMessage}</Text>

      <TouchableOpacity
        onPress={openSettings}
        style={styles.settingsButton}
        accessibilityLabel="Open device settings"
        accessibilityRole="button"
      >
        <Settings size={18} color={colors.text.onBrand} />
        <Text style={styles.settingsText}>Open Settings</Text>
      </TouchableOpacity>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityLabel="Retry permission check"
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>I've Enabled It</Text>
        </TouchableOpacity>
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
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
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
