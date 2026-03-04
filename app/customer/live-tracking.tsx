import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MapPlaceholder from '@/components/MapPlaceholder';
import ProviderCard from '@/components/ProviderCard';

export default function LiveTrackingScreen() {
  const router = useRouter();
  const etaAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    // Simulate ETA countdown
    const timer = setTimeout(() => {
      router.replace('/customer/provider-arriving');
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.map}>
        <MapPlaceholder showRoute showProvider />
      </View>

      {/* ETA Banner */}
      <View style={styles.etaBanner}>
        <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
        <Text style={styles.etaValue}>8 MIN</Text>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />
        <Text style={styles.statusText}>Provider is on the way</Text>

        <ProviderCard
          name="James Mwangi"
          rating={4.9}
          vehicle="Toyota Hilux"
          plate="KDA 123A"
          eta={8}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.callButton}
            accessibilityLabel="Call provider"
            accessibilityRole="button"
          >
            <Phone size={18} color={colors.text.onBrand} />
            <Text style={styles.callText}>Call Provider</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
  map: {
    flex: 1,
  },
  etaBanner: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    backgroundColor: colors.base,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    zIndex: 10,
    ...shadows.metalExtruded,
  },
  etaLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
  etaValue: {
    color: colors.voltage,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.extrabold,
  },
  bottomPanel: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.background.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.background.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  actions: {
    marginTop: spacing.lg,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    ...shadows.glow,
  },
  callText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
