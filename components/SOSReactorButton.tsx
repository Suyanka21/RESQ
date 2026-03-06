import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors, shadows, typography, spacing } from '@/theme';
import { useReducedMotion, TOUCH_TARGET } from '@/utils/accessibility';
import { heavyHaptic } from '@/utils/haptics';
import { SPRING_CONFIG } from '@/utils/animations';

interface SOSReactorButtonProps {
  onPress: () => void;
  size?: number;
}

function SOSReactorButton({
  onPress,
  size = TOUCH_TARGET.EMERGENCY, // Minimum 80pt for emergency context (was 72)
}: SOSReactorButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  const pressScale = useSharedValue(1);

  const handlePress = useCallback(() => {
    heavyHaptic();
    onPress();
  }, [onPress]);

  useEffect(() => {
    // Respect prefers-reduced-motion - skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      pulseScale.value = 1;
      glowOpacity.value = 0.6; // Static glow for visibility without animation
      return;
    }

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [pulseScale, glowOpacity, prefersReducedMotion]);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      if (!prefersReducedMotion) {
        pressScale.value = withSpring(0.9, SPRING_CONFIG.press);
      }
    })
    .onFinalize(() => {
      'worklet';
      if (!prefersReducedMotion) {
        pressScale.value = withSpring(1, SPRING_CONFIG.press);
      }
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * pressScale.value }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.well}>
      <Animated.View style={[styles.glowRing, glowAnimStyle]}>
        <View style={[styles.glowInner, { width: size + 20, height: size + 20 }]} />
      </Animated.View>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={pulseAnimStyle}>
          <View
            accessibilityLabel="Emergency SOS - Request immediate help"
            accessibilityRole="button"
            accessibilityHint="Double tap to trigger emergency medical dispatch"
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
          </View>
        </Animated.View>
      </GestureDetector>
      <Text style={styles.label}>EMERGENCY</Text>
    </View>
  );
}

export default React.memo(SOSReactorButton);

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
    fontSize: 12, // Increased from 10 for readability - WCAG AA
    fontWeight: typography.fontWeight.bold,
    color: colors.text.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
