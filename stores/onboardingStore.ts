/**
 * Onboarding Store - ResQ Kenya
 * Manages onboarding state, tooltip visibility, and permission tracking.
 * Uses AsyncStorage for persistent "show once" behavior.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: '@resq_onboarding_completed',
  TOOLTIPS_SHOWN: '@resq_tooltips_shown',
  PERMISSIONS_REQUESTED: '@resq_permissions_requested',
} as const;

// Tooltip identifiers
export type TooltipId = 'sos_button' | 'service_icons' | 'wallet' | 'profile';

// Permission identifiers
export type PermissionId = 'location' | 'notifications' | 'camera';

interface OnboardingState {
  // Onboarding flow
  hasCompletedOnboarding: boolean;
  currentOnboardingStep: number;
  isOnboardingLoaded: boolean;

  // Tooltips
  shownTooltips: Record<TooltipId, boolean>;
  activeTooltip: TooltipId | null;

  // Permissions
  requestedPermissions: Record<PermissionId, boolean>;
  grantedPermissions: Record<PermissionId, boolean>;

  // Actions
  loadOnboardingState: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  setOnboardingStep: (step: number) => void;
  markTooltipShown: (id: TooltipId) => Promise<void>;
  setActiveTooltip: (id: TooltipId | null) => void;
  hasTooltipBeenShown: (id: TooltipId) => boolean;
  markPermissionRequested: (id: PermissionId) => Promise<void>;
  setPermissionGranted: (id: PermissionId, granted: boolean) => void;
  resetOnboarding: () => Promise<void>;
}

const DEFAULT_TOOLTIPS: Record<TooltipId, boolean> = {
  sos_button: false,
  service_icons: false,
  wallet: false,
  profile: false,
};

const DEFAULT_PERMISSIONS_REQUESTED: Record<PermissionId, boolean> = {
  location: false,
  notifications: false,
  camera: false,
};

const DEFAULT_PERMISSIONS_GRANTED: Record<PermissionId, boolean> = {
  location: false,
  notifications: false,
  camera: false,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  hasCompletedOnboarding: false,
  currentOnboardingStep: 0,
  isOnboardingLoaded: false,
  shownTooltips: { ...DEFAULT_TOOLTIPS },
  activeTooltip: null,
  requestedPermissions: { ...DEFAULT_PERMISSIONS_REQUESTED },
  grantedPermissions: { ...DEFAULT_PERMISSIONS_GRANTED },

  loadOnboardingState: async () => {
    try {
      const [completedRaw, tooltipsRaw, permissionsRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        AsyncStorage.getItem(STORAGE_KEYS.TOOLTIPS_SHOWN),
        AsyncStorage.getItem(STORAGE_KEYS.PERMISSIONS_REQUESTED),
      ]);

      const completed = completedRaw === 'true';
      const tooltips = tooltipsRaw
        ? { ...DEFAULT_TOOLTIPS, ...JSON.parse(tooltipsRaw) }
        : { ...DEFAULT_TOOLTIPS };
      const permissions = permissionsRaw
        ? { ...DEFAULT_PERMISSIONS_REQUESTED, ...JSON.parse(permissionsRaw) }
        : { ...DEFAULT_PERMISSIONS_REQUESTED };

      set({
        hasCompletedOnboarding: completed,
        shownTooltips: tooltips,
        requestedPermissions: permissions,
        isOnboardingLoaded: true,
      });
    } catch {
      // If storage fails, show onboarding
      set({ isOnboardingLoaded: true });
    }
  },

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch {
      // Silently fail - onboarding will just show again next time
    }
  },

  skipOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    } catch {
      // Silently fail
    }
  },

  setOnboardingStep: (step: number) => {
    set({ currentOnboardingStep: step });
  },

  markTooltipShown: async (id: TooltipId) => {
    const current = get().shownTooltips;
    const updated = { ...current, [id]: true };
    set({ shownTooltips: updated, activeTooltip: null });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOOLTIPS_SHOWN, JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  },

  setActiveTooltip: (id: TooltipId | null) => {
    set({ activeTooltip: id });
  },

  hasTooltipBeenShown: (id: TooltipId) => {
    return get().shownTooltips[id] === true;
  },

  markPermissionRequested: async (id: PermissionId) => {
    const current = get().requestedPermissions;
    const updated = { ...current, [id]: true };
    set({ requestedPermissions: updated });
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PERMISSIONS_REQUESTED, JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  },

  setPermissionGranted: (id: PermissionId, granted: boolean) => {
    const current = get().grantedPermissions;
    set({ grantedPermissions: { ...current, [id]: granted } });
  },

  resetOnboarding: async () => {
    set({
      hasCompletedOnboarding: false,
      currentOnboardingStep: 0,
      shownTooltips: { ...DEFAULT_TOOLTIPS },
      activeTooltip: null,
      requestedPermissions: { ...DEFAULT_PERMISSIONS_REQUESTED },
      grantedPermissions: { ...DEFAULT_PERMISSIONS_GRANTED },
    });
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED),
        AsyncStorage.removeItem(STORAGE_KEYS.TOOLTIPS_SHOWN),
        AsyncStorage.removeItem(STORAGE_KEYS.PERMISSIONS_REQUESTED),
      ]);
    } catch {
      // Silently fail
    }
  },
}));
