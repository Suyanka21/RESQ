import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography, spacing } from '@/theme';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    setTimeout(() => {
      Animated.timing(textFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);

    const timer = setTimeout(() => {
      router.replace('/auth/landing');
    }, 3000);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Shield */}
        <View style={styles.shield}>
          <Svg viewBox="0 0 100 100" width={128} height={128}>
            <Defs>
              <LinearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={colors.background.tertiary} />
                <Stop offset="50%" stopColor={colors.surface} />
                <Stop offset="100%" stopColor={colors.mapBackground} />
              </LinearGradient>
            </Defs>
            <Polygon
              points="50,5 95,25 95,75 50,95 5,75 5,25"
              fill="url(#shieldGrad)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
          </Svg>
          <Text style={styles.logoLetter}>R</Text>
          <Animated.View style={[styles.coreGlow, { opacity: pulseAnim }]} />
        </View>

        <Animated.View style={[styles.textBlock, { opacity: textFade }]}>
          <Text style={styles.title}>ResQ</Text>
          <Text style={styles.subtitle}>TACTICAL ROADSIDE SOVEREIGNTY</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  shield: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: typography.fontWeight.extrabold,
    color: colors.text.secondary,
  },
  coreGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.voltage,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    letterSpacing: 4,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
});
