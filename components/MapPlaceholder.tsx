import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Defs, Pattern, Circle } from 'react-native-svg';
import { colors } from '@/theme';

interface MapPlaceholderProps {
  showRoute?: boolean;
  showProvider?: boolean;
}

export default function MapPlaceholder({
  showRoute = false,
  showProvider = false,
}: MapPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
            <Path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={1}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
        {/* Simulated streets */}
        <Path
          d="M 100 100 Q 200 150 300 100 T 500 200"
          fill="none"
          stroke="rgba(41,182,246,0.2)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Path
          d="M 50 300 Q 150 400 250 350 T 450 450"
          fill="none"
          stroke="rgba(41,182,246,0.1)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {showRoute && (
          <Path
            d="M 180 500 Q 200 350 220 300 T 250 150"
            fill="none"
            stroke={colors.voltage}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="8,4"
          />
        )}
        {showProvider && (
          <Circle cx={250} cy={150} r={8} fill={colors.voltage} />
        )}
        {/* User location */}
        <Circle cx={180} cy={500} r={6} fill={colors.status.info} />
        <Circle cx={180} cy={500} r={12} fill="none" stroke={colors.status.info} strokeWidth={2} opacity={0.4} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.mapBackground,
  },
});
