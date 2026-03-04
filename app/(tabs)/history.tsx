import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import EmptyState from '@/components/EmptyState';

const MOCK_HISTORY = [
  { id: '1', service: 'Towing', date: '2026-01-28', price: 5000, status: 'completed', location: 'Westlands, Nairobi' },
  { id: '2', service: 'Battery Jump', date: '2026-01-15', price: 1500, status: 'completed', location: 'CBD, Nairobi' },
  { id: '3', service: 'Tire Change', date: '2026-01-02', price: 2000, status: 'completed', location: 'Kilimani, Nairobi' },
];

export default function HistoryScreen() {
  if (MOCK_HISTORY.length === 0) {
    return <EmptyState title="No History" message="Your service history will appear here." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Service History</Text>
        <Text style={styles.subtitle}>{MOCK_HISTORY.length} completed services</Text>
      </View>

      <FlatList
        data={MOCK_HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MetalSurface variant="extruded" radius="lg" style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.serviceTag}>
                <Text style={styles.serviceText}>{item.service}</Text>
              </View>
              <Text style={styles.priceText}>KES {item.price.toLocaleString()}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <MapPin size={14} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Clock size={14} color={colors.text.tertiary} />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </MetalSurface>
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
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  serviceTag: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  serviceText: {
    color: colors.voltage,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  priceText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  cardBody: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
  },
  statusText: {
    color: colors.status.success,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});
