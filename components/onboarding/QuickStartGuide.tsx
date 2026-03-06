/**
 * QuickStartGuide - In-app help section
 * Step-by-step guides for common tasks
 * Accessible from profile/help section
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Truck,
  CreditCard,
  MapPin,
  Car,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import MetalSurface from '@/components/MetalSurface';
import { lightHaptic } from '@/utils/haptics';

interface GuideStep {
  step: number;
  instruction: string;
}

interface GuideItemData {
  id: string;
  title: string;
  icon: React.ReactNode;
  steps: GuideStep[];
}

const GUIDES: GuideItemData[] = [
  {
    id: 'request-towing',
    title: 'How to Request Towing',
    icon: <Truck size={20} color={colors.service.towing} />,
    steps: [
      { step: 1, instruction: 'From the dashboard, tap the "Towing" service chip.' },
      { step: 2, instruction: 'Fill in your vehicle details and describe the issue.' },
      { step: 3, instruction: 'Swipe to confirm. We\'ll match you with the nearest tow truck.' },
      { step: 4, instruction: 'Track your provider in real-time on the map.' },
    ],
  },
  {
    id: 'add-payment',
    title: 'How to Add M-Pesa',
    icon: <CreditCard size={20} color={colors.voltage} />,
    steps: [
      { step: 1, instruction: 'Go to your Profile and tap "Payment Methods".' },
      { step: 2, instruction: 'Select "Add M-Pesa" and enter your phone number.' },
      { step: 3, instruction: 'Verify with the M-Pesa PIN sent to your phone.' },
      { step: 4, instruction: 'Your M-Pesa is now linked for instant payments.' },
    ],
  },
  {
    id: 'track-provider',
    title: 'How to Track Your Provider',
    icon: <MapPin size={20} color={colors.status.info} />,
    steps: [
      { step: 1, instruction: 'After confirming a request, the tracking screen opens automatically.' },
      { step: 2, instruction: 'Watch the orange line showing your provider\'s route to you.' },
      { step: 3, instruction: 'The ETA updates in real-time as they approach.' },
      { step: 4, instruction: 'You\'ll get a notification when they\'re nearby.' },
    ],
  },
  {
    id: 'add-vehicle',
    title: 'How to Save a Vehicle',
    icon: <Car size={20} color={colors.safety} />,
    steps: [
      { step: 1, instruction: 'Go to your Profile and tap "My Vehicles".' },
      { step: 2, instruction: 'Tap "Add Vehicle" and enter make, model, year, and plate.' },
      { step: 3, instruction: 'Saved vehicles speed up future service requests.' },
    ],
  },
];

interface GuideItemProps {
  guide: GuideItemData;
  delay: number;
}

function GuideItem({ guide, delay }: GuideItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <FadeInView delay={delay}>
      <AnimatedPressable
        onPress={() => {
          lightHaptic();
          setExpanded(!expanded);
        }}
        style={styles.guideItemPressable}
        accessibilityLabel={guide.title}
        accessibilityHint={expanded ? 'Collapse guide' : 'Expand guide'}
        accessibilityState={{ expanded }}
      >
        <MetalSurface variant={expanded ? 'sunken' : 'extruded'} radius="lg" style={styles.guideItem}>
          <View style={styles.guideHeader}>
            <View style={styles.guideIconContainer}>
              {guide.icon}
            </View>
            <Text style={styles.guideTitle}>{guide.title}</Text>
            {expanded
              ? <ChevronUp size={20} color={colors.text.tertiary} />
              : <ChevronDown size={20} color={colors.text.tertiary} />
            }
          </View>

          {expanded && (
            <View style={styles.stepsContainer}>
              {guide.steps.map((step) => (
                <View key={step.step} style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepNumber}>{step.step}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.instruction}</Text>
                </View>
              ))}
            </View>
          )}
        </MetalSurface>
      </AnimatedPressable>
    </FadeInView>
  );
}

export default function QuickStartGuide() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <FadeInView delay={100}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <HelpCircle size={28} color={colors.voltage} />
          </View>
          <Text style={styles.title}>Quick Start Guide</Text>
          <Text style={styles.subtitle}>
            Step-by-step guides to help you get the most out of ResQ.
          </Text>
        </View>
      </FadeInView>

      {/* Guides */}
      {GUIDES.map((guide, index) => (
        <GuideItem key={guide.id} guide={guide} delay={200 + index * 100} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  guideItemPressable: {
    marginBottom: spacing.md,
  },
  guideItem: {
    padding: spacing.md,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  guideTitle: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  stepsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.voltage,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumber: {
    color: colors.text.onBrand,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
  },
  stepText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 22,
  },
});
