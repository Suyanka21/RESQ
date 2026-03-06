import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPinOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';

interface NoProvidersProps {
  onTryAnother?: () => void;
  onCheckLater?: () => void;
}

export default function NoProviders({ onTryAnother, onCheckLater }: NoProvidersProps) {
  return (
    <View style={styles.container} accessibilityLabel="No providers available">
      <FadeInView delay={100}>
        <View style={styles.iconContainer}>
          <MapPinOff size={48} color={colors.service.towing} />
        </View>
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Providers Available</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>
          Try another service or check back at a different time. Provider availability varies by area.
        </Text>
      </FadeInView>
      {onTryAnother && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onTryAnother();
            }}
            style={styles.primaryButton}
            accessibilityLabel="Try another service"
          >
            <Text style={styles.primaryText}>Try Another Service</Text>
          </AnimatedPressable>
        </FadeInView>
      )}
      {onCheckLater && (
        <FadeInView delay={500}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onCheckLater();
            }}
            style={styles.secondaryButton}
            accessibilityLabel="Check back later"
          >
            <Text style={styles.secondaryText}>Check Later</Text>
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
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  secondaryText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
