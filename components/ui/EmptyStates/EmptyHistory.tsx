import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface EmptyHistoryProps {
  onRequestHelp?: () => void;
}

export default function EmptyHistory({ onRequestHelp }: EmptyHistoryProps) {
  return (
    <View style={styles.container} accessibilityLabel="No service history">
      <View style={styles.iconContainer}>
        <Clock size={48} color={colors.service.towing} />
      </View>
      <Text style={styles.title}>No Trips Yet</Text>
      <Text style={styles.message}>
        Your service history will appear here. Request roadside help to get started!
      </Text>
      {onRequestHelp && (
        <TouchableOpacity
          onPress={onRequestHelp}
          style={styles.ctaButton}
          accessibilityLabel="Request roadside help"
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Request Help</Text>
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
    maxWidth: 260,
  },
  ctaButton: {
    backgroundColor: colors.voltage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.glow,
  },
  ctaText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
