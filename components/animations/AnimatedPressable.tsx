/**
 * AnimatedPressable - Universal button press animation component
 * Provides scale-down animation on press with haptic feedback
 * Respects reduced motion preferences
 */

import React, { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useReducedMotion } from '@/utils/accessibility';
import { SPRING_CONFIG, SCALE } from '@/utils/animations';
import { mediumHaptic } from '@/utils/haptics';

interface AnimatedPressableProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  hapticEnabled?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link' | 'tab';
  accessibilityHint?: string;
  accessibilityState?: Record<string, boolean | undefined>;
}

function AnimatedPressable({
  children,
  onPress,
  style,
  scaleValue = SCALE.pressed,
  hapticEnabled = true,
  disabled = false,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  accessibilityState,
}: AnimatedPressableProps) {
  const prefersReducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (hapticEnabled) {
      mediumHaptic();
    }
    onPress();
  }, [disabled, hapticEnabled, onPress]);

  const tapGesture = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      'worklet';
      if (!prefersReducedMotion) {
        scale.value = withSpring(scaleValue, SPRING_CONFIG.press);
      }
    })
    .onFinalize(() => {
      'worklet';
      if (!prefersReducedMotion) {
        scale.value = withSpring(1, SPRING_CONFIG.press);
      }
    })
    .onEnd(() => {
      'worklet';
      runOnJS(handlePress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[animatedStyle, style]}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityHint={accessibilityHint}
        accessibilityState={accessibilityState}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default React.memo(AnimatedPressable);
