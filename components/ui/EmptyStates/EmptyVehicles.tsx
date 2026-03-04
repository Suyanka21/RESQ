import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Car } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';

interface EmptyVehiclesProps {
  onAddVehicle?: () => void;
}

export default function EmptyVehicles({ onAddVehicle }: EmptyVehiclesProps) {
  return (
    <View style={styles.container} accessibilityLabel="No vehicles added">
      <View style={styles.iconContainer}>
        <Car size={48} color={colors.service.towing} />
      </View>
      <Text style={styles.title}>No Vehicles</Text>
      <Text style={styles.message}>
        Add your vehicle for faster service. Vehicle details help providers prepare before arriving.
      </Text>
      {onAddVehicle && (
        <TouchableOpacity
          onPress={onAddVehicle}
          style={styles.ctaButton}
          accessibilityLabel="Add a vehicle"
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Add Vehicle</Text>
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
