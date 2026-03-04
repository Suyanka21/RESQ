import { create } from 'zustand';
import {
  startTracking as rtStartTracking,
  subscribeToTracking,
  updateTrackingLocation,
  stopTracking as rtStopTracking,
  subscribeToProviderLocation,
} from '../services/realtime.service';

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
  requestId: string | null;

  setProviderLocation: (location: ProviderLocation) => void;
  setCustomerLocation: (location: { latitude: number; longitude: number }) => void;
  setEta: (eta: number) => void;
  setDistance: (distance: number) => void;
  startTracking: () => void;
  stopTracking: () => void;
  reset: () => void;

  // Firebase-powered actions
  initTracking: (requestId: string, providerLocation?: ProviderLocation, customerLocation?: { latitude: number; longitude: number }) => Promise<void>;
  subscribeToLiveTracking: (requestId: string) => () => void;
  updateLocation: (requestId: string, role: 'provider' | 'customer', location: { latitude: number; longitude: number; heading?: number }) => Promise<void>;
  endTracking: (requestId: string) => Promise<void>;
  watchProvider: (providerId: string) => () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  providerLocation: null,
  customerLocation: null,
  eta: 0,
  distance: 0,
  isTracking: false,
  requestId: null,

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
      requestId: null,
    }),

  // Firebase: Initialize tracking session
  initTracking: async (requestId, providerLocation, customerLocation) => {
    await rtStartTracking(requestId, {
      providerLocation: providerLocation || undefined,
      customerLocation: customerLocation || undefined,
    });
    set({ isTracking: true, requestId });
  },

  // Firebase: Subscribe to real-time tracking updates
  subscribeToLiveTracking: (requestId) => {
    set({ requestId });
    return subscribeToTracking(requestId, (data) => {
      if (!data) return;
      if (data.providerLocation) {
        set({
          providerLocation: {
            latitude: data.providerLocation.latitude,
            longitude: data.providerLocation.longitude,
            heading: data.providerLocation.heading || 0,
          },
        });
      }
      if (data.eta !== undefined) set({ eta: data.eta });
      if (data.distance !== undefined) set({ distance: data.distance });
    });
  },

  // Firebase: Update location during active service
  updateLocation: async (requestId, role, location) => {
    await updateTrackingLocation(requestId, role, location);
  },

  // Firebase: End tracking session
  endTracking: async (requestId) => {
    await rtStopTracking(requestId);
    set({ isTracking: false, requestId: null });
  },

  // Firebase: Watch a specific provider's live location
  watchProvider: (providerId) => {
    return subscribeToProviderLocation(providerId, (location) => {
      if (location) {
        set({
          providerLocation: {
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading || 0,
          },
        });
      }
    });
  },
}));
