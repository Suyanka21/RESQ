import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { TOUCH_TARGET } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { selectionHaptic, successHaptic, lightHaptic } from '@/utils/haptics';

const TAGS = ['Professional', 'On Time', 'Friendly', 'Clean Work', 'Fair Price'];

export default function RatingScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>How was your service with James Mwangi?</Text>

        {/* Stars - Touch targets meet 44pt minimum */}
        <View style={styles.stars} accessibilityRole="radiogroup" accessibilityLabel="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <AnimatedPressable
              key={star}
              onPress={() => {
                selectionHaptic();
                setRating(star);
              }}
              style={styles.starButton}
              accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}
              accessibilityState={{ selected: star <= rating }}
              accessibilityHint={`Sets rating to ${star} out of 5`}
              scaleValue={0.85}
            >
              <Star
                size={40}
                color={star <= rating ? colors.voltage : colors.text.disabled}
                fill={star <= rating ? colors.voltage : 'transparent'}
              />
            </AnimatedPressable>
          ))}
        </View>

        {/* Tags */}
        <View style={styles.tags}>
          {TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <AnimatedPressable
                key={tag}
                onPress={() => {
                  lightHaptic();
                  toggleTag(tag);
                }}
                style={[styles.tag, isSelected && styles.tagSelected]}
                accessibilityLabel={tag}
                accessibilityState={{ selected: isSelected }}
                scaleValue={0.93}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                  {tag}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Comment */}
        <MetalSurface variant="sunken" radius="lg" style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Additional feedback (optional)"
            placeholderTextColor={colors.text.disabled}
            multiline
            numberOfLines={3}
            accessibilityLabel="Additional feedback"
          />
        </MetalSurface>
      </View>

      <View style={styles.footer}>
        <AnimatedPressable
          onPress={() => {
            successHaptic();
            handleSubmit();
          }}
          style={styles.submitButton}
          accessibilityLabel="Submit rating"
        >
          <Text style={styles.submitText}>Submit</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => router.replace('/(tabs)')}
          accessibilityLabel="Skip rating"
        >
          <Text style={styles.skipText}>Skip</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xl,
  },
  stars: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  starButton: {
    minWidth: TOUCH_TARGET.MIN,
    minHeight: TOUCH_TARGET.MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  tagSelected: {
    backgroundColor: 'rgba(255,165,0,0.15)',
    borderColor: colors.voltage,
  },
  tagText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  tagTextSelected: {
    color: colors.voltage,
  },
  commentBox: {
    width: '100%',
    padding: spacing.md,
  },
  commentInput: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.voltage,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.glow,
  },
  submitText: {
    color: colors.text.onBrand,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  skipText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
});
