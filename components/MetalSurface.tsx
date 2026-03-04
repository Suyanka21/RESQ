import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { colors, shadows, borderRadius } from '@/theme';

interface MetalSurfaceProps {
  children: React.ReactNode;
  variant?: 'extruded' | 'sunken' | 'glass';
  style?: StyleProp<ViewStyle>;
  radius?: keyof typeof borderRadius;
}

export default function MetalSurface({
  children,
  variant = 'extruded',
  style,
  radius = 'lg',
}: MetalSurfaceProps) {
  const variantStyles: Record<string, ViewStyle> = {
    extruded: {
      backgroundColor: colors.base,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.02)',
      ...shadows.metalExtruded,
    },
    sunken: {
      backgroundColor: colors.base,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.5)',
      ...shadows.metalSunken,
    },
    glass: {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
  };

  return (
    <View
      style={[
        { borderRadius: borderRadius[radius] },
        variantStyles[variant],
        style,
      ]}
    >
      {children}
    </View>
  );
}
