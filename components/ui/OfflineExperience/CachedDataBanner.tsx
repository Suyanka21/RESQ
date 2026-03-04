import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Database } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface CachedDataBannerProps {
  lastUpdated?: string;
}

export default function CachedDataBanner({ lastUpdated }: CachedDataBannerProps) {
  return (
    <View
      style={styles.banner}
      accessibilityLabel={`Showing cached data${lastUpdated ? `, last updated ${lastUpdated}` : ''}`}
    >
      <Database size={14} color={colors.text.tertiary} />
      <Text style={styles.text}>
        Showing cached data{lastUpdated ? ` - Last updated ${lastUpdated}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  text: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.xs,
  },
});
