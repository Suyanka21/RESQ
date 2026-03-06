/**
 * VoltageGlow - Animated glow effect for active/selected elements
 * Creates the signature Voltage Orange backlight effect
 * Respects reduced motion preferences
 */

import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme';
import { useReducedMotion } from '@/utils/accessibility';
import { ANIMATION_DURATION } from '@/utils/animations';

interface VoltageGlowProps {
  active: boolean;
  color?: string;
  intensity?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

function VoltageGlow({
  active,
  color = colors.voltage,
  intensity = 0.6,
  size = 20,
  style,
  children,
}: VoltageGlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      glowOpacity.value = withTiming(0, { duration: ANIMATION_DURATION.fast });
      glowScale.value = withTiming(1, { duration: ANIMATION_DURATION.fast });
      return;
    }

    if (prefersReducedMotion) {
      glowOpacity.value = intensity;
      glowScale.value = 1;
      return;
    }

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(intensity, {
          duration: ANIMATION_DURATION.ambient,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(intensity * 0.4, {
          duration: ANIMATION_DURATION.ambient,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: ANIMATION_DURATION.ambient,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: ANIMATION_DURATION.ambient,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [active, prefersReducedMotion, intensity, glowOpacity, glowScale]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Animated.View style={[style]}>
      {children}
      {active && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -size / 2,
              left: -size / 2,
              right: -size / 2,
              bottom: -size / 2,
              borderRadius: 999,
              backgroundColor: color,
              zIndex: -1,
            },
            glowStyle,
          ]}
          pointerEvents="none"
        />
      )}
    </Animated.View>
  );
}

export default React.memo(VoltageGlow);
