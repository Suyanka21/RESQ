import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Clock, DollarSign, Navigation } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useProviderStore } from '@/stores/providerStore';
import MetalSurface from '@/components/MetalSurface';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DispatchScreen() {
  const router = useRouter();
  const { setJobStatus, setCurrentJob } = useProviderStore();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleAccept = () => {
    setJobStatus('accepted');
    setCurrentJob({
      id: 'job-1',
      customerName: 'John Doe',
      customerPhone: '+254712345678',
      serviceType: 'towing',
      location: { latitude: -1.2921, longitude: 36.8219, address: 'Westlands, Nairobi' },
      price: 5000,
      distance: 3.2,
      eta: 8,
    });
    router.replace('/provider/navigation');
  };

  const handleDecline = () => {
    setJobStatus('idle');
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Semi-transparent backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleDecline}
      />

      <Animated.View style={[styles.overlay, { transform: [{ translateY: slideAnim }] }]}>
        {/* Incoming Call Style Header */}
        <View style={styles.incomingHeader}>
          <Text style={styles.incomingLabel}>INCOMING JOB</Text>
          <Text style={styles.serviceType}>TOWING</Text>
        </View>

        {/* Job Details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <MapPin size={18} color={colors.voltage} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Pickup Location</Text>
              <Text style={styles.detailValue}>Westlands, Nairobi</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Navigation size={18} color={colors.status.info} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>3.2 km</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Clock size={18} color={colors.text.secondary} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Estimated Time</Text>
              <Text style={styles.detailValue}>8 min</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <DollarSign size={18} color={colors.status.success} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Earnings</Text>
              <Text style={styles.earningsValue}>KES 5,000</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }], flex: 1 }}>
            <TouchableOpacity
              onPress={handleAccept}
              style={styles.acceptButton}
              accessibilityLabel="Accept job"
              accessibilityRole="button"
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </Animated.View>
          <TouchableOpacity
            onPress={handleDecline}
            style={styles.declineButton}
            accessibilityLabel="Decline job"
            accessibilityRole="button"
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    minHeight: SCREEN_HEIGHT * 0.4,
  },
  incomingHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  incomingLabel: {
    color: colors.voltage,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 4,
    marginBottom: spacing.xs,
  },
  serviceType: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.extrabold,
    letterSpacing: 4,
  },
  details: { gap: spacing.md, marginBottom: spacing.xl },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  detailInfo: { flex: 1 },
  detailLabel: { color: colors.text.tertiary, fontSize: typography.fontSize.xs },
  detailValue: { color: colors.text.primary, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
  earningsValue: { color: colors.status.success, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.extrabold },
  actions: { flexDirection: 'row', gap: spacing.md },
  acceptButton: {
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.glow,
  },
  acceptText: { color: colors.text.onBrand, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 3 },
  declineButton: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  declineText: { color: colors.status.error, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
});
