import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = 'Loading...',
}: LoadingStateProps) {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container} accessibilityLabel={message} accessibilityRole="progressbar">
      <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.dot, styles.dotMiddle, { opacity: pulseAnim }]} />
      <Animated.View style={[styles.dot, { opacity: pulseAnim }]} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.voltage,
    marginHorizontal: spacing.xs,
  },
  dotMiddle: {
    marginHorizontal: spacing.sm,
  },
  text: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.lg,
    fontWeight: typography.fontWeight.medium,
  },
});
