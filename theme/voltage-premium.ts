// Voltage Premium Design System
// ResQ Kenya Emergency Services
// Complete aesthetic implementation from design philosophy

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // BACKGROUND (Layered Depth System)
  background: {
    primary: '#0F0F0F',
    secondary: '#1A1A1A',
    tertiary: '#252525',
    border: '#2E2E2E',
  },

  // BASE SURFACE
  base: '#0A0A0A',
  surface: '#121212',
  surfaceRaised: '#1A1A1A',
  mapBackground: '#050505',

  // TEXT COLORS
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    tertiary: '#6B6B6B',
    muted: '#6B6B6B',
    disabled: '#4A4A4A',
    onBrand: '#0F0F0F',
  },

  // INTERACTIVE STATES (Voltage Orange)
  interactive: {
    default: '#FFA500',
    hover: '#FFB733',
    pressed: '#E69500',
    disabled: '#7A5000',
    focus: 'rgba(255, 165, 0, 0.4)',
  },

  // STATUS COLORS (WCAG AA Compliant)
  status: {
    error: '#FF3D3D',
    errorGlow: 'rgba(255, 61, 61, 0.2)',
    warning: '#FF9800',
    warningGlow: 'rgba(255, 152, 0, 0.2)',
    success: '#00E676',
    successGlow: 'rgba(0, 230, 118, 0.2)',
    info: '#29B6F6',
    infoGlow: 'rgba(41, 182, 246, 0.2)',
  },

  // SERVICE CATEGORY COLORS
  service: {
    towing: '#FFA500',
    fuel: '#4CAF50',
    battery: '#FFA500',
    tire: '#9C27B0',
    diagnostic: '#2196F3',
    medical: '#DC143C',
  },

  // ALIASES
  voltage: '#FFA500',
  sos: '#FF3D3D',
  safety: '#00E676',
};

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

export const typography = {
  fontFamily: {
    sans: 'Inter',
    mono: 'JetBrainsMono',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// =============================================================================
// SPACING SYSTEM
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

// =============================================================================
// SHADOWS & GLOWS (Dark Theme Optimized)
// =============================================================================

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  emergencyGlow: {
    shadowColor: '#FF3D3D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  // Neumorphic - Extruded/Raised
  metalExtruded: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  // Neumorphic - Highlight (top-left light)
  metalHighlight: {
    shadowColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 0,
  },
  // Neumorphic - Inset/Sunken (simulated)
  metalSunken: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 1,
  },
};

// =============================================================================
// NAIROBI SERVICE PRESETS
// =============================================================================

export const PRICES = {
  TOWING_BASE: 5000,
  AMBULANCE_BASE: 3500,
  JUMPSTART_BASE: 1500,
  TIRE_BASE: 2000,
  DIAGNOSTICS_BASE: 2500,
  FUEL_BASE: 1000,
};
