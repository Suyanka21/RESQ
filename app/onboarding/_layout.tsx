/**
 * Onboarding Layout
 * Simple stack navigator for the onboarding flow
 */

import { Stack } from 'expo-router';
import { colors } from '@/theme';
import { useReducedMotion, getAnimationDuration } from '@/utils/accessibility';

export default function OnboardingLayout() {
  const prefersReducedMotion = useReducedMotion();
  const animDuration = getAnimationDuration(200, prefersReducedMotion);
  const slideAnimation = prefersReducedMotion ? 'none' as const : 'slide_from_right' as const;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.base },
        animation: slideAnimation,
        animationDuration: animDuration,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="how-it-works" />
      <Stack.Screen name="permissions" />
    </Stack>
  );
}
