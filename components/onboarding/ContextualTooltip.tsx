/**
 * ContextualTooltip - First-time feature highlight overlay
 * Shows once per feature, dismissible, non-intrusive
 * Designed for the Voltage Premium dark theme
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { useOnboardingStore, TooltipId } from '@/stores/onboardingStore';
import { lightHaptic } from '@/utils/haptics';
import { useReducedMotion } from '@/utils/accessibility';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ArrowPosition = 'top' | 'bottom' | 'left' | 'right';

interface ContextualTooltipProps {
  id: TooltipId;
  message: string;
  arrowPosition?: ArrowPosition;
  offsetX?: number;
  offsetY?: number;
  delay?: number;
  children: React.ReactNode;
}

function ContextualTooltip({
  id,
  message,
  arrowPosition = 'bottom',
  offsetX = 0,
  offsetY = 0,
  delay = 500,
  children,
}: ContextualTooltipProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasBeenShown = useOnboardingStore((s) => s.shownTooltips[id]);
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const markTooltipShown = useOnboardingStore((s) => s.markTooltipShown);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(arrowPosition === 'bottom' ? -8 : 8);

  const shouldShow = hasCompletedOnboarding && !hasBeenShown;

  useEffect(() => {
    if (shouldShow) {
      if (prefersReducedMotion) {
        opacity.value = 1;
        translateY.value = 0;
      } else {
        opacity.value = withDelay(
          delay,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );
        translateY.value = withDelay(
          delay,
          withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) })
        );
      }
    }
  }, [shouldShow, delay, prefersReducedMotion, opacity, translateY]);

  const handleDismiss = useCallback(() => {
    lightHaptic();
    if (prefersReducedMotion) {
      opacity.value = 0;
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
    // Mark as shown after animation
    setTimeout(() => {
      markTooltipShown(id);
    }, 200);
  }, [id, markTooltipShown, prefersReducedMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const tooltipPosition = getTooltipPosition(arrowPosition, offsetX, offsetY);

  return (
    <View>
      {children}
      {shouldShow && (
        <Animated.View
          style={[styles.tooltipContainer, tooltipPosition, animatedStyle]}
          pointerEvents="box-none"
        >
          <Pressable onPress={handleDismiss} style={styles.tooltip}>
            <View style={[styles.arrow, getArrowStyle(arrowPosition)]} />
            <Text style={styles.tooltipText}>{message}</Text>
            <Text style={styles.dismissHint}>Tap to dismiss</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

function getTooltipPosition(
  arrowPosition: ArrowPosition,
  offsetX: number,
  offsetY: number,
): Record<string, number | string> {
  switch (arrowPosition) {
    case 'bottom':
      return { bottom: '100%', left: offsetX, marginBottom: 8 + offsetY };
    case 'top':
      return { top: '100%', left: offsetX, marginTop: 8 + offsetY };
    case 'left':
      return { left: '100%', top: offsetY, marginLeft: 8 + offsetX };
    case 'right':
      return { right: '100%', top: offsetY, marginRight: 8 + offsetX };
    default:
      return { bottom: '100%', left: offsetX, marginBottom: 8 + offsetY };
  }
}

function getArrowStyle(arrowPosition: ArrowPosition) {
  switch (arrowPosition) {
    case 'bottom':
      return {
        bottom: -6,
        left: 20,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: colors.background.tertiary,
      };
    case 'top':
      return {
        top: -6,
        left: 20,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: colors.background.tertiary,
      };
    case 'left':
      return {
        left: -6,
        top: 12,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderRightWidth: 6,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: colors.background.tertiary,
      };
    case 'right':
      return {
        right: -6,
        top: 12,
        borderTopWidth: 6,
        borderBottomWidth: 6,
        borderLeftWidth: 6,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: colors.background.tertiary,
      };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    zIndex: 1000,
    minWidth: 180,
    maxWidth: SCREEN_WIDTH - 48,
  },
  tooltip: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.2)',
    ...shadows.card,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  tooltipText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
  },
  dismissHint: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
});

export default React.memo(ContextualTooltip);
