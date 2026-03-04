import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface SwipeConfirmProps {
  onConfirm: () => void;
  label?: string;
}

const THUMB_SIZE = 56;

export default function SwipeConfirm({
  onConfirm,
  label = 'Swipe to Confirm',
}: SwipeConfirmProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);
  const maxSlide = trackWidth - THUMB_SIZE - spacing.xs * 2;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(gestureState.dx, maxSlide));
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > maxSlide * 0.8) {
          Animated.spring(translateX, {
            toValue: maxSlide,
            useNativeDriver: true,
          }).start(() => onConfirm());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View
      style={styles.track}
      onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.thumb, { transform: [{ translateX }] }]}
      >
        <Text style={styles.arrow}>{'\u276F\u276F'}</Text>
      </Animated.View>
    </View>
  );
}

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
