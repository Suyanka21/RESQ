import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/landing" />
        <Stack.Screen name="auth/phone" />
        <Stack.Screen name="auth/otp" />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/request-form" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/searching" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/live-tracking" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/provider-arriving" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/service-in-progress" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/service-completion" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/payment" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/rating" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/offline" options={{ animation: 'fade' }} />
        <Stack.Screen name="customer/support" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/manage-vehicles" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customer/add-payment" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/otp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/dashboard" options={{ animation: 'fade' }} />
        <Stack.Screen name="provider/dispatch" options={{ animation: 'fade', presentation: 'transparentModal' }} />
        <Stack.Screen name="provider/navigation" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/job-service" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/job-summary" options={{ animation: 'fade' }} />
        <Stack.Screen name="provider/earnings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="provider/support" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
