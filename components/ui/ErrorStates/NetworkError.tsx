import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface NetworkErrorProps {
  queuedCount?: number;
  onRetry?: () => void;
  onViewQueue?: () => void;
}

export default function NetworkError({
  queuedCount = 0,
  onRetry,
  onViewQueue,
}: NetworkErrorProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconContainer}>
        <WifiOff size={48} color={colors.text.tertiary} />
      </View>
      <Text style={styles.title}>No Connection</Text>
      <Text style={styles.message}>
        You appear to be offline. Your requests have been queued and will be sent when connectivity is restored.
      </Text>

      {queuedCount > 0 && (
        <TouchableOpacity
          onPress={onViewQueue}
          style={styles.queueBanner}
          accessibilityLabel={`${queuedCount} queued requests`}
          accessibilityRole="button"
        >
          <View style={styles.queueDot} />
          <Text style={styles.queueText}>
            {queuedCount} request{queuedCount > 1 ? 's' : ''} queued
          </Text>
        </TouchableOpacity>
      )}

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryButton}
          accessibilityLabel="Retry connection"
          accessibilityRole="button"
        >
          <RefreshCw size={18} color={colors.text.onBrand} />
          <Text style={styles.retryText}>Retry Connection</Text>
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
    maxWidth: 300,
  },
  queueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  queueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.status.warning,
  },
  queueText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.voltage,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.glow,
  },
  retryText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
