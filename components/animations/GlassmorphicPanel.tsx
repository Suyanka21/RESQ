/**
 * GlassmorphicPanel - Frosted glass effect panel
 * Creates semi-transparent panels with blur effect and subtle borders
 * Used for bottom sheets, modals, and premium card surfaces
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius as br, shadows } from '@/theme';

interface GlassmorphicPanelProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: 'light' | 'medium' | 'heavy';
  radius?: keyof typeof br;
  withBorder?: boolean;
  withGradient?: boolean;
}

const INTENSITY_MAP = {
  light: {
    backgroundColor: 'rgba(15, 15, 15, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  medium: {
    backgroundColor: 'rgba(15, 15, 15, 0.82)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heavy: {
    backgroundColor: 'rgba(15, 15, 15, 0.92)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

function GlassmorphicPanel({
  children,
  style,
  intensity = 'medium',
  radius = 'xxl',
  withBorder = true,
  withGradient = true,
}: GlassmorphicPanelProps) {
  const intensityConfig = INTENSITY_MAP[intensity];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: intensityConfig.backgroundColor,
          borderRadius: br[radius],
          borderColor: withBorder ? intensityConfig.borderColor : 'transparent',
          borderWidth: withBorder ? 1 : 0,
        },
        style,
      ]}
    >
      {withGradient && (
        <LinearGradient
          colors={['rgba(255,255,255,0.04)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: br[radius] }]}
          pointerEvents="none"
        />
      )}
      {/* Top specular highlight */}
      <View
        style={[
          styles.specularHighlight,
          { borderTopLeftRadius: br[radius], borderTopRightRadius: br[radius] },
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

export default React.memo(GlassmorphicPanel);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...shadows.card,
  },
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
