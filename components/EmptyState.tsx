import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { colors, typography, spacing } from '@/theme';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nothing here yet',
  message = 'Content will appear here once available.',
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityLabel={title}>
      {icon || <Inbox size={48} color={colors.text.tertiary} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.lg,
  },
  message: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 260,
  },
});
