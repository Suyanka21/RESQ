import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, Mail, FileText } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';

const OPTIONS = [
  { id: 'call', label: 'Call Support Line', sublabel: '+254 700 000 000', icon: Phone, action: 'tel:+254700000000' },
  { id: 'chat', label: 'Live Chat', sublabel: 'Response in < 2 min', icon: MessageCircle, action: null },
  { id: 'email', label: 'Email Support', sublabel: 'provider-support@resq.ke', icon: Mail, action: 'mailto:provider-support@resq.ke' },
  { id: 'docs', label: 'Provider Handbook', sublabel: 'Guidelines & policies', icon: FileText, action: null },
];

export default function ProviderSupportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Need help? We're here for you 24/7.</Text>

        <View style={styles.options}>
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => opt.action && Linking.openURL(opt.action)}
                accessibilityLabel={opt.label}
                accessibilityRole="button"
              >
                <MetalSurface variant="extruded" radius="lg" style={styles.optionCard}>
                  <View style={styles.optionIcon}>
                    <Icon size={24} color={colors.voltage} />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionSublabel}>{opt.sublabel}</Text>
                  </View>
                </MetalSurface>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  subtitle: { color: colors.text.secondary, fontSize: typography.fontSize.sm, marginBottom: spacing.xl },
  options: { gap: spacing.md },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  optionIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,165,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  optionInfo: { flex: 1 },
  optionLabel: { color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
  optionSublabel: { color: colors.text.secondary, fontSize: typography.fontSize.xs, marginTop: 2 },
});
