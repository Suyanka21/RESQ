import { create } from 'zustand';

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
  phone: string;
  otp: string;
  user: UserProfile | null;
  vehicles: Vehicle[];
  authMode: 'signin' | 'signup';

  setPhone: (phone: string) => void;
  setOtp: (otp: string) => void;
  setAuthMode: (mode: 'signin' | 'signup') => void;
  login: (user: UserProfile) => void;
  logout: () => void;
  setIsProvider: (isProvider: boolean) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isProvider: false,
  phone: '',
  otp: '',
  user: null,
  vehicles: [],
  authMode: 'signup',

  setPhone: (phone) => set({ phone }),
  setOtp: (otp) => set({ otp }),
  setAuthMode: (authMode) => set({ authMode }),
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null, phone: '', otp: '' }),
  setIsProvider: (isProvider) => set({ isProvider }),
  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
  removeVehicle: (id) =>
    set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),
}));
