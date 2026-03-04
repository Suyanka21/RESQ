import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { CreditCard, Plus, ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

const MOCK_TRANSACTIONS = [
  { id: '1', type: 'payment', description: 'Towing Service', amount: -5000, date: 'Jan 28' },
  { id: '2', type: 'topup', description: 'M-Pesa Top Up', amount: 10000, date: 'Jan 25' },
  { id: '3', type: 'payment', description: 'Battery Jump', amount: -1500, date: 'Jan 15' },
];

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      {/* Balance Card */}
      <MetalSurface variant="glass" radius="xl" style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>KES 3,500</Text>
        <View style={styles.balanceActions}>
          <TouchableOpacity
            style={styles.balanceButton}
            accessibilityLabel="Top up wallet"
            accessibilityRole="button"
          >
            <Plus size={16} color={colors.text.onBrand} />
            <Text style={styles.balanceButtonText}>Top Up</Text>
          </TouchableOpacity>
        </View>
      </MetalSurface>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        <MetalSurface variant="extruded" radius="lg" style={styles.methodCard}>
          <CreditCard size={20} color={colors.voltage} />
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>M-Pesa</Text>
            <Text style={styles.methodDetail}>+254 712 ***</Text>
          </View>
          <View style={styles.defaultTag}>
            <Text style={styles.defaultText}>DEFAULT</Text>
          </View>
        </MetalSurface>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>
      <FlatList
        data={MOCK_TRANSACTIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionList}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View style={[styles.txIcon, item.amount > 0 ? styles.txIconPositive : styles.txIconNegative]}>
              {item.amount > 0
                ? <ArrowDownLeft size={16} color={colors.status.success} />
                : <ArrowUpRight size={16} color={colors.status.error} />
              }
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txDescription}>{item.description}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txAmount, item.amount > 0 ? styles.txPositive : styles.txNegative]}>
              {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  balanceCard: {
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.extrabold,
    marginBottom: spacing.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  balanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.voltage,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  balanceButtonText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  methodDetail: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  defaultTag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  defaultText: {
    color: colors.voltage,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 1,
  },
  transactionList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.border,
    gap: spacing.md,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconPositive: {
    backgroundColor: 'rgba(0,230,118,0.1)',
  },
  txIconNegative: {
    backgroundColor: 'rgba(255,61,61,0.1)',
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  txDate: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  txAmount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  txPositive: {
    color: colors.status.success,
  },
  txNegative: {
    color: colors.status.error,
  },
});
