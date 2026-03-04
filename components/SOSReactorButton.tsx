import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { colors, shadows, typography, spacing } from '@/theme';

interface SOSReactorButtonProps {
  onPress: () => void;
  size?: number;
}

export default function SOSReactorButton({
  onPress,
  size = 72,
}: SOSReactorButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
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

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim]);

  return (
    <View style={styles.well}>
      <Animated.View style={[styles.glowRing, { opacity: glowAnim }]}>
        <View style={[styles.glowInner, { width: size + 20, height: size + 20 }]} />
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityLabel="Emergency SOS button"
          accessibilityRole="button"
          accessibilityHint="Double tap to trigger emergency SOS"
          style={[
            styles.button,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <View style={[styles.innerGlow, { borderRadius: size / 2 }]} />
          <Text style={styles.text}>SOS</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.label}>EMERGENCY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  well: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  glowRing: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowInner: {
    borderRadius: 50,
    backgroundColor: 'rgba(255, 61, 61, 0.15)',
    ...shadows.emergencyGlow,
  },
  button: {
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    ...shadows.metalExtruded,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 61, 61, 0.15)',
  },
  text: {
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    letterSpacing: 4,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
