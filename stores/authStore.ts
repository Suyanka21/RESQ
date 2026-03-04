import { create } from 'zustand';
import {
  sendOTP as firebaseSendOTP,
  verifyOTP as firebaseVerifyOTP,
  signOut as firebaseSignOut,
  onAuthChange,
  getUserProfile,
  checkIsProvider,
} from '../services/auth.service';
import { isFirebaseConfigured } from '../config/firebase';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  bloodType?: string;
  allergies?: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  color: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isProvider: boolean;
  isLoading: boolean;
  phone: string;
  otp: string;
  user: UserProfile | null;
  vehicles: Vehicle[];
  authMode: 'signin' | 'signup';
  firebaseUid: string | null;

  setPhone: (phone: string) => void;
  setOtp: (otp: string) => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  setIsProvider: (isProvider: boolean) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;

  // Firebase-powered actions
  sendFirebaseOTP: (phone: string, recaptchaId?: string) => Promise<{ success: boolean; error?: string }>;
  verifyFirebaseOTP: (code: string) => Promise<{ success: boolean; error?: string }>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isProvider: false,
  isLoading: false,
  phone: '',
  otp: '',
  user: null,
  vehicles: [],
  authMode: 'signup',
  firebaseUid: null,

  setPhone: (phone) => set({ phone }),
  setOtp: (otp) => set({ otp }),
  setAuthMode: (authMode) => set({ authMode }),
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => {
    if (isFirebaseConfigured) {
      firebaseSignOut().catch(console.error);
    }
    set({ isAuthenticated: false, isProvider: false, user: null, phone: '', otp: '', firebaseUid: null });
  },
  setIsProvider: (isProvider) => set({ isProvider }),
  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  removeVehicle: (id) =>
    set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),

  // Firebase-powered: Send OTP
  sendFirebaseOTP: async (phone, recaptchaId) => {
    set({ isLoading: true, phone });
    const result = await firebaseSendOTP(phone, recaptchaId);
    set({ isLoading: false });
    return result;
  },

  // Firebase-powered: Verify OTP
  verifyFirebaseOTP: async (code) => {
    set({ isLoading: true });
    const result = await firebaseVerifyOTP(code);
    if (result.success && result.user) {
      const uid = result.user.uid;
      const profile = await getUserProfile(uid);
      const providerCheck = await checkIsProvider(uid);
      set({
        isAuthenticated: true,
        isLoading: false,
        firebaseUid: uid,
        isProvider: providerCheck,
        user: profile
          ? {
              id: profile.id,
              name: profile.displayName || '',
              phone: profile.phoneNumber,
              email: profile.email,
            }
          : {
              id: uid,
              name: '',
              phone: get().phone,
            },
      });
    } else {
      set({ isLoading: false });
    }
    return { success: result.success, error: result.error };
  },

  // Firebase auth state listener
  initAuthListener: () => {
    return onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        const providerCheck = await checkIsProvider(firebaseUser.uid);
        set({
          isAuthenticated: true,
          firebaseUid: firebaseUser.uid,
          isProvider: providerCheck,
          user: profile
            ? {
                id: profile.id,
                name: profile.displayName || '',
                phone: profile.phoneNumber,
                email: profile.email,
              }
            : {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || '',
                phone: firebaseUser.phoneNumber || '',
              },
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          firebaseUid: null,
          isProvider: false,
        });
      }
    });
  },
}));
