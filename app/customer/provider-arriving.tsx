import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import ProviderCard from '@/components/ProviderCard';

export default function ProviderArrivingScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // High-frequency pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-advance
    const timer = setTimeout(() => {
      router.replace('/customer/service-in-progress');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Arriving Indicator */}
        <Animated.View style={[styles.indicator, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.indicatorInner}>
            <MapPin size={32} color={colors.voltage} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Provider Arriving</Text>
        <Text style={styles.subtitle}>Your provider is almost at your location</Text>

        {/* Provider Info */}
        <View style={styles.cardContainer}>
          <ProviderCard
            name="James Mwangi"
            rating={4.9}
            vehicle="Toyota Hilux"
            plate="KDA 123A"
            eta={1}
          />
        </View>

        {/* Action */}
        <TouchableOpacity
          style={styles.callButton}
          accessibilityLabel="Call provider"
          accessibilityRole="button"
        >
          <Phone size={18} color={colors.text.onBrand} />
          <Text style={styles.callText}>Call Provider</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/customer/service-in-progress')}
          style={styles.arrivedButton}
          accessibilityLabel="Provider has arrived"
          accessibilityRole="button"
        >
          <Text style={styles.arrivedText}>Provider Has Arrived</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  indicator: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,165,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.glow,
  },
  indicatorInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  callText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  arrivedButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  arrivedText: {
    color: colors.status.success,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
