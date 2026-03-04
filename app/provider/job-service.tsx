import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Wrench, Clock } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

type ServiceState = 'arrived' | 'diagnosing' | 'in_service' | 'completing';

const STATES: { id: ServiceState; label: string; sublabel: string }[] = [
  { id: 'arrived', label: 'Arrived at Location', sublabel: 'Confirm you are on site' },
  { id: 'diagnosing', label: 'Diagnosing Issue', sublabel: 'Assess the problem' },
  { id: 'in_service', label: 'Service In Progress', sublabel: 'Performing repairs/towing' },
  { id: 'completing', label: 'Completing Service', sublabel: 'Final checks' },
];

export default function ProviderJobServiceScreen() {
  const router = useRouter();
  const [currentState, setCurrentState] = useState<ServiceState>('arrived');

  const currentIndex = STATES.findIndex((s) => s.id === currentState);

  const handleNext = () => {
    if (currentIndex < STATES.length - 1) {
      setCurrentState(STATES[currentIndex + 1].id);
    } else {
      router.replace('/provider/job-summary');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Job Execution</Text>
        <View style={styles.timerPill}>
          <Clock size={14} color={colors.voltage} />
          <Text style={styles.timerText}>00:12:34</Text>
        </View>
      </View>

      {/* Customer Info */}
      <MetalSurface variant="glass" radius="lg" style={styles.customerCard}>
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View>
            <Text style={styles.customerName}>John Doe</Text>
            <Text style={styles.customerDetail}>Towing - Westlands, Nairobi</Text>
          </View>
        </View>
      </MetalSurface>

      {/* State Toggles */}
      <View style={styles.states}>
        {STATES.map((state, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = state.id === currentState;
          return (
            <TouchableOpacity
              key={state.id}
              onPress={() => isCurrent && handleNext()}
              disabled={!isCurrent}
              style={[
                styles.stateCard,
                isCompleted && styles.stateCompleted,
                isCurrent && styles.stateCurrent,
              ]}
              accessibilityLabel={state.label}
              accessibilityRole="button"
            >
              <View style={styles.stateIcon}>
                {isCompleted ? (
                  <CheckCircle size={24} color={colors.status.success} />
                ) : isCurrent ? (
                  <Wrench size={24} color={colors.voltage} />
                ) : (
                  <View style={styles.stateInactive} />
                )}
              </View>
              <View style={styles.stateInfo}>
                <Text style={[styles.stateLabel, isCompleted && styles.stateLabelDone, isCurrent && styles.stateLabelActive]}>
                  {state.label}
                </Text>
                <Text style={styles.stateSublabel}>{state.sublabel}</Text>
              </View>
              {isCurrent && <Text style={styles.tapHint}>TAP</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
          accessibilityLabel={currentIndex < STATES.length - 1 ? 'Next step' : 'Complete job'}
          accessibilityRole="button"
        >
          <Text style={styles.nextText}>
            {currentIndex < STATES.length - 1 ? 'Next Step' : 'Complete Job'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.lg,
  },
  title: { color: colors.text.primary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  timerPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  timerText: { color: colors.voltage, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  customerCard: { marginHorizontal: spacing.lg, padding: spacing.lg, marginBottom: spacing.xl },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.status.info,
  },
  avatarText: { color: colors.status.info, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  customerName: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  customerDetail: { color: colors.text.secondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  states: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  stateCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    padding: spacing.lg, borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1, borderColor: colors.background.border,
  },
  stateCompleted: { opacity: 0.6 },
  stateCurrent: { borderColor: colors.voltage, backgroundColor: 'rgba(255,165,0,0.05)' },
  stateIcon: { width: 24 },
  stateInactive: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.background.border },
  stateInfo: { flex: 1 },
  stateLabel: { color: colors.text.secondary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  stateLabelDone: { color: colors.status.success },
  stateLabelActive: { color: colors.text.primary },
  stateSublabel: { color: colors.text.tertiary, fontSize: typography.fontSize.xs, marginTop: 2 },
  tapHint: { color: colors.voltage, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, paddingBottom: spacing.xxl },
  nextButton: {
    backgroundColor: colors.voltage, borderRadius: borderRadius.lg,
    paddingVertical: spacing.md, alignItems: 'center', ...shadows.glow,
  },
  nextText: { color: colors.text.onBrand, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
});
