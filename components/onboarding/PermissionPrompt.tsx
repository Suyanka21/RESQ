/**
 * PermissionPrompt - Reusable permission request modal
 * Explains why a permission is needed before requesting it
 * Used throughout the app when a permission is first needed
 */

import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import MetalSurface from '@/components/MetalSurface';
import { mediumHaptic, lightHaptic } from '@/utils/haptics';

interface PermissionPromptProps {
  visible: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefit: string;
  onAllow: () => void;
  onDeny: () => void;
}

export default function PermissionPrompt({
  visible,
  icon,
  title,
  description,
  benefit,
  onAllow,
  onDeny,
}: PermissionPromptProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <FadeInView delay={100}>
          <MetalSurface variant="extruded" radius="xl" style={styles.card}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              {icon}
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Description */}
            <Text style={styles.description}>{description}</Text>

            {/* Benefit */}
            <View style={styles.benefitContainer}>
              <Text style={styles.benefitLabel}>WHY THIS HELPS</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <AnimatedPressable
                onPress={() => {
                  mediumHaptic();
                  onAllow();
                }}
                style={styles.allowButton}
                accessibilityLabel={`Allow ${title}`}
              >
                <Text style={styles.allowText}>Allow</Text>
              </AnimatedPressable>

              <AnimatedPressable
                onPress={() => {
                  lightHaptic();
                  onDeny();
                }}
                style={styles.denyButton}
                accessibilityLabel={`Not now for ${title}`}
              >
                <Text style={styles.denyText}>Not Now</Text>
              </AnimatedPressable>
            </View>
          </MetalSurface>
        </FadeInView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  benefitContainer: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  benefitLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.voltage,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  benefitText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  allowButton: {
    width: '100%',
    height: 52,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  allowText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  denyButton: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
