import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { WifiOff, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface OfflineQueueBannerProps {
  queuedCount: number;
  onPress?: () => void;
}

export default function OfflineQueueBanner({ queuedCount, onPress }: OfflineQueueBannerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  if (queuedCount === 0) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.banner}
      accessibilityLabel={`${queuedCount} requests queued offline`}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.iconContainer, { opacity: pulseAnim }]}>
        <WifiOff size={16} color={colors.status.warning} />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Offline Mode</Text>
        <Text style={styles.subtitle}>
          {queuedCount} request{queuedCount > 1 ? 's' : ''} queued
        </Text>
      </View>
      <ChevronRight size={16} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,152,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: colors.status.warning,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
});
