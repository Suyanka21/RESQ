import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPinOff, ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface ServiceUnavailableProps {
  message?: string;
  onTryAnother?: () => void;
  onGoBack?: () => void;
}

export default function ServiceUnavailable({
  message = 'No providers are currently available in your area. Please try a different service or check back later.',
  onTryAnother,
  onGoBack,
}: ServiceUnavailableProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconContainer}>
        <MapPinOff size={48} color={colors.service.towing} />
      </View>
      <Text style={styles.title}>No Providers Nearby</Text>
      <Text style={styles.message}>{message}</Text>

      {onTryAnother && (
        <TouchableOpacity
          onPress={onTryAnother}
          style={styles.primaryButton}
          accessibilityLabel="Try another service"
          accessibilityRole="button"
        >
          <Text style={styles.primaryText}>Try Another Service</Text>
        </TouchableOpacity>
      )}

      {onGoBack && (
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={16} color={colors.text.secondary} />
          <Text style={styles.backText}>Go Back</Text>
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
  primaryButton: {
    backgroundColor: colors.voltage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  primaryText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  backText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
