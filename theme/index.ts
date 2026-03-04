// Semantic Theme Layer
// Maps design tokens to semantic usage across the app

import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  PRICES,
} from './voltage-premium';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  PRICES,
};

// Semantic color aliases for quick access
export const semantic = {
  background: {
    primary: colors.background.primary,
    secondary: colors.background.secondary,
    tertiary: colors.background.tertiary,
    border: colors.background.border,
  },
  accent: {
    default: colors.voltage,
    hover: colors.interactive.hover,
    pressed: colors.interactive.pressed,
    disabled: colors.interactive.disabled,
  },
  text: {
    primary: colors.text.primary,
    secondary: colors.text.secondary,
    tertiary: colors.text.tertiary,
    onAccent: colors.text.onBrand,
  },
  status: colors.status,
  service: colors.service,
};

export type Theme = typeof theme;
export type SemanticColors = typeof semantic;

export { colors, typography, spacing, borderRadius, shadows, PRICES };
export default theme;
