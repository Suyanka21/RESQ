import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Clock, DollarSign, User, History, Headphones } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useProviderStore } from '@/stores/providerStore';
import MapPlaceholder from '@/components/MapPlaceholder';
import MetalSurface from '@/components/MetalSurface';

export default function ProviderDashboardScreen() {
  const router = useRouter();
  const { isAvailable, setAvailable, earnings, rating, completedJobs } = useProviderStore();
  const [showDispatch, setShowDispatch] = useState(false);

  const handleToggle = (value: boolean) => {
    setAvailable(value);
    if (value) {
      // Simulate incoming job after toggling on
      setTimeout(() => {
        router.push('/provider/dispatch');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <MapPlaceholder />
        {/* Heatmap overlay simulation */}
        <View style={styles.heatmapOverlay}>
          <View style={[styles.heatDot, { top: '30%', left: '40%', backgroundColor: 'rgba(255,165,0,0.3)' }]} />
          <View style={[styles.heatDot, { top: '50%', left: '60%', backgroundColor: 'rgba(255,165,0,0.2)' }]} />
          <View style={[styles.heatDot, { top: '40%', left: '25%', backgroundColor: 'rgba(255,61,61,0.2)' }]} />
        </View>
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <MetalSurface variant="extruded" radius="full" style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: isAvailable ? colors.status.success : colors.status.error }]} />
          <Text style={styles.statusText}>{isAvailable ? 'ONLINE' : 'OFFLINE'}</Text>
        </MetalSurface>
        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => router.push('/provider/support')}
            style={styles.actionButton}
            accessibilityLabel="Support"
            accessibilityRole="button"
          >
            <Headphones size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Availability Toggle */}
        <MetalSurface variant="glass" radius="xxl" style={styles.panel}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {isAvailable ? 'Accepting Jobs' : 'Go Online'}
            </Text>
            <Switch
              value={isAvailable}
              onValueChange={handleToggle}
              trackColor={{ false: colors.background.border, true: colors.voltage }}
              thumbColor={colors.text.primary}
              accessibilityLabel="Availability toggle"
              accessibilityRole="switch"
            />
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>KES {earnings.today.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedJobs}</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </MetalSurface>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} accessibilityLabel="Dashboard">
            <MapPin size={20} color={colors.voltage} />
            <Text style={[styles.navText, { color: colors.voltage }]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/provider/earnings')}
            style={styles.navItem}
            accessibilityLabel="Earnings"
          >
            <DollarSign size={20} color={colors.text.tertiary} />
            <Text style={styles.navText}>Earnings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/provider/history')}
            style={styles.navItem}
            accessibilityLabel="History"
          >
            <History size={20} color={colors.text.tertiary} />
            <Text style={styles.navText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/provider/profile')}
            style={styles.navItem}
            accessibilityLabel="Profile"
          >
            <User size={20} color={colors.text.tertiary} />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBackground },
  mapContainer: { ...StyleSheet.absoluteFillObject },
  heatmapOverlay: { ...StyleSheet.absoluteFillObject },
  heatDot: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    zIndex: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  statusText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.text.primary, letterSpacing: 2 },
  topActions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.base,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.metalExtruded,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  panel: { marginHorizontal: spacing.md, marginBottom: spacing.md, padding: spacing.lg },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  toggleLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  statsGrid: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.extrabold },
  statLabel: { color: colors.text.tertiary, fontSize: typography.fontSize.xs, marginTop: spacing.xs },
  statDivider: { width: 1, height: 32, backgroundColor: colors.background.border },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.base,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  navItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  navText: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 1 },
});
