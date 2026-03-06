/**
 * SwipeToDelete - Swipe gesture to reveal delete action
 * Provides swipe-to-delete functionality for list items
 * Respects reduced motion preferences
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { errorHaptic, mediumHaptic } from '@/utils/haptics';
import { SPRING_CONFIG, ANIMATION_DURATION } from '@/utils/animations';

interface SwipeToDeleteProps {
  children: React.ReactNode;
  onDelete: () => void;
  style?: StyleProp<ViewStyle>;
  threshold?: number;
}

function SwipeToDelete({
  children,
  onDelete,
  style,
  threshold = 80,
}: SwipeToDeleteProps) {
  const translateX = useSharedValue(0);
  const isDeleting = useSharedValue(false);

  const triggerDelete = useCallback(() => {
    errorHaptic();
    onDelete();
  }, [onDelete]);

  const triggerHaptic = useCallback(() => {
    mediumHaptic();
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow left swipe
      const clampedX = Math.min(0, Math.max(event.translationX, -threshold * 1.5));
      translateX.value = clampedX;

      if (clampedX < -threshold && !isDeleting.value) {
        isDeleting.value = true;
        runOnJS(triggerHaptic)();
      } else if (clampedX >= -threshold) {
        isDeleting.value = false;
      }
    })
    .onEnd(() => {
      if (translateX.value < -threshold) {
        translateX.value = withTiming(-300, { duration: ANIMATION_DURATION.normal }, () => {
          runOnJS(triggerDelete)();
        });
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG.snappy);
      }
      isDeleting.value = false;
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteActionStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, Math.abs(translateX.value) / threshold),
  }));

  return (
    <View style={[styles.container, style]}>
      {/* Delete action behind */}
      <Animated.View style={[styles.deleteAction, deleteActionStyle]}>
        <Trash2 size={20} color={colors.text.primary} />
        <Text style={styles.deleteText}>DELETE</Text>
      </Animated.View>

      {/* Swipeable content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={contentStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default React.memo(SwipeToDelete);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: colors.status.error,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  deleteText: {
    color: colors.text.primary,
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 2,
  },
});
