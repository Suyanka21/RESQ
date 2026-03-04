import { create } from 'zustand';

interface ProviderLocation {
  latitude: number;
  longitude: number;
  heading: number;
}

interface TrackingState {
  providerLocation: ProviderLocation | null;
  customerLocation: { latitude: number; longitude: number } | null;
  eta: number;
  distance: number;
  isTracking: boolean;

  setProviderLocation: (location: ProviderLocation) => void;
  setCustomerLocation: (location: { latitude: number; longitude: number }) => void;
  setEta: (eta: number) => void;
  setDistance: (distance: number) => void;
  startTracking: () => void;
  stopTracking: () => void;
  reset: () => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  providerLocation: null,
  customerLocation: null,
  eta: 0,
  distance: 0,
  isTracking: false,

  setProviderLocation: (providerLocation) => set({ providerLocation }),
  setCustomerLocation: (customerLocation) => set({ customerLocation }),
  setEta: (eta) => set({ eta }),
  setDistance: (distance) => set({ distance }),
  startTracking: () => set({ isTracking: true }),
  stopTracking: () => set({ isTracking: false }),
  reset: () =>
    set({
      providerLocation: null,
      customerLocation: null,
      eta: 0,
      distance: 0,
      isTracking: false,
    }),
}));
