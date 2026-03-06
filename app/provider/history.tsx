import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, CheckCircle } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { HistoryItemSkeleton } from '@/components/ui/LoadingStates';
import { EmptyHistory } from '@/components/ui/EmptyStates';
import { GenericError } from '@/components/ui/ErrorStates';
import { AnimatedPressable, FadeInView, PullToRefresh } from '@/components/animations';
import { lightHaptic } from '@/utils/haptics';

const MOCK_JOBS = [
  { id: '1', service: 'Towing', customer: 'John D.', date: 'Jan 30, 2026', amount: 4250, location: 'Westlands', duration: '45 min' },
  { id: '2', service: 'Battery Jump', customer: 'Alice M.', date: 'Jan 29, 2026', amount: 1125, location: 'CBD', duration: '20 min' },
  { id: '3', service: 'Tire Change', customer: 'Bob K.', date: 'Jan 28, 2026', amount: 1500, location: 'Kilimani', duration: '30 min' },
  { id: '4', service: 'Towing', customer: 'Grace W.', date: 'Jan 27, 2026', amount: 4250, location: 'Parklands', duration: '50 min' },
];

const JOB_ITEM_HEIGHT = 140;
const jobKeyExtractor = (item: typeof MOCK_JOBS[0]) => item.id;
const getJobItemLayout = (_data: ArrayLike<any> | null | undefined, index: number) => ({
  length: JOB_ITEM_HEIGHT,
  offset: JOB_ITEM_HEIGHT * index,
  index,
});

export default function ProviderHistoryScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }, []);

  const renderJobItem = useCallback(({ item, index }: { item: typeof MOCK_JOBS[0]; index: number }) => (
    <FadeInView delay={index * 80}>
      <MetalSurface variant="extruded" radius="lg" style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.serviceTag}>
            <Text style={styles.serviceText}>{item.service}</Text>
          </View>
          <Text style={styles.amountText}>KES {item.amount.toLocaleString()}</Text>
        </View>
        <Text style={styles.customerText}>{item.customer}</Text>
        <View style={styles.infoRow}>
          <MapPin size={12} color={colors.text.tertiary} />
          <Text style={styles.infoText}>{item.location}</Text>
          <Clock size={12} color={colors.text.tertiary} />
          <Text style={styles.infoText}>{item.duration}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.dateText}>{item.date}</Text>
          <View style={styles.statusBadge}>
            <CheckCircle size={12} color={colors.status.success} />
            <Text style={styles.statusText}>Completed</Text>
          </View>
        </View>
      </MetalSurface>
    </FadeInView>
  ), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <AnimatedPressable
            onPress={() => {
              lightHaptic();
              router.back();
            }}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={20} color={colors.text.primary} />
          </AnimatedPressable>
          <Text style={styles.headerTitle}>Job History</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={{ paddingHorizontal: spacing.lg }}>
          <HistoryItemSkeleton />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <GenericError
        title="Failed to load job history"
        message={error}
        onRetry={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 1000); }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => {
            lightHaptic();
            router.back();
          }}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle}>Job History</Text>
        <View style={{ width: 40 }} />
      </View>

      {MOCK_JOBS.length === 0 ? (
        <EmptyHistory />
      ) : (
        <PullToRefresh onRefresh={handleRefresh}>
          {(refreshControl) => (
            <FlatList
              data={MOCK_JOBS}
              keyExtractor={jobKeyExtractor}
              contentContainerStyle={styles.list}
              renderItem={renderJobItem}
              getItemLayout={getJobItemLayout}
              removeClippedSubviews
              maxToRenderPerBatch={10}
              windowSize={5}
              refreshControl={refreshControl}
            />
          )}
        </PullToRefresh>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  list: { padding: spacing.lg, gap: spacing.md },
  card: { padding: spacing.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  serviceTag: { backgroundColor: colors.background.tertiary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.sm },
  serviceText: { color: colors.voltage, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 1, textTransform: 'uppercase' },
  amountText: { color: colors.status.success, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  customerText: { color: colors.text.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  infoText: { color: colors.text.tertiary, fontSize: typography.fontSize.xs, marginRight: spacing.md },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { color: colors.text.tertiary, fontSize: typography.fontSize.xs },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statusText: { color: colors.status.success, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold },
});
