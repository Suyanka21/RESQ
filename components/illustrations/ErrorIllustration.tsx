/**
 * ErrorIllustration - Custom SVG illustration for error states
 * Shows a stylized warning/shield motif with error colors
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme';

interface ErrorIllustrationProps {
  size?: number;
}

function ErrorIllustration({ size = 120 }: ErrorIllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="errorShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.status.error} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={colors.status.error} stopOpacity={0.05} />
          </LinearGradient>
        </Defs>

        {/* Background glow */}
        <Circle cx={60} cy={55} r={45} fill={colors.status.error} opacity={0.05} />

        {/* Shield shape */}
        <Polygon
          points="60,15 95,30 95,65 60,95 25,65 25,30"
          fill="url(#errorShieldGrad)"
          stroke={colors.status.error}
          strokeWidth={1.5}
          opacity={0.6}
        />

        {/* Inner shield */}
        <Polygon
          points="60,25 85,37 85,62 60,85 35,62 35,37"
          fill="none"
          stroke={colors.status.error}
          strokeWidth={0.5}
          opacity={0.3}
        />

        {/* Exclamation mark */}
        <Path
          d="M60 40 L60 62"
          stroke={colors.status.error}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.8}
        />
        <Circle cx={60} cy={72} r={2.5} fill={colors.status.error} opacity={0.8} />

        {/* Crack lines */}
        <Path
          d="M42 32 L38 28"
          stroke={colors.status.error}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.2}
        />
        <Path
          d="M78 32 L82 28"
          stroke={colors.status.error}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.2}
        />

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

export default React.memo(ErrorIllustration);
