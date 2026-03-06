import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Star, Award, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { useAuthStore } from '@/stores/authStore';
import { useProviderStore } from '@/stores/providerStore';
import { ProfileSkeleton } from '@/components/ui/LoadingStates';
import { GenericError } from '@/components/ui/ErrorStates';
import { TOUCH_TARGET, announceForAccessibility } from '@/utils/accessibility';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { lightHaptic, mediumHaptic } from '@/utils/haptics';

const MENU_ITEMS = [
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { rating, completedJobs } = useProviderStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      announceForAccessibility(`Provider profile. James Mwangi. Towing Specialist. Rating: ${rating.toFixed(1)}. ${completedJobs} jobs completed.`);
    }
  }, [isLoading, rating, completedJobs]);

  const handleLogout = () => {
    logout();
    router.replace('/auth/landing');
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <GenericError
        title="Failed to load profile"
        message={error}
        onRetry={() => { setError(null); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityHint="Returns to previous screen"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </AnimatedPressable>
        <Text style={styles.headerTitle} accessibilityRole="header">Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Header */}
      <FadeInView delay={100}>
      <View style={styles.profileHeader}>
        <View
          style={styles.avatar}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={styles.avatarText}>J</Text>
        </View>
        <Text style={styles.name} accessibilityRole="header">James Mwangi</Text>
        <Text style={styles.role}>Towing Specialist</Text>

        {/* Badge System */}
        <View style={styles.badges}>
          <View style={styles.badge} accessible accessibilityLabel="Verified provider">
            <Shield size={16} color={colors.status.success} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge} accessible accessibilityLabel={`Rating: ${rating.toFixed(1)} stars`}>
            <Star size={16} color={colors.voltage} />
            <Text style={styles.badgeText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.badge} accessible accessibilityLabel="Gold tier provider">
            <Award size={16} color={colors.status.info} />
            <Text style={styles.badgeText}>Gold</Text>
          </View>
        </View>
      </View>
      </FadeInView>

      {/* Stats */}
      <View style={styles.statsRow}>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat} accessible accessibilityLabel={`${completedJobs} jobs completed`}>
          <Text style={styles.statValue}>{completedJobs}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat} accessible accessibilityLabel={`Rating: ${rating.toFixed(1)} stars`}>
          <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat} accessible accessibilityLabel="98 percent acceptance rate">
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Accept</Text>
        </MetalSurface>
      </View>

      {/* Menu */}
      <FadeInView delay={300}>
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <AnimatedPressable
              key={item.id}
              onPress={() => {
                lightHaptic();
                if (item.id === 'support') router.push('/provider/support');
              }}
              style={styles.menuItem}
              accessibilityLabel={item.label}
              accessibilityHint={item.id === 'support' ? 'Opens help and support page' : 'Opens account settings'}
            >
              <Icon size={20} color={colors.voltage} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={18} color={colors.text.tertiary} />
            </AnimatedPressable>
          );
        })}
      </View>
      </FadeInView>

      {/* Switch to Customer */}
      <FadeInView delay={400}>
      <AnimatedPressable
        onPress={() => {
          mediumHaptic();
          router.replace('/(tabs)');
        }}
        style={styles.switchButton}
        accessibilityLabel="Switch to customer mode"
        accessibilityHint="Switches from provider view to customer view"
      >
        <Text style={styles.switchText}>Switch to Customer Mode</Text>
      </AnimatedPressable>
      </FadeInView>

      {/* Logout */}
      <AnimatedPressable onPress={handleLogout} style={styles.logoutButton} accessibilityLabel="Log out" accessibilityHint="Signs you out and returns to the landing page">
        <LogOut size={18} color={colors.status.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </AnimatedPressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.background.secondary, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.text.primary, fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xl },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.voltage,
    marginBottom: spacing.md, ...shadows.glow,
  },
  avatarText: { color: colors.voltage, fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold },
  name: { color: colors.text.primary, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold },
  role: { color: colors.text.secondary, fontSize: typography.fontSize.sm, marginTop: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
  },
  badgeText: { color: colors.text.primary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.xl },
  stat: { flex: 1, alignItems: 'center', padding: spacing.lg },
  statValue: { color: colors.voltage, fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.extrabold },
  statLabel: { color: colors.text.tertiary, fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 1, marginTop: spacing.xs },
  menu: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.background.border,
  },
  menuLabel: { flex: 1, color: colors.text.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium },
  switchButton: {
    marginTop: spacing.xl, marginHorizontal: spacing.lg,
    borderWidth: 1, borderColor: colors.background.border,
    borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center',
  },
  switchText: { color: colors.text.secondary, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, textTransform: 'uppercase', letterSpacing: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, gap: spacing.sm },
  logoutText: { color: colors.status.error, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },
});
