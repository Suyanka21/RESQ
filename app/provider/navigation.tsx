import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Navigation as NavIcon, Phone, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MapPlaceholder from '@/components/MapPlaceholder';
import { MapSkeleton } from '@/components/ui/LoadingStates';
import { GenericError } from '@/components/ui/ErrorStates';
import { announceForAccessibility, useReducedMotion } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView, GlassmorphicPanel } from '@/components/animations';
import { mediumHaptic, heavyHaptic } from '@/utils/haptics';

export default function ProviderNavigationScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), prefersReducedMotion ? 0 : 1200);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isLoading) {
      announceForAccessibility('Navigating to customer. Head North on Waiyaki Way. 1.2 kilometers, 3 minutes.');
    }
  }, [isLoading]);

  if (isLoading) {
    return <MapSkeleton />;
  }

  if (error) {
    return (
      <GenericError
        title="Navigation unavailable"
        message={error}
        onRetry={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 1200); }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Map with Route */}
      <View style={styles.map}>
        <MapPlaceholder showRoute showProvider />
      </View>

      {/* Flare-style Navigation Overlay */}
      <FadeInView delay={200}>
      <View style={styles.navOverlay}>
        <GlassmorphicPanel intensity="medium" radius="xl" style={styles.navCard}>
          <View style={styles.navRow}>
            <NavIcon size={24} color={colors.voltage} accessibilityElementsHidden />
            <View style={styles.navInfo}>
              <Text style={styles.navDirection} accessibilityRole="header">Head North on Waiyaki Way</Text>
              <Text style={styles.navDistance} accessibilityLiveRegion="polite">1.2 km - 3 min</Text>
            </View>
          </View>
        </GlassmorphicPanel>
      </View>
      </FadeInView>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />

        {/* Customer Info */}
        <View style={styles.customerRow}>
          <View
            style={styles.customerAvatar}
            accessibilityLabel="Customer avatar"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName} accessibilityRole="text">John Doe</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color={colors.text.tertiary} />
              <Text style={styles.locationText}>Westlands, Nairobi</Text>
            </View>
          </View>
          <AnimatedPressable
            onPress={() => mediumHaptic()}
            style={styles.callButton}
            accessibilityLabel="Call customer John Doe"
            accessibilityHint="Opens phone dialer to call the customer"
          >
            <Phone size={18} color={colors.text.onBrand} />
          </AnimatedPressable>
        </View>

        {/* ETA */}
        <GlassmorphicPanel intensity="light" radius="lg" style={styles.etaCard}>
          <View style={styles.etaRow} accessibilityRole="summary">
            <View accessible accessibilityLabel="Estimated time of arrival: 8 minutes">
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue} accessibilityLiveRegion="polite">8 MIN</Text>
            </View>
            <View accessible accessibilityLabel="Distance: 3.2 kilometers">
              <Text style={styles.etaLabel}>DISTANCE</Text>
              <Text style={styles.etaValue}>3.2 KM</Text>
            </View>
            <View accessible accessibilityLabel="Earning: KES 5,000">
              <Text style={styles.etaLabel}>EARNING</Text>
              <Text style={[styles.etaValue, { color: colors.status.success }]}>KES 5,000</Text>
            </View>
          </View>
        </GlassmorphicPanel>

        {/* Arrived Button */}
        <AnimatedPressable
          onPress={() => {
            heavyHaptic();
            router.replace('/provider/job-service');
          }}
          style={styles.arrivedButton}
          accessibilityLabel="I have arrived at the customer location"
          accessibilityHint="Confirms your arrival and starts the service"
        >
          <Text style={styles.arrivedText}>I Have Arrived</Text>
        </AnimatedPressable>
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
