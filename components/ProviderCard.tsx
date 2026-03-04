import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Shield } from 'lucide-react-native';

interface ProviderCardProps {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  eta: number;
  isVerified?: boolean;
}

export default function ProviderCard({
  name,
  rating,
  vehicle,
  plate,
  eta,
  isVerified = true,
}: ProviderCardProps) {
  return (
    <View style={styles.card} accessibilityLabel={`Provider ${name}, rated ${rating} stars, ETA ${eta} minutes`}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isVerified && (
              <View style={styles.badge}>
                <Shield size={12} color={colors.status.success} />
              </View>
            )}
          </View>
          <Text style={styles.detail}>{vehicle} - {plate}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{'\u2605'} {rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.etaBox}>
          <Text style={styles.etaValue}>{eta}</Text>
          <Text style={styles.etaLabel}>MIN</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.voltage,
  },
  avatarText: {
    color: colors.voltage,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    marginLeft: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,230,118,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detail: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    color: colors.voltage,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  etaBox: {
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  etaValue: {
    color: colors.voltage,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.extrabold,
  },
  etaLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
