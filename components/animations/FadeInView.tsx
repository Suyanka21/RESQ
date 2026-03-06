/**
 * FadeInView - Animated wrapper for list items and content
 * Provides smooth fade-in with optional slide-up on appearance
 * Respects reduced motion preferences
 */

import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/utils/accessibility';
import { ANIMATION_DURATION, EASING } from '@/utils/animations';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  duration?: number;
  slideDistance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

function FadeInView({
  children,
  style,
  delay = 0,
  duration = ANIMATION_DURATION.smooth,
  slideDistance = 16,
  direction = 'up',
}: FadeInViewProps) {
  const prefersReducedMotion = useReducedMotion();
  const opacity = useSharedValue(prefersReducedMotion ? 1 : 0);
  const translate = useSharedValue(prefersReducedMotion ? 0 : slideDistance);

  useEffect(() => {
    if (prefersReducedMotion) {
      opacity.value = 1;
      translate.value = 0;
      return;
    }

    opacity.value = withDelay(
      delay,
      withTiming(1, { duration, easing: EASING.decelerate })
    );

    translate.value = withDelay(
      delay,
      withTiming(0, { duration, easing: EASING.decelerate })
    );
  }, [prefersReducedMotion, delay, duration, opacity, translate]);

  const animatedStyle = useAnimatedStyle(() => {
    const transformProp =
      direction === 'up' || direction === 'down'
        ? { translateY: direction === 'up' ? translate.value : -translate.value }
        : { translateX: direction === 'left' ? translate.value : -translate.value };

    return {
      opacity: opacity.value,
      transform: [transformProp],
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

export default React.memo(FadeInView);
