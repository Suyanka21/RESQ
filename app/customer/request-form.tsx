import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows, PRICES } from '@/theme';
import { useRequestStore } from '@/stores/requestStore';
import SwipeConfirm from '@/components/SwipeConfirm';
import MetalSurface from '@/components/MetalSurface';

const SERVICE_PRICES: Record<string, number> = {
  towing: PRICES.TOWING_BASE,
  battery: PRICES.JUMPSTART_BASE,
  medical: PRICES.AMBULANCE_BASE,
  fuel: PRICES.FUEL_BASE,
  tire: PRICES.TIRE_BASE,
  diagnostic: PRICES.DIAGNOSTICS_BASE,
};

export default function RequestFormScreen() {
  const router = useRouter();
  const { serviceType, setDescription, setPrice } = useRequestStore();
  const [description, setDesc] = useState('');
  const [location, setLocation] = useState('Current Location - Westlands, Nairobi');

  const price = SERVICE_PRICES[serviceType || 'towing'] || PRICES.TOWING_BASE;

  const handleConfirm = () => {
    setDescription(description);
    setPrice(price);
    router.push('/customer/searching');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {/* Service Type */}
        <MetalSurface variant="extruded" radius="lg" style={styles.card}>
          <Text style={styles.cardLabel}>SERVICE TYPE</Text>
          <Text style={styles.cardValue}>{(serviceType || 'towing').toUpperCase()}</Text>
        </MetalSurface>

        {/* Location */}
        <MetalSurface variant="sunken" radius="lg" style={styles.inputCard}>
          <View style={styles.inputRow}>
            <MapPin size={18} color={colors.voltage} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </MetalSurface>

        {/* Description */}
        <MetalSurface variant="sunken" radius="lg" style={styles.inputCard}>
          <Text style={styles.inputLabel}>DESCRIPTION (OPTIONAL)</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDesc}
            placeholder="Describe the issue..."
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
            accessibilityLabel="Description input"
          />
        </MetalSurface>

        {/* Price Summary */}
        <MetalSurface variant="glass" radius="lg" style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Estimated Price</Text>
            <Text style={styles.priceValue}>KES {price.toLocaleString()}</Text>
          </View>
          <Text style={styles.priceNote}>Fixed upfront pricing - no hidden charges</Text>
        </MetalSurface>
      </ScrollView>

      {/* Swipe to Confirm */}
      <View style={styles.footer}>
        <SwipeConfirm onConfirm={handleConfirm} label="Swipe to Confirm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
  },
  cardLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  cardValue: {
    color: colors.voltage,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 3,
  },
  inputCard: {
    padding: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    flex: 1,
  },
  inputLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  textInput: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  priceCard: {
    padding: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  priceValue: {
    color: colors.voltage,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extrabold,
  },
  priceNote: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
