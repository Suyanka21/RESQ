import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import ErrorIllustration from '@/components/illustrations/ErrorIllustration';

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
      <FadeInView delay={100}>
        <ErrorIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Providers Nearby</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>{message}</Text>
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

      {onGoBack && (
        <FadeInView delay={500}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onGoBack();
            }}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Text style={styles.backText}>Go Back</Text>
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
