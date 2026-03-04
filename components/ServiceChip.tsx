import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadows, typography, spacing, borderRadius } from '@/theme';

interface ServiceChipProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

export default function ServiceChip({
  label,
  icon,
  color,
  isActive,
  onPress,
}: ServiceChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`${label} service`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      style={[
        styles.chip,
        isActive ? styles.chipActive : styles.chipIdle,
      ]}
    >
      <View style={[styles.iconContainer, isActive && { opacity: 1 }]}>
        {icon}
      </View>
      <Text
        style={[
          styles.label,
          isActive && { color: colors.text.primary },
        ]}
      >
        {label}
      </Text>
      {isActive && (
        <View
          style={[
            styles.backlight,
            { backgroundColor: color, shadowColor: color },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    height: 88,
    position: 'relative',
    overflow: 'hidden',
  },
  chipIdle: {
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    ...shadows.metalExtruded,
  },
  chipActive: {
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    ...shadows.metalSunken,
  },
  iconContainer: {
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  label: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  backlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
});
