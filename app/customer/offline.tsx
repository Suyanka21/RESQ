import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

export default function OfflineScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <WifiOff size={48} color={colors.text.tertiary} />
        </View>

        <Text style={styles.title}>No Connection</Text>
        <Text style={styles.subtitle}>
          You appear to be offline. Your request has been queued and will be
          sent when connectivity is restored.
        </Text>

        {/* Queued Request Banner */}
        <MetalSurface variant="glass" radius="lg" style={styles.queueBanner}>
          <View style={styles.queueDot} />
          <View style={styles.queueInfo}>
            <Text style={styles.queueTitle}>Request Queued</Text>
            <Text style={styles.queueDetail}>Towing - Westlands, Nairobi</Text>
          </View>
        </MetalSurface>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          style={styles.retryButton}
          accessibilityLabel="Retry connection"
          accessibilityRole="button"
        >
          <RefreshCw size={18} color={colors.text.onBrand} />
          <Text style={styles.retryText}>Retry Connection</Text>
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
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 300,
  },
  queueBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  queueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.status.warning,
  },
  queueInfo: {
    flex: 1,
  },
  queueTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  queueDetail: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
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
