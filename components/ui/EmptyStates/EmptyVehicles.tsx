import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Car } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';

interface EmptyVehiclesProps {
  onAddVehicle?: () => void;
}

export default function EmptyVehicles({ onAddVehicle }: EmptyVehiclesProps) {
  return (
    <View style={styles.container} accessibilityLabel="No vehicles added">
      <FadeInView delay={100}>
        <View style={styles.iconContainer}>
          <Car size={48} color={colors.service.towing} />
        </View>
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Vehicles</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>
          Add your vehicle for faster service. Vehicle details help providers prepare before arriving.
        </Text>
      </FadeInView>
      {onAddVehicle && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onAddVehicle();
            }}
            style={styles.ctaButton}
            accessibilityLabel="Add a vehicle"
          >
            <Text style={styles.ctaText}>Add Vehicle</Text>
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
