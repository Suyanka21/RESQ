/**
 * EmptyWalletIllustration - Custom SVG illustration for empty wallet state
 * Shows a stylized wallet/card motif with voltage brand colors
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme';

interface EmptyWalletIllustrationProps {
  size?: number;
}

function EmptyWalletIllustration({ size = 120 }: EmptyWalletIllustrationProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.background.tertiary} />
            <Stop offset="100%" stopColor={colors.background.secondary} />
          </LinearGradient>
          <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.voltage} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={colors.voltage} stopOpacity={0.1} />
          </LinearGradient>
        </Defs>

        {/* Wallet body */}
        <Rect x={15} y={35} width={90} height={55} rx={12} fill="url(#walletGrad)" />
        <Rect x={15} y={35} width={90} height={55} rx={12} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        {/* Wallet flap */}
        <Path
          d="M15 50 Q15 35 27 35 L93 35 Q105 35 105 50"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />

        {/* Card sticking out */}
        <Rect x={25} y={25} width={60} height={38} rx={6} fill="url(#cardGrad)" />
        <Rect x={25} y={25} width={60} height={38} rx={6} fill="none" stroke={colors.voltage} strokeWidth={1} opacity={0.3} />

        {/* Card chip */}
        <Rect x={33} y={34} width={12} height={10} rx={2} fill={colors.voltage} opacity={0.4} />

        {/* Card lines */}
        <Rect x={33} y={49} width={30} height={3} rx={1.5} fill="rgba(255,255,255,0.15)" />
        <Rect x={33} y={55} width={20} height={3} rx={1.5} fill="rgba(255,255,255,0.08)" />

        {/* Coin */}
        <Circle cx={95} cy={30} r={12} fill={colors.voltage} opacity={0.15} />
        <Circle cx={95} cy={30} r={10} fill="none" stroke={colors.voltage} strokeWidth={1} opacity={0.3} />
        <Path
          d="M92 26 L92 34 M95 24 L95 36 M98 26 L98 34"
          stroke={colors.voltage}
          strokeWidth={1}
          opacity={0.3}
          strokeLinecap="round"
        />

        {/* Plus icon hint */}
        <Circle cx={60} cy={105} r={10} fill={colors.voltage} opacity={0.1} />
        <Path
          d="M56 105 L64 105 M60 101 L60 109"
          stroke={colors.voltage}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
}

export default React.memo(EmptyWalletIllustration);
