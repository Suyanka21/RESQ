/**
 * SuccessIllustration - Custom SVG illustration for success states
 * Shows a stylized checkmark/shield motif with success colors
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme';

interface SuccessIllustrationProps {
  size?: number;
}

function SuccessIllustration({ size = 120 }: SuccessIllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="successShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.status.success} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={colors.status.success} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Background glow */}
        <Circle cx={60} cy={55} r={45} fill={colors.status.success} opacity={0.05} />

        {/* Shield shape */}
        <Polygon
          points="60,15 95,30 95,65 60,95 25,65 25,30"
          fill="url(#successShieldGrad)"
          stroke={colors.status.success}
          strokeWidth={1.5}
          opacity={0.6}
        />

        {/* Inner shield */}
        <Polygon
          points="60,25 85,37 85,62 60,85 35,62 35,37"
          fill="none"
          stroke={colors.status.success}
          strokeWidth={0.5}
          opacity={0.3}
        />

        {/* Checkmark */}
        <Path
          d="M43 55 L55 67 L77 42"
          fill="none"
          stroke={colors.status.success}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />

        {/* Sparkle dots */}
        <Circle cx={95} cy={20} r={2} fill={colors.status.success} opacity={0.4} />
        <Circle cx={25} cy={20} r={1.5} fill={colors.status.success} opacity={0.3} />
        <Circle cx={100} cy={50} r={1.5} fill={colors.status.success} opacity={0.2} />

        {/* Bottom label line */}
        <Path
          d="M40 108 L80 108"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export default React.memo(SuccessIllustration);
