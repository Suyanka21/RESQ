/**
 * VoltageSpinner - Custom ResQ-branded loading spinner
 * Animated hexagonal shield spinner with voltage glow
 * Respects reduced motion preferences
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography, spacing } from '@/theme';
import { useReducedMotion } from '@/utils/accessibility';
import { ANIMATION_DURATION } from '@/utils/animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface VoltageSpinnerProps {
  size?: number;
  message?: string;
  color?: string;
}

function VoltageSpinner({
  size = 64,
  message,
  color = colors.voltage,
}: VoltageSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();
  const rotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (prefersReducedMotion) {
      pulseScale.value = 1;
      glowOpacity.value = 0.6;
      return;
    }

    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: ANIMATION_DURATION.ambient, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: ANIMATION_DURATION.ambient, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: ANIMATION_DURATION.ambient, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: ANIMATION_DURATION.ambient, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    return () => {
      cancelAnimation(rotation);
      cancelAnimation(pulseScale);
      cancelAnimation(glowOpacity);
    };
  }, [prefersReducedMotion, rotation, pulseScale, glowOpacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: glowOpacity.value,
  }));

  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View
      style={styles.container}
      accessibilityLabel={message || 'Loading'}
      accessibilityRole="progressbar"
    >
      {/* Glow backdrop */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 20,
            height: size + 20,
            borderRadius: (size + 20) / 2,
            backgroundColor: color,
          },
          pulseStyle,
        ]}
      />

      {/* Spinning ring */}
      <Animated.View style={[{ width: size, height: size }, ringStyle]}>
        <Svg width={size} height={size}>
          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Animated arc */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference * 0.3} ${circumference * 0.7}`}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {/* Center dot */}
      <View
        style={[
          styles.centerDot,
          {
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: size * 0.075,
            backgroundColor: color,
          },
        ]}
      />

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

export default React.memo(VoltageSpinner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  centerDot: {
    position: 'absolute',
  },
  message: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginTop: spacing.lg,
  },
});
