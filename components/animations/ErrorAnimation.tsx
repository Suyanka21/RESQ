/**
 * ErrorAnimation - Animated error shake with haptic feedback
 * Provides clear error feedback with shake animation
 * Respects reduced motion preferences
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { colors } from '@/theme';
import { useReducedMotion } from '@/utils/accessibility';
import { errorHaptic } from '@/utils/haptics';
import { ANIMATION_DURATION, SPRING_CONFIG } from '@/utils/animations';

interface ErrorAnimationProps {
  size?: number;
  color?: string;
  onComplete?: () => void;
  autoTrigger?: boolean;
}

function ErrorAnimation({
  size = 80,
  color = colors.status.error,
  onComplete,
  autoTrigger = true,
}: ErrorAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const circleScale = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (!autoTrigger) return;

    errorHaptic();

    if (prefersReducedMotion) {
      circleScale.value = 1;
      iconScale.value = 1;
      glowOpacity.value = 0.3;
      if (onComplete) {
        const timer = setTimeout(onComplete, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Circle appears
    circleScale.value = withSpring(1, SPRING_CONFIG.bouncy);

    // Shake animation
    shakeX.value = withDelay(
      ANIMATION_DURATION.fast,
      withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(-3, { duration: 60 }),
        withTiming(0, { duration: 60 })
      )
    );

    // X icon appears
    iconScale.value = withDelay(
      ANIMATION_DURATION.fast,
      withSpring(1, SPRING_CONFIG.bouncy)
    );

    // Glow pulse
    glowOpacity.value = withDelay(
      ANIMATION_DURATION.fast,
      withSequence(
        withTiming(0.5, { duration: ANIMATION_DURATION.normal }),
        withTiming(0.15, { duration: ANIMATION_DURATION.deliberate })
      )
    );

    if (onComplete) {
      const timer = setTimeout(onComplete, ANIMATION_DURATION.deliberate + ANIMATION_DURATION.normal);
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, prefersReducedMotion, circleScale, shakeX, iconScale, glowOpacity, onComplete]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, shakeStyle]}>
      {/* Glow */}
      <Animated.View
        style={[
          styles.glow,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            backgroundColor: color,
          },
          glowStyle,
        ]}
      />

      {/* Circle */}
      <Animated.View style={circleStyle}>
        <Svg width={size} height={size} viewBox="0 0 80 80">
          <SvgCircle
            cx={40}
            cy={40}
            r={36}
            fill="none"
            stroke={color}
            strokeWidth={3}
          />
          <SvgCircle
            cx={40}
            cy={40}
            r={36}
            fill={`${color}15`}
          />
        </Svg>
      </Animated.View>

      {/* X icon */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, iconStyle]}>
        <Svg width={size * 0.4} height={size * 0.4} viewBox="0 0 32 32">
          <Path
            d="M10 10 L22 22 M22 10 L10 22"
            fill="none"
            stroke={color}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

export default React.memo(ErrorAnimation);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
