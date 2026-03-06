/**
 * EmptyHistoryIllustration - Custom SVG illustration for empty history state
 * Shows a stylized road/clock motif with voltage brand colors
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { colors } from '@/theme';

interface EmptyHistoryIllustrationProps {
  size?: number;
}

function EmptyHistoryIllustration({ size = 120 }: EmptyHistoryIllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.background.tertiary} />
            <Stop offset="100%" stopColor={colors.background.secondary} />
          </LinearGradient>
          <LinearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.voltage} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={colors.voltage} stopOpacity={0.1} />
          </LinearGradient>
        </Defs>

        {/* Road */}
        <Rect x={10} y={80} width={100} height={20} rx={10} fill="url(#roadGrad)" />
        <Rect x={25} y={88} width={12} height={4} rx={2} fill="rgba(255,255,255,0.1)" />
        <Rect x={54} y={88} width={12} height={4} rx={2} fill="rgba(255,255,255,0.1)" />
        <Rect x={83} y={88} width={12} height={4} rx={2} fill="rgba(255,255,255,0.1)" />

        {/* Clock circle */}
        <Circle cx={60} cy={45} r={30} fill="url(#clockGrad)" />
        <Circle cx={60} cy={45} r={28} fill="none" stroke={colors.voltage} strokeWidth={1.5} opacity={0.4} />

        {/* Clock hands */}
        <Path
          d="M60 45 L60 28"
          stroke={colors.voltage}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.8}
        />
        <Path
          d="M60 45 L72 45"
          stroke={colors.voltage}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />

        {/* Center dot */}
        <Circle cx={60} cy={45} r={3} fill={colors.voltage} opacity={0.8} />

        {/* Decorative dots */}
        <Circle cx={60} cy={18} r={2} fill={colors.voltage} opacity={0.3} />
        <Circle cx={87} cy={45} r={2} fill={colors.voltage} opacity={0.3} />
        <Circle cx={60} cy={72} r={2} fill={colors.voltage} opacity={0.3} />
        <Circle cx={33} cy={45} r={2} fill={colors.voltage} opacity={0.3} />
      </Svg>
    </View>
  );
}

export default React.memo(EmptyHistoryIllustration);
