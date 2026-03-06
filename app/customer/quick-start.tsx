/**
 * Quick Start Guide Screen
 * Accessible from the profile menu
 * Provides step-by-step guides for common tasks
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors, spacing } from '@/theme';
import { AnimatedPressable } from '@/components/animations';
import { QuickStartGuide } from '@/components/onboarding';
import { lightHaptic } from '@/utils/haptics';

export default function QuickStartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.topBar}>
        <AnimatedPressable
          onPress={() => {
            lightHaptic();
            router.back();
          }}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </AnimatedPressable>
      </View>

      <QuickStartGuide />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    paddingTop: 56,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
