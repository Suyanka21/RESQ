import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Smartphone } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { PaymentError } from '@/components/ui/ErrorStates';
import { TOUCH_TARGET } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView, GlassmorphicPanel } from '@/components/animations';
import { heavyHaptic } from '@/utils/haptics';

export default function PaymentScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [paymentError, setPaymentError] = useState<'timeout' | 'insufficient' | 'cancelled' | 'generic' | null>(null);

  const handlePay = () => {
    // In production, this would handle M-Pesa STK push and potential errors
    router.replace('/customer/rating');
  };

  if (paymentError) {
    return (
      <PaymentError
        errorType={paymentError}
        onRetry={() => setPaymentError(null)}
        onContactSupport={() => router.push('/customer/support')}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to previous screen"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Amount */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>AMOUNT DUE</Text>
          <Text style={styles.amountValue}>KES 5,000</Text>
        </View>

        {/* M-Pesa Payment */}
        <FadeInView delay={100}>
        <GlassmorphicPanel intensity="medium" radius="xl" style={styles.paymentCard}>
          <View style={styles.mpesaHeader}>
            <View style={styles.mpesaIcon}>
              <Smartphone size={24} color={colors.status.success} />
            </View>
            <View>
              <Text style={styles.mpesaTitle}>M-Pesa</Text>
              <Text style={styles.mpesaNumber}>+254 712 ***</Text>
            </View>
          </View>

          {/* PIN Entry */}
          <Text style={styles.pinLabel}>ENTER M-PESA PIN</Text>
          <View style={styles.pinContainer}>
            {[0, 1, 2, 3].map((i) => (
              <MetalSurface key={i} variant="sunken" radius="md" style={styles.pinBox}>
                <Text style={styles.pinDot}>{pin.length > i ? '\u2022' : ''}</Text>
              </MetalSurface>
            ))}
          </View>

          <TextInput
            style={styles.hiddenInput}
            value={pin}
            onChangeText={(t) => setPin(t.slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            autoFocus
            accessibilityLabel="M-Pesa PIN, 4 digits required"
            accessibilityHint="Enter your 4-digit M-Pesa PIN to authorize payment"
          />
        </GlassmorphicPanel>
        </FadeInView>

        {/* Pay Button */}
        <AnimatedPressable
          onPress={() => {
            heavyHaptic();
            handlePay();
          }}
          disabled={pin.length < 4}
          style={[styles.payButton, pin.length < 4 && styles.payButtonDisabled]}
          accessibilityLabel="Pay now"
        >
          <Text style={[styles.payText, pin.length < 4 && styles.payTextDisabled]}>
            Pay KES 5,000
          </Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  amountLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  amountValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.extrabold,
  },
  paymentCard: {
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  mpesaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  mpesaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,230,118,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mpesaTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  mpesaNumber: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
  },
  pinLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  pinBox: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinDot: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xxl,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  payButton: {
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  payButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
    shadowOpacity: 0,
  },
  payText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  payTextDisabled: {
    color: colors.text.disabled,
  },
});
