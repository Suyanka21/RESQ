import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, Mail, HelpCircle } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

const SUPPORT_OPTIONS = [
  { id: 'call', label: 'Call Support', sublabel: '+254 700 000 000', icon: Phone, action: 'tel:+254700000000' },
  { id: 'chat', label: 'Live Chat', sublabel: 'Available 24/7', icon: MessageCircle, action: null },
  { id: 'email', label: 'Email Support', sublabel: 'support@resq.ke', icon: Mail, action: 'mailto:support@resq.ke' },
  { id: 'faq', label: 'FAQ', sublabel: 'Common questions', icon: HelpCircle, action: null },
];

export default function SupportScreen() {
  const router = useRouter();

  const handleAction = (action: string | null) => {
    if (action) {
      Linking.openURL(action);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Need help? We're available 24/7 to assist you.
        </Text>

        <View style={styles.options}>
          {SUPPORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleAction(option.action)}
                accessibilityLabel={option.label}
                accessibilityRole="button"
              >
                <MetalSurface variant="extruded" radius="lg" style={styles.optionCard}>
                  <View style={styles.optionIcon}>
                    <Icon size={24} color={colors.voltage} />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionSublabel}>{option.sublabel}</Text>
                  </View>
                </MetalSurface>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Emergency */}
        <MetalSurface variant="glass" radius="lg" style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>Emergency?</Text>
          <Text style={styles.emergencyText}>
            If you're in immediate danger, call 999 or use the SOS button on the dashboard.
          </Text>
        </MetalSurface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xl,
  },
  options: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,165,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  optionSublabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginTop: 2,
  },
  emergencyCard: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,61,61,0.3)',
  },
  emergencyTitle: {
    color: colors.status.error,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  emergencyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
});
