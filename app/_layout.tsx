import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/theme';
import { useReducedMotion, getAnimationDuration } from '@/utils/accessibility';
import { useOnboardingStore } from '@/stores/onboardingStore';

// Performance: Expo Router already lazy loads screens via file-based routing.

export default function RootLayout() {
  const prefersReducedMotion = useReducedMotion();
  const animDuration = getAnimationDuration(200, prefersReducedMotion);
  const defaultAnimation = prefersReducedMotion ? 'none' as const : 'fade' as const;
  const slideAnimation = prefersReducedMotion ? 'none' as const : 'slide_from_right' as const;
  const loadOnboardingState = useOnboardingStore((s) => s.loadOnboardingState);

  useEffect(() => {
    loadOnboardingState();
  }, [loadOnboardingState]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: defaultAnimation,
          animationDuration: animDuration,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="auth/landing" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="auth/phone" />
        <Stack.Screen name="auth/otp" />
        <Stack.Screen name="(tabs)" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/request-form" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/searching" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/live-tracking" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/provider-arriving" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/service-in-progress" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/service-completion" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/payment" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/rating" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/offline" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="customer/support" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/quick-start" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/manage-vehicles" options={{ animation: slideAnimation }} />
        <Stack.Screen name="customer/add-payment" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/login" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/otp" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/dashboard" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="provider/dispatch" options={{ animation: defaultAnimation, presentation: 'transparentModal' }} />
        <Stack.Screen name="provider/navigation" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/job-service" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/job-summary" options={{ animation: defaultAnimation }} />
        <Stack.Screen name="provider/earnings" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/profile" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/history" options={{ animation: slideAnimation }} />
        <Stack.Screen name="provider/support" options={{ animation: slideAnimation }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
