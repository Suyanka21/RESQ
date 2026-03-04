import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

const MOCK_EARNINGS = [
  { id: '1', date: 'Today', jobs: 3, amount: 12500 },
  { id: '2', date: 'Yesterday', jobs: 5, amount: 18750 },
  { id: '3', date: 'Mon, Jan 27', jobs: 4, amount: 15000 },
  { id: '4', date: 'Sun, Jan 26', jobs: 2, amount: 8500 },
];

export default function ProviderEarningsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Total Earnings - Oversized Typography (48px) */}
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>THIS WEEK</Text>
        <Text style={styles.totalAmount}>KES 54,750</Text>
        <View style={styles.trendRow}>
          <TrendingUp size={16} color={colors.status.success} />
          <Text style={styles.trendText}>+12% from last week</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <MetalSurface variant="extruded" radius="lg" style={styles.statCard}>
          <Text style={styles.statValue}>14</Text>
          <Text style={styles.statLabel}>Jobs Done</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.statCard}>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.statCard}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Accept Rate</Text>
        </MetalSurface>
      </View>

      {/* Daily Breakdown */}
      <Text style={styles.sectionTitle}>Daily Breakdown</Text>
      <FlatList
        data={MOCK_EARNINGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.dayRow}>
            <View style={styles.dayInfo}>
              <Calendar size={16} color={colors.text.tertiary} />
              <View>
                <Text style={styles.dayDate}>{item.date}</Text>
                <Text style={styles.dayJobs}>{item.jobs} jobs</Text>
              </View>
            </View>
            <Text style={styles.dayAmount}>KES {item.amount.toLocaleString()}</Text>
          </View>
        )}
      />

      {/* Payout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payoutButton}
          accessibilityLabel="Request payout"
          accessibilityRole="button"
        >
          <Text style={styles.payoutText}>Request Payout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  totalSection: { alignItems: 'center', paddingVertical: spacing.xl },
  totalLabel: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 3, marginBottom: spacing.sm },
  totalAmount: { color: colors.text.primary, fontSize: typography.fontSize.xxxl, fontWeight: typography.fontWeight.extrabold },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  trendText: { color: colors.status.success, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md },
  statValue: { color: colors.voltage, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.extrabold },
  statLabel: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 1, marginTop: spacing.xs },
  sectionTitle: {
    color: colors.text.secondary, fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold, letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  dayRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.background.border,
  },
  dayInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dayDate: { color: colors.text.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  dayJobs: { color: colors.text.tertiary, fontSize: typography.fontSize.xs, marginTop: 2 },
  dayAmount: { color: colors.voltage, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, paddingBottom: spacing.xxl },
  payoutButton: {
    backgroundColor: colors.voltage, borderRadius: borderRadius.lg,
    paddingVertical: spacing.md, alignItems: 'center', ...shadows.glow,
  },
  payoutText: { color: colors.text.onBrand, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
});
