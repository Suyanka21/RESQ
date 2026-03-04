import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RefreshCw } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface RetryAllButtonProps {
  onRetryAll: () => void;
  isRetrying?: boolean;
}

export default function RetryAllButton({ onRetryAll, isRetrying = false }: RetryAllButtonProps) {
  return (
    <TouchableOpacity
      onPress={onRetryAll}
      style={[styles.button, isRetrying && styles.buttonDisabled]}
      disabled={isRetrying}
      accessibilityLabel={isRetrying ? 'Syncing queued requests' : 'Sync all queued requests'}
      accessibilityRole="button"
      accessibilityState={{ disabled: isRetrying }}
    >
      <RefreshCw size={18} color={isRetrying ? colors.text.disabled : colors.text.onBrand} />
      <Text style={[styles.text, isRetrying && styles.textDisabled]}>
        {isRetrying ? 'Syncing...' : 'Sync All'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.voltage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    ...shadows.glow,
  },
  buttonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  text: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  textDisabled: {
    color: colors.text.disabled,
  },
});
