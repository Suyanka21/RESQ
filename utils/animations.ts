/**
 * Animation Utilities for ResQ Kenya
 * Shared animation configurations and timing presets
 * Respects reduced motion preferences
 */

import { Easing } from 'react-native-reanimated';

// =============================================================================
// TIMING PRESETS
// =============================================================================

export const ANIMATION_DURATION = {
  /** Ultra-fast micro-interactions (button press, ripple) */
  instant: 100,
  /** Fast transitions (chip toggle, icon swap) */
  fast: 200,
  /** Standard transitions (modal, panel slide) */
  normal: 300,
  /** Smooth entrance animations (fade in, slide up) */
  smooth: 400,
  /** Deliberate animations (success checkmark, loading) */
  deliberate: 600,
  /** Slow ambient animations (pulse, glow cycle) */
  ambient: 1000,
} as const;

// =============================================================================
// EASING PRESETS
// =============================================================================

export const EASING = {
  /** Standard ease for most transitions */
  standard: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  /** Decelerate - for elements entering the screen */
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),
  /** Accelerate - for elements leaving the screen */
  accelerate: Easing.bezier(0.4, 0.0, 1.0, 1.0),
  /** Sharp - for elements that may return to screen */
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1.0),
  /** Bounce - for playful, delightful animations */
  bounce: Easing.bezier(0.34, 1.56, 0.64, 1.0),
  /** Elastic - for spring-like overshoot */
  elastic: Easing.bezier(0.68, -0.55, 0.265, 1.55),
} as const;

// =============================================================================
// SPRING CONFIGS
// =============================================================================

export const SPRING_CONFIG = {
  /** Gentle spring for subtle movements */
  gentle: { damping: 20, stiffness: 100, mass: 1 },
  /** Snappy spring for responsive UI */
  snappy: { damping: 15, stiffness: 200, mass: 0.8 },
  /** Bouncy spring for playful feedback */
  bouncy: { damping: 10, stiffness: 150, mass: 0.8 },
  /** Heavy spring for large elements */
  heavy: { damping: 25, stiffness: 120, mass: 1.2 },
  /** Button press spring */
  press: { damping: 15, stiffness: 300, mass: 0.6 },
} as const;

// =============================================================================
// ANIMATION VALUES
// =============================================================================

export const SCALE = {
  /** Button press scale-down */
  pressed: 0.95,
  /** Slight press for cards */
  cardPressed: 0.98,
  /** Bounce overshoot */
  overshoot: 1.05,
  /** Normal state */
  normal: 1,
} as const;

export const OPACITY = {
  /** Fully transparent */
  hidden: 0,
  /** Subtle hint */
  hint: 0.3,
  /** Semi-visible */
  semi: 0.5,
  /** Mostly visible */
  high: 0.8,
  /** Fully visible */
  visible: 1,
} as const;
