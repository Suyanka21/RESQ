import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic } from '@/utils/haptics';
import EmptyHistoryIllustration from '@/components/illustrations/EmptyHistoryIllustration';

interface EmptyHistoryProps {
  onRequestHelp?: () => void;
}

export default function EmptyHistory({ onRequestHelp }: EmptyHistoryProps) {
  return (
    <View style={styles.container} accessibilityLabel="No service history">
      <FadeInView delay={100}>
        <EmptyHistoryIllustration size={120} />
      </FadeInView>
      <FadeInView delay={200}>
        <Text style={styles.title}>No Service History Yet</Text>
      </FadeInView>
      <FadeInView delay={300}>
        <Text style={styles.message}>
          Your completed service requests will appear here. Request your first service to get started!
        </Text>
      </FadeInView>
      {onRequestHelp && (
        <FadeInView delay={400}>
          <AnimatedPressable
            onPress={() => {
              mediumHaptic();
              onRequestHelp();
            }}
            style={styles.ctaButton}
            accessibilityLabel="Request your first service"
            accessibilityHint="Opens the service selection screen"
          >
            <Text style={styles.ctaText}>Request Your First Service</Text>
          </AnimatedPressable>
        </FadeInView>
      )}
      <FadeInView delay={500}>
        <View style={styles.hintContainer}>
          <Clock size={14} color={colors.text.tertiary} />
          <Text style={styles.hintText}>Takes less than 30 seconds</Text>
        </View>
      </FadeInView>
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
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  hintText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
  },
});
