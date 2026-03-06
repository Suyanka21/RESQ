/**
 * SuccessAnimation - Animated checkmark bounce on completion
 * Provides delightful success feedback with haptics
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
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { colors, shadows } from '@/theme';
import { useReducedMotion } from '@/utils/accessibility';
import { successHaptic } from '@/utils/haptics';
import { ANIMATION_DURATION, SPRING_CONFIG } from '@/utils/animations';

const AnimatedSvgPath = Animated.createAnimatedComponent(Path);

interface SuccessAnimationProps {
  size?: number;
  color?: string;
  onComplete?: () => void;
  autoTrigger?: boolean;
}

function SuccessAnimation({
  size = 80,
  color = colors.status.success,
  onComplete,
  autoTrigger = true,
}: SuccessAnimationProps) {
  const prefersReducedMotion = useReducedMotion();
  const circleScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const bounceScale = useSharedValue(1);

  useEffect(() => {
    if (!autoTrigger) return;

    successHaptic();

    if (prefersReducedMotion) {
      circleScale.value = 1;
      checkScale.value = 1;
      glowOpacity.value = 0.3;
      if (onComplete) {
        const timer = setTimeout(onComplete, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Circle appears
    circleScale.value = withSpring(1, SPRING_CONFIG.bouncy);

    // Checkmark bounces in
    checkScale.value = withDelay(
      ANIMATION_DURATION.fast,
      withSequence(
        withSpring(1.2, SPRING_CONFIG.bouncy),
        withSpring(1, SPRING_CONFIG.gentle)
      )
    );

    // Glow pulse
    glowOpacity.value = withDelay(
      ANIMATION_DURATION.fast,
      withSequence(
        withTiming(0.6, { duration: ANIMATION_DURATION.normal }),
        withTiming(0.2, { duration: ANIMATION_DURATION.deliberate })
      )
    );

    // Overall bounce
    bounceScale.value = withDelay(
      ANIMATION_DURATION.normal,
      withSequence(
        withSpring(1.1, SPRING_CONFIG.bouncy),
        withSpring(1, SPRING_CONFIG.gentle)
      )
    );

    if (onComplete) {
      const timer = setTimeout(onComplete, ANIMATION_DURATION.deliberate + ANIMATION_DURATION.normal);
      return () => clearTimeout(timer);
    }
  }, [autoTrigger, prefersReducedMotion, circleScale, checkScale, glowOpacity, bounceScale, onComplete]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounceScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
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

      {/* Checkmark */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, checkStyle]}>
        <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 40 40">
          <Path
            d="M10 20 L17 27 L30 14"
            fill="none"
            stroke={color}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

export default React.memo(SuccessAnimation);

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
