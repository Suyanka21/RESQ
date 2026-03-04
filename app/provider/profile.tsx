import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Star, Award, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { useAuthStore } from '@/stores/authStore';
import { useProviderStore } from '@/stores/providerStore';

const MENU_ITEMS = [
  { id: 'settings', label: 'Account Settings', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { rating, completedJobs } = useProviderStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/landing');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <Text style={styles.name}>James Mwangi</Text>
        <Text style={styles.role}>Towing Specialist</Text>

        {/* Badge System */}
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Shield size={16} color={colors.status.success} />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
          <View style={styles.badge}>
            <Star size={16} color={colors.voltage} />
            <Text style={styles.badgeText}>{rating.toFixed(1)}</Text>
          </View>
          <View style={styles.badge}>
            <Award size={16} color={colors.status.info} />
            <Text style={styles.badgeText}>Gold</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat}>
          <Text style={styles.statValue}>{completedJobs}</Text>
          <Text style={styles.statLabel}>Jobs</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat}>
          <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </MetalSurface>
        <MetalSurface variant="extruded" radius="lg" style={styles.stat}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Accept</Text>
        </MetalSurface>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => item.id === 'support' && router.push('/provider/support')}
              style={styles.menuItem}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <Icon size={20} color={colors.voltage} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Switch to Customer */}
      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        style={styles.switchButton}
        accessibilityLabel="Switch to customer mode"
        accessibilityRole="button"
      >
        <Text style={styles.switchText}>Switch to Customer Mode</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} accessibilityLabel="Log out" accessibilityRole="button">
        <LogOut size={18} color={colors.status.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
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
