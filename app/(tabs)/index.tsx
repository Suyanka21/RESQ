import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  Wrench,
  Battery,
  Stethoscope,
  Droplet,
  Disc,
  Headphones,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useRequestStore, ServiceType } from '@/stores/requestStore';
import SOSReactorButton from '@/components/SOSReactorButton';
import ServiceChip from '@/components/ServiceChip';
import MapPlaceholder from '@/components/MapPlaceholder';
import MetalSurface from '@/components/MetalSurface';
import { ServiceCardSkeleton } from '@/components/ui/LoadingStates';
import { GenericError } from '@/components/ui/ErrorStates';
import { OfflineQueueBanner } from '@/components/ui/OfflineExperience';
import { TOUCH_TARGET } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView, GlassmorphicPanel } from '@/components/animations';
import { mediumHaptic, heavyHaptic } from '@/utils/haptics';

const SERVICES: { id: ServiceType; label: string; icon: typeof Wrench; color: string }[] = [
  { id: 'towing', label: 'Towing', icon: Wrench, color: colors.service.towing },
  { id: 'battery', label: 'Battery', icon: Battery, color: colors.service.battery },
  { id: 'medical', label: 'Medical', icon: Stethoscope, color: colors.service.medical },
  { id: 'fuel', label: 'Fuel', icon: Droplet, color: colors.service.fuel },
  { id: 'tire', label: 'Tire', icon: Disc, color: colors.service.tire },
  { id: 'diagnostic', label: 'Diagnostic', icon: AlertTriangle, color: colors.service.diagnostic },
];

export default function DashboardScreen() {
  const router = useRouter();
  const setServiceType = useRequestStore((s) => s.setServiceType);
  const [activeService, setActiveService] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  useEffect(() => {
    // Simulate loading services data
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleDispatch = () => {
    if (activeService) {
      setServiceType(activeService);
      router.push('/customer/request-form');
    }
  };

  const handleSOS = () => {
    setServiceType('medical');
    router.push('/customer/request-form');
  };

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <MapPlaceholder />
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <MetalSurface variant="extruded" radius="full" style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>SYSTEM ONLINE</Text>
        </MetalSurface>
        <AnimatedPressable
          onPress={() => router.push('/customer/support')}
          style={styles.supportButton}
          accessibilityLabel="Contact support"
          accessibilityHint="Opens support and help options"
        >
          <Headphones size={20} color={colors.text.primary} />
        </AnimatedPressable>
      </View>

      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        <GlassmorphicPanel intensity="medium" radius="xxl" style={styles.panel}>
          {/* SOS Button */}
          <View style={styles.sosContainer}>
            <SOSReactorButton onPress={handleSOS} />
          </View>

          <OfflineQueueBanner queuedCount={offlineQueueCount} onPress={() => {}} />

          <View style={styles.panelContent}>
            <Text style={styles.sectionTitle}>Deploy Assistance</Text>
            <Text style={styles.sectionSubtitle}>Select required service unit</Text>

            {/* Service Grid */}
            {isLoading ? (
              <ServiceCardSkeleton count={6} />
            ) : error ? (
              <GenericError
                title="Failed to load services"
                message={error}
                onRetry={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 1200); }}
              />
            ) : (
              <View style={styles.serviceGrid}>
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <View key={service.id} style={styles.serviceCell}>
                      <ServiceChip
                        label={service.label}
                        icon={<Icon size={24} color={activeService === service.id ? colors.text.primary : colors.text.secondary} />}
                        color={service.color}
                        isActive={activeService === service.id}
                        onPress={() => setActiveService(activeService === service.id ? null : service.id)}
                      />
                    </View>
                  );
                })}
              </View>
            )}

            {/* Dispatch Button */}
            {activeService && (
              <FadeInView duration={200}>
                <AnimatedPressable
                  onPress={() => {
                    heavyHaptic();
                    handleDispatch();
                  }}
                  style={styles.dispatchButton}
                  accessibilityLabel="Confirm dispatch"
                >
                  <Text style={styles.dispatchText}>Confirm Dispatch</Text>
                </AnimatedPressable>
              </FadeInView>
            )}
          </View>
        </GlassmorphicPanel>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 2,
  },
  supportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.metalExtruded,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    zIndex: 20,
  },
  panel: {
    padding: spacing.lg,
  },
  sosContainer: {
    alignItems: 'center',
    marginTop: -48,
  },
  panelContent: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  serviceCell: {
    width: '30%',
    flexGrow: 1,
  },
  dispatchButton: {
    marginTop: spacing.lg,
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  dispatchText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
});
