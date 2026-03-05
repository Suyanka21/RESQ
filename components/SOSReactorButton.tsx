import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, shadows, typography, spacing } from '@/theme';

interface SOSReactorButtonProps {
  onPress: () => void;
  size?: number;
}

function SOSReactorButton({
  onPress,
  size = 72,
}: SOSReactorButtonProps) {
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
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
  }, [pulseScale, glowOpacity]);

  const pulseAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowAnimStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.well}>
      <Animated.View style={[styles.glowRing, glowAnimStyle]}>
        <View style={[styles.glowInner, { width: size + 20, height: size + 20 }]} />
      </Animated.View>
      <Animated.View style={pulseAnimStyle}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityLabel="Emergency SOS button"
          accessibilityRole="button"
          accessibilityHint="Double tap to trigger emergency SOS"
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
        </TouchableOpacity>
      </Animated.View>
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
    fontSize: 10,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.tertiary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
});
