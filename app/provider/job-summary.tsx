import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Share2 } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

export default function ProviderJobSummaryScreen() {
  const router = useRouter();

  const handleFinish = () => {
    router.replace('/provider/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.checkContainer}>
          <View style={styles.checkGlow} />
          <CheckCircle size={72} color={colors.status.success} />
        </View>

        <Text style={styles.title}>Job Complete</Text>
        <Text style={styles.subtitle}>Digital receipt generated</Text>

        {/* Receipt Card */}
        <MetalSurface variant="glass" radius="xl" style={styles.receiptCard}>
          <Text style={styles.receiptHeader}>RECEIPT</Text>
          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Service</Text>
            <Text style={styles.receiptValue}>Towing</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Customer</Text>
            <Text style={styles.receiptValue}>John Doe</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Location</Text>
            <Text style={styles.receiptValue}>Westlands, Nairobi</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Duration</Text>
            <Text style={styles.receiptValue}>45 min</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Date</Text>
            <Text style={styles.receiptValue}>Jan 30, 2026</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Base Fare</Text>
            <Text style={styles.receiptValue}>KES 5,000</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Platform Fee</Text>
            <Text style={styles.receiptValue}>-KES 750</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptRow}>
            <Text style={styles.earningsLabel}>Your Earnings</Text>
            <Text style={styles.earningsValue}>KES 4,250</Text>
          </View>
        </MetalSurface>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          accessibilityLabel="Share receipt"
          accessibilityRole="button"
        >
          <Share2 size={16} color={colors.voltage} />
          <Text style={styles.shareText}>Share Receipt</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleFinish}
          style={styles.finishButton}
          accessibilityLabel="Back to dashboard"
          accessibilityRole="button"
        >
          <Text style={styles.finishText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: spacing.lg },
  checkContainer: { marginBottom: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  checkGlow: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,230,118,0.1)' },
  title: { color: colors.text.primary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm },
  subtitle: { color: colors.text.secondary, fontSize: typography.fontSize.sm, marginBottom: spacing.xl },
  receiptCard: { width: '100%', padding: spacing.lg },
  receiptHeader: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 4, textAlign: 'center', marginBottom: spacing.md },
  receiptDivider: { height: 1, backgroundColor: colors.background.border, marginVertical: spacing.md },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  receiptLabel: { color: colors.text.secondary, fontSize: typography.fontSize.sm },
  receiptValue: { color: colors.text.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  earningsLabel: { color: colors.status.success, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  earningsValue: { color: colors.status.success, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.extrabold },
  shareButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg, paddingVertical: spacing.md },
  shareText: { color: colors.voltage, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  footer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  finishButton: {
    backgroundColor: colors.voltage, borderRadius: borderRadius.lg,
    paddingVertical: spacing.md, alignItems: 'center', ...shadows.glow,
  },
  finishText: { color: colors.text.onBrand, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
});
