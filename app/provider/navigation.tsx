import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Navigation as NavIcon, Phone, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MapPlaceholder from '@/components/MapPlaceholder';
import MetalSurface from '@/components/MetalSurface';

export default function ProviderNavigationScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Map with Route */}
      <View style={styles.map}>
        <MapPlaceholder showRoute showProvider />
      </View>

      {/* Flare-style Navigation Overlay */}
      <View style={styles.navOverlay}>
        <MetalSurface variant="glass" radius="xl" style={styles.navCard}>
          <View style={styles.navRow}>
            <NavIcon size={24} color={colors.voltage} />
            <View style={styles.navInfo}>
              <Text style={styles.navDirection}>Head North on Waiyaki Way</Text>
              <Text style={styles.navDistance}>1.2 km - 3 min</Text>
            </View>
          </View>
        </MetalSurface>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />

        {/* Customer Info */}
        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>John Doe</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.text.tertiary} />
              <Text style={styles.locationText}>Westlands, Nairobi</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.callButton}
            accessibilityLabel="Call customer"
            accessibilityRole="button"
          >
            <Phone size={18} color={colors.text.onBrand} />
          </TouchableOpacity>
        </View>

        {/* ETA */}
        <MetalSurface variant="glass" radius="lg" style={styles.etaCard}>
          <View style={styles.etaRow}>
            <View>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>8 MIN</Text>
            </View>
            <View>
              <Text style={styles.etaLabel}>DISTANCE</Text>
              <Text style={styles.etaValue}>3.2 KM</Text>
            </View>
            <View>
              <Text style={styles.etaLabel}>EARNING</Text>
              <Text style={[styles.etaValue, { color: colors.status.success }]}>KES 5,000</Text>
            </View>
          </View>
        </MetalSurface>

        {/* Arrived Button */}
        <TouchableOpacity
          onPress={() => router.replace('/provider/job-service')}
          style={styles.arrivedButton}
          accessibilityLabel="I have arrived"
          accessibilityRole="button"
        >
          <Text style={styles.arrivedText}>I Have Arrived</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mapBackground },
  map: { flex: 1 },
  navOverlay: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 10,
  },
  navCard: { padding: spacing.md },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  navInfo: { flex: 1 },
  navDirection: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  navDistance: { color: colors.text.secondary, fontSize: typography.fontSize.xs, marginTop: 2 },
  bottomPanel: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
  },
  handle: { width: 40, height: 4, backgroundColor: colors.background.border, borderRadius: 2, alignSelf: 'center', marginBottom: spacing.lg },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  customerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.status.info,
  },
  avatarText: { color: colors.status.info, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  customerInfo: { flex: 1 },
  customerName: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  locationText: { color: colors.text.tertiary, fontSize: typography.fontSize.xs },
  callButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.voltage,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.glow,
  },
  etaCard: { padding: spacing.md, marginBottom: spacing.lg },
  etaRow: { flexDirection: 'row', justifyContent: 'space-around' },
  etaLabel: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 1 },
  etaValue: { color: colors.voltage, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.extrabold, marginTop: spacing.xs },
  arrivedButton: {
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  arrivedText: { color: colors.text.onBrand, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
});
