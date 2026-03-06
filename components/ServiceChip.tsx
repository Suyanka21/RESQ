import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors, shadows, typography, spacing, borderRadius } from '@/theme';
import { AnimatedPressable } from '@/components/animations';
import { selectionHaptic } from '@/utils/haptics';
import { useReducedMotion } from '@/utils/accessibility';
import { ANIMATION_DURATION, SPRING_CONFIG } from '@/utils/animations';

interface ServiceChipProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

function ServiceChip({
  label,
  icon,
  color,
  isActive,
  onPress,
}: ServiceChipProps) {
  const prefersReducedMotion = useReducedMotion();
  const glowOpacity = useSharedValue(0);
  const backlightWidth = useSharedValue(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      glowOpacity.value = isActive ? 0.3 : 0;
      backlightWidth.value = isActive ? 1 : 0;
      return;
    }

    glowOpacity.value = withTiming(isActive ? 0.3 : 0, {
      duration: ANIMATION_DURATION.normal,
      easing: Easing.inOut(Easing.ease),
    });
    backlightWidth.value = withSpring(isActive ? 1 : 0, SPRING_CONFIG.snappy);
  }, [isActive, prefersReducedMotion, glowOpacity, backlightWidth]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const backlightStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: backlightWidth.value }],
    opacity: backlightWidth.value,
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        selectionHaptic();
        onPress();
      }}
      accessibilityLabel={`${label} service`}
      accessibilityHint={isActive ? `Deselect ${label}` : `Select ${label}`}
      accessibilityState={{ selected: isActive }}
      style={[
        styles.chip,
        isActive ? styles.chipActive : styles.chipIdle,
      ]}
      scaleValue={0.93}
    >
      {/* Voltage glow behind chip when active */}
      <Animated.View
        style={[
          styles.voltageGlow,
          { backgroundColor: color },
          glowStyle,
        ]}
        pointerEvents="none"
      />
      <View style={[styles.iconContainer, isActive && { opacity: 1 }]}>
        {icon}
      </View>
      <Text
        style={[
          styles.label,
          isActive && { color: colors.text.primary },
        ]}
      >
        {label}
      </Text>
      <Animated.View
        style={[
          styles.backlight,
          { backgroundColor: color, shadowColor: color },
          backlightStyle,
        ]}
      />
    </AnimatedPressable>
  );
}

export default React.memo(ServiceChip);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    height: 88,
    position: 'relative',
    overflow: 'hidden',
  },
  voltageGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: borderRadius.lg + 10,
  },
  chipIdle: {
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
    ...shadows.metalExtruded,
  },
  chipActive: {
    backgroundColor: colors.base,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
    ...shadows.metalSunken,
  },
  iconContainer: {
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  label: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.tertiary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  backlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 4,
  },
});
