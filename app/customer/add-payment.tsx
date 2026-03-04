import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Smartphone, CreditCard } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

export default function AddPaymentScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Method Selection */}
        <View style={styles.methodRow}>
          <TouchableOpacity
            onPress={() => setMethod('mpesa')}
            style={[styles.methodOption, method === 'mpesa' && styles.methodActive]}
            accessibilityLabel="M-Pesa"
            accessibilityRole="button"
            accessibilityState={{ selected: method === 'mpesa' }}
          >
            <Smartphone size={24} color={method === 'mpesa' ? colors.voltage : colors.text.tertiary} />
            <Text style={[styles.methodText, method === 'mpesa' && styles.methodTextActive]}>M-Pesa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMethod('card')}
            style={[styles.methodOption, method === 'card' && styles.methodActive]}
            accessibilityLabel="Card"
            accessibilityRole="button"
            accessibilityState={{ selected: method === 'card' }}
          >
            <CreditCard size={24} color={method === 'card' ? colors.voltage : colors.text.tertiary} />
            <Text style={[styles.methodText, method === 'card' && styles.methodTextActive]}>Card</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        {method === 'mpesa' ? (
          <MetalSurface variant="sunken" radius="lg" style={styles.inputCard}>
            <Text style={styles.inputLabel}>M-PESA PHONE NUMBER</Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>+254</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="712 345 678"
                placeholderTextColor={colors.text.disabled}
                keyboardType="phone-pad"
                accessibilityLabel="M-Pesa phone number"
              />
            </View>
          </MetalSurface>
        ) : (
          <View style={styles.cardFields}>
            <MetalSurface variant="sunken" radius="lg" style={styles.inputCard}>
              <Text style={styles.inputLabel}>CARD NUMBER</Text>
              <TextInput
                style={styles.inputFull}
                placeholder="4000 0000 0000 0000"
                placeholderTextColor={colors.text.disabled}
                keyboardType="number-pad"
                accessibilityLabel="Card number"
              />
            </MetalSurface>
            <View style={styles.cardRow}>
              <MetalSurface variant="sunken" radius="lg" style={[styles.inputCard, { flex: 1 }]}>
                <Text style={styles.inputLabel}>EXPIRY</Text>
                <TextInput
                  style={styles.inputFull}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.text.disabled}
                  keyboardType="number-pad"
                  accessibilityLabel="Expiry date"
                />
              </MetalSurface>
              <MetalSurface variant="sunken" radius="lg" style={[styles.inputCard, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.inputFull}
                  placeholder="123"
                  placeholderTextColor={colors.text.disabled}
                  keyboardType="number-pad"
                  secureTextEntry
                  accessibilityLabel="CVV"
                />
              </MetalSurface>
            </View>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.saveButton}
          accessibilityLabel="Save payment method"
          accessibilityRole="button"
        >
          <Text style={styles.saveText}>Save Payment Method</Text>
        </TouchableOpacity>
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
  methodRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  methodOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.border,
    gap: spacing.sm,
  },
  methodActive: {
    borderColor: colors.voltage,
    backgroundColor: 'rgba(255,165,0,0.05)',
  },
  methodText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  methodTextActive: {
    color: colors.voltage,
  },
  inputCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  inputLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  prefix: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  inputFull: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  cardFields: {
    gap: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  saveText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
