import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { useScreenReader } from '@/utils/accessibility';

interface SwipeConfirmProps {
  onConfirm: () => void;
  label?: string;
}

const THUMB_SIZE = 56;

function SwipeConfirm({
  onConfirm,
  label = 'Swipe to Confirm',
}: SwipeConfirmProps) {
  const isScreenReaderActive = useScreenReader();
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

  // When screen reader is active, provide a simple button alternative
  // since swipe gestures are not accessible to screen reader users
  if (isScreenReaderActive) {
    return (
      <TouchableOpacity
        onPress={onConfirm}
        style={styles.track}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityHint="Double tap to confirm"
      >
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={styles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      accessibilityLabel={label}
      accessibilityHint="Swipe right to confirm"
      accessibilityRole="button"
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
