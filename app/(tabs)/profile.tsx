import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Car,
  CreditCard,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import MetalSurface from '@/components/MetalSurface';
import { useAuthStore } from '@/stores/authStore';

const MENU_ITEMS = [
  { id: 'vehicles', label: 'My Vehicles', icon: Car, route: '/customer/manage-vehicles' },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard, route: '/customer/add-payment' },
  { id: 'safety', label: 'Safety & Security', icon: Shield, route: null },
  { id: 'notifications', label: 'Notifications', icon: Bell, route: null },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, route: '/customer/support' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace('/auth/landing');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={32} color={colors.voltage} />
        </View>
        <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
        <Text style={styles.phone}>+254 {user?.phone || '712 345 678'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => item.route && router.push(item.route as never)}
              style={styles.menuItem}
              accessibilityLabel={item.label}
              accessibilityRole="button"
            >
              <MetalSurface variant="extruded" radius="md" style={styles.menuIconBox}>
                <Icon size={18} color={colors.voltage} />
              </MetalSurface>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Provider Mode */}
      <TouchableOpacity
        onPress={() => router.push('/provider/login')}
        style={styles.providerButton}
        accessibilityLabel="Switch to provider mode"
        accessibilityRole="button"
      >
        <Text style={styles.providerText}>Switch to Provider Mode</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
        accessibilityLabel="Log out"
        accessibilityRole="button"
      >
        <LogOut size={18} color={colors.status.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.voltage,
    marginBottom: spacing.md,
    ...shadows.glow,
  },
  name: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  phone: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  menu: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  providerButton: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.background.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  providerText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  logoutText: {
    color: colors.status.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});
