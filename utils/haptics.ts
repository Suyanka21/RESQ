/**
 * Haptic Feedback Utilities for ResQ Kenya
 * Provides tactile feedback for important interactions
 * Uses expo-haptics for cross-platform haptic support
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// =============================================================================
// HAPTIC FEEDBACK TYPES
// =============================================================================

/**
 * Light haptic - for subtle UI interactions
 * Use for: tab switches, toggles, minor selections
 */
export function lightHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Medium haptic - for standard interactions
 * Use for: button presses, service chip selection, card taps
 */
export function mediumHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Heavy haptic - for important/emergency actions
 * Use for: SOS button, dispatch confirmation, swipe-to-confirm
 */
export function heavyHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/**
 * Success haptic - notification pattern for successful actions
 * Use for: payment success, service completion, verification success
 */
export function successHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Warning haptic - notification pattern for warnings
 * Use for: low balance, provider far away, connection issues
 */
export function warningHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

/**
 * Error haptic - notification pattern for errors
 * Use for: payment failure, service unavailable, validation errors
 */
export function errorHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/**
 * Selection haptic - light tick for selection changes
 * Use for: picker changes, slider adjustments, list item selection
 */
export function selectionHaptic(): void {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync();
}
