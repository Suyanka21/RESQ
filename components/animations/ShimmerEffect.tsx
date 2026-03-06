/**
 * ShimmerEffect - Enhanced skeleton loading with shimmer animation
 * Provides a premium shimmer/shine effect over skeleton placeholders
 * Respects reduced motion preferences
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius as br } from '@/theme';
import { useReducedMotion } from '@/utils/accessibility';

interface ShimmerEffectProps {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

function ShimmerEffect({
  width,
  height,
  borderRadius = br.md,
  style,
}: ShimmerEffectProps) {
  const prefersReducedMotion = useReducedMotion();
  const translateX = useSharedValue(-1);

  useEffect(() => {
    if (prefersReducedMotion) return;

    translateX.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, [prefersReducedMotion, translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 200 }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      {!prefersReducedMotion && (
        <Animated.View style={[styles.shimmer, shimmerStyle]}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.08)',
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default React.memo(ShimmerEffect);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    width: '200%',
  },
  gradient: {
    flex: 1,
  },
});
