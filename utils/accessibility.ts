/**
 * Accessibility Utilities for ResQ Kenya
 * WCAG 2.1 AA Compliance Helpers
 *
 * Provides hooks and utilities for:
 * - Reduced motion preferences
 * - Screen reader announcements
 * - Focus management
 * - Touch target compliance
 */

import { useEffect, useState, useCallback } from 'react';
import {
  AccessibilityInfo,
} from 'react-native';

// =============================================================================
// REDUCED MOTION HOOK
// =============================================================================

/**
 * Hook to detect if the user prefers reduced motion.
 * On iOS: Reads "Reduce Motion" system setting
 * On Android: Reads "Remove Animations" system setting
 * On Web: Reads prefers-reduced-motion media query
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial value
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setPrefersReducedMotion(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setPrefersReducedMotion(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return prefersReducedMotion;
}

// =============================================================================
// SCREEN READER HOOK
// =============================================================================

/**
 * Hook to detect if a screen reader is active.
 */
export function useScreenReader(): boolean {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      setIsScreenReaderEnabled(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled: boolean) => {
        setIsScreenReaderEnabled(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return isScreenReaderEnabled;
}

// =============================================================================
// SCREEN READER ANNOUNCEMENTS
// =============================================================================

/**
 * Announce a message to the screen reader.
 * Use for dynamic content updates that need to be communicated.
 */
export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

/**
 * Hook that returns a memoized announce function.
 */
export function useAccessibilityAnnounce() {
  return useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);
}

// =============================================================================
// TOUCH TARGET CONSTANTS
// =============================================================================

/**
 * Minimum touch target sizes per platform guidelines.
 * iOS HIG: 44pt minimum
 * Android: 48dp minimum
 * Emergency (SOS): 80pt minimum
 */
export const TOUCH_TARGET = {
  /** Minimum touch target for standard interactive elements (44pt) */
  MIN: 44,
  /** Minimum touch target for Android (48dp) */
  MIN_ANDROID: 48,
  /** Minimum touch target for emergency/SOS elements (80pt) */
  EMERGENCY: 80,
  /** Default hitSlop to extend small touch targets */
  HIT_SLOP: { top: 8, bottom: 8, left: 8, right: 8 },
  /** Larger hitSlop for very small elements */
  HIT_SLOP_LARGE: { top: 12, bottom: 12, left: 12, right: 12 },
} as const;

// =============================================================================
// ANIMATION DURATION HELPER
// =============================================================================

/**
 * Returns 0 duration if reduced motion is preferred, otherwise the given duration.
 * Use this to conditionally disable animations.
 */
export function getAnimationDuration(
  duration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0 : duration;
}

// =============================================================================
// WCAG COLOR CONTRAST HELPERS
// =============================================================================

/**
 * WCAG 2.1 AA Accessible Color Tokens
 * These override the default theme colors where contrast ratios were insufficient.
 *
 * All colors below meet minimum 4.5:1 contrast ratio against #0A0A0A / #0F0F0F backgrounds.
 */
export const accessibleColors = {
  text: {
    /** Was #6B6B6B (3.7:1) - now #949494 (5.2:1) - meets WCAG AA */
    tertiary: '#949494',
    /** Was #6B6B6B (3.7:1) - now #949494 (5.2:1) - meets WCAG AA */
    muted: '#949494',
    /** Was #4A4A4A (2.4:1) - now #767676 (4.5:1) - meets WCAG AA minimum */
    disabled: '#767676',
  },
  /** Small text (under 14px) requires higher contrast - use these for 10px labels */
  smallText: {
    /** For 10px uppercase labels on dark backgrounds - high contrast */
    label: '#B0B0B0',
  },
} as const;

// =============================================================================
// FOCUS INDICATOR STYLES (Web Keyboard Navigation)
// =============================================================================

/**
 * Focus indicator styles for keyboard navigation on web.
 * Applied via onFocus/onBlur or :focus-visible on web.
 */
export const focusIndicatorStyle = {
  borderWidth: 2,
  borderColor: '#FFA500',
  borderStyle: 'solid' as const,
};

// =============================================================================
// ACCESSIBILITY ROLES MAP
// =============================================================================

/**
 * Common accessibility role mappings for consistent usage across the app.
 */
export const A11Y_ROLE = {
  BUTTON: 'button' as const,
  LINK: 'link' as const,
  HEADER: 'header' as const,
  IMAGE: 'image' as const,
  ALERT: 'alert' as const,
  SEARCH: 'search' as const,
  TAB: 'tab' as const,
  SWITCH: 'switch' as const,
  PROGRESSBAR: 'progressbar' as const,
  ADJUSTABLE: 'adjustable' as const,
  NONE: 'none' as const,
} as const;

// =============================================================================
// LIVE REGION HELPER
// =============================================================================

/**
 * Props to make a view announce content changes to screen readers.
 * Use accessibilityLiveRegion="polite" for non-urgent updates
 * Use accessibilityLiveRegion="assertive" for urgent updates (errors, SOS)
 */
export const liveRegion = {
  polite: { accessibilityLiveRegion: 'polite' as const },
  assertive: { accessibilityLiveRegion: 'assertive' as const },
} as const;
