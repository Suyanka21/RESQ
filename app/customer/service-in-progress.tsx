import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Circle, Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

const STEPS = [
  { id: 1, label: 'Provider Arrived', sublabel: 'On site' },
  { id: 2, label: 'Diagnosing Issue', sublabel: 'Assessment in progress' },
  { id: 3, label: 'Service In Progress', sublabel: 'Working on your vehicle' },
  { id: 4, label: 'Completing', sublabel: 'Final checks' },
];

export default function ServiceInProgressScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const handleAdvance = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/customer/service-completion');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service In Progress</Text>
        <View style={styles.timerPill}>
          <Clock size={14} color={colors.voltage} />
          <Text style={styles.timerText}>12:34</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <View key={step.id} style={styles.stepRow}>
              {/* Step indicator */}
              <View style={styles.stepIndicator}>
                {isCompleted ? (
                  <CheckCircle size={24} color={colors.status.success} />
                ) : isCurrent ? (
                  <View style={styles.currentDot}>
                    <View style={styles.currentDotInner} />
                  </View>
                ) : (
                  <Circle size={24} color={colors.text.disabled} />
                )}
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      isCompleted && styles.stepLineCompleted,
                    ]}
                  />
                )}
              </View>

              {/* Step content */}
              <MetalSurface
                variant={isCurrent ? 'glass' : 'extruded'}
                radius="lg"
                style={[styles.stepCard, isCurrent && styles.stepCardActive]}
              >
                <Text
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isCurrent && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
                <Text style={styles.stepSublabel}>{step.sublabel}</Text>
              </MetalSurface>
            </View>
          );
        })}
      </View>

      {/* Provider Info */}
      <MetalSurface variant="glass" radius="xl" style={styles.providerInfo}>
        <View style={styles.providerRow}>
          <View style={styles.providerAvatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.providerDetails}>
            <Text style={styles.providerName}>James Mwangi</Text>
            <Text style={styles.providerService}>Towing Specialist</Text>
          </View>
        </View>
      </MetalSurface>

      {/* Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleAdvance}
          style={styles.nextButton}
          accessibilityLabel={currentStep < STEPS.length ? 'Next step' : 'Complete service'}
          accessibilityRole="button"
        >
          <Text style={styles.nextText}>
            {currentStep < STEPS.length ? 'Next Step' : 'Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  timerText: {
    color: colors.voltage,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  stepper: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepIndicator: {
    alignItems: 'center',
    width: 24,
  },
  currentDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,165,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.voltage,
  },
  stepLine: {
    width: 2,
    height: 32,
    backgroundColor: colors.background.border,
    marginVertical: spacing.xs,
  },
  stepLineCompleted: {
    backgroundColor: colors.status.success,
  },
  stepCard: {
    flex: 1,
    padding: spacing.md,
  },
  stepCardActive: {
    borderColor: colors.voltage,
    borderWidth: 1,
  },
  stepLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  stepLabelCompleted: {
    color: colors.status.success,
  },
  stepLabelActive: {
    color: colors.text.primary,
  },
  stepSublabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  providerInfo: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.voltage,
  },
  avatarText: {
    color: colors.voltage,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  providerService: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  nextButton: {
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  nextText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
