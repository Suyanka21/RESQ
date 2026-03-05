import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface SwipeConfirmProps {
  onConfirm: () => void;
  label?: string;
}

const THUMB_SIZE = 56;

function SwipeConfirm({
  onConfirm,
  label = 'Swipe to Confirm',
}: SwipeConfirmProps) {
  const translateX = useSharedValue(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const maxSlide = trackWidth - THUMB_SIZE - spacing.xs * 2;

  const triggerConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (maxSlide <= 0) return;
      translateX.value = Math.max(0, Math.min(event.translationX, maxSlide));
    })
    .onEnd((event) => {
      if (maxSlide <= 0) return;
      if (event.translationX > maxSlide * 0.8) {
        translateX.value = withSpring(maxSlide, { damping: 15, stiffness: 150 }, () => {
          runOnJS(triggerConfirm)();
        });
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const thumbAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={styles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Text style={styles.label}>{label}</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.thumb, thumbAnimStyle]}
        >
          <Text style={styles.arrow}>{'\u276F\u276F'}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default React.memo(SwipeConfirm);

const styles = StyleSheet.create({
  track: {
    height: THUMB_SIZE + spacing.xs * 2,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: colors.background.border,
    overflow: 'hidden',
  },
  label: {
    position: 'absolute',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  thumb: {
    position: 'absolute',
    left: spacing.xs,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.voltage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
