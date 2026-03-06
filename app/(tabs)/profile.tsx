import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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
import { ProfileSkeleton } from '@/components/ui/LoadingStates';
import { GenericError } from '@/components/ui/ErrorStates';
import { ContextualTooltip } from '@/components/onboarding';
import { AnimatedPressable, FadeInView } from '@/components/animations';
import { mediumHaptic, errorHaptic, lightHaptic } from '@/utils/haptics';

const MENU_ITEMS = [
  { id: 'vehicles', label: 'My Vehicles', icon: Car, route: '/customer/manage-vehicles' },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard, route: '/customer/add-payment' },
  { id: 'safety', label: 'Safety & Security', icon: Shield, route: null },
  { id: 'notifications', label: 'Notifications', icon: Bell, route: null },
  { id: 'quickstart', label: 'Quick Start Guide', icon: HelpCircle, route: '/customer/quick-start' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, route: '/customer/support' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Profile Header */}
      <View style={styles.header}>
        <ContextualTooltip
          id="profile"
          message="Save your vehicles and medical info for faster service requests."
          arrowPosition="top"
          delay={600}
        >
          <View style={styles.avatar}>
            <User size={32} color={colors.voltage} />
          </View>
        </ContextualTooltip>
        <Text style={styles.name}>{user?.name || 'John Doe'}</Text>
        <Text style={styles.phone}>+254 {user?.phone || '712 345 678'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <FadeInView key={item.id} delay={100 + index * 60} duration={300}>
              <AnimatedPressable
                onPress={() => {
                  lightHaptic();
                  if (item.route) router.push(item.route as never);
                }}
                style={styles.menuItem}
                accessibilityLabel={item.label}
                scaleValue={0.98}
              >
                <MetalSurface variant="extruded" radius="md" style={styles.menuIconBox}>
                  <Icon size={18} color={colors.voltage} />
                </MetalSurface>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={18} color={colors.text.tertiary} />
              </AnimatedPressable>
            </FadeInView>
          );
        })}
      </View>

      {/* Provider Mode */}
      <FadeInView delay={500}>
        <AnimatedPressable
          onPress={() => {
            mediumHaptic();
            router.push('/provider/login');
          }}
          style={styles.providerButton}
          accessibilityLabel="Switch to provider mode"
        >
          <Text style={styles.providerText}>Switch to Provider Mode</Text>
        </AnimatedPressable>
      </FadeInView>

      {/* Logout */}
      <AnimatedPressable
        onPress={() => {
          errorHaptic();
          handleLogout();
        }}
        style={styles.logoutButton}
        accessibilityLabel="Log out"
      >
        <LogOut size={18} color={colors.status.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </AnimatedPressable>
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
