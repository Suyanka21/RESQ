import { create } from 'zustand';
import {
  createServiceRequest,
  cancelServiceRequest,
  subscribeToRequestUpdates,
  getRequestHistory,
  addRating,
  getServicePrice,
} from '../services/customer.service';
import { isFirebaseConfigured } from '../config/firebase';
import type { ServiceRequest } from '../types';

export type ServiceType =
  | 'towing'
  | 'battery'
  | 'medical'
  | 'fuel'
  | 'tire'
  | 'diagnostic';

export type RequestStatus =
  | 'idle'
  | 'selecting'
  | 'confirming'
  | 'searching'
  | 'matched'
  | 'tracking'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'rated'
  | 'cancelled';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface RequestState {
  serviceType: ServiceType | null;
  status: RequestStatus;
  location: Location | null;
  description: string;
  price: number;
  providerId: string | null;
  eta: number;
  requestId: string | null;
  history: ServiceRequest[];

  setServiceType: (type: ServiceType | null) => void;
  setStatus: (status: RequestStatus) => void;
  setLocation: (location: Location) => void;
  setDescription: (description: string) => void;
  setPrice: (price: number) => void;
  setProviderId: (id: string) => void;
  setEta: (eta: number) => void;
  reset: () => void;

  // Firebase-powered actions
  submitRequest: (params: {
    serviceType: string;
    location: { latitude: number; longitude: number; address: string; landmark?: string; instructions?: string };
    serviceDetails: Record<string, unknown>;
  }) => Promise<{ success: boolean; requestId?: string; error?: string }>;
  cancelRequest: (reason?: string) => Promise<{ success: boolean; error?: string }>;
  subscribeToUpdates: (requestId: string) => () => void;
  fetchHistory: (userId: string) => Promise<void>;
  submitRating: (stars: number, review?: string, tags?: string[]) => Promise<{ success: boolean; error?: string }>;
  fetchPrice: (serviceType: string, location: { latitude: number; longitude: number }) => Promise<number>;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  serviceType: null,
  status: 'idle',
  location: null,
  description: '',
  price: 0,
  providerId: null,
  eta: 0,
  requestId: null,
  history: [],

  setServiceType: (serviceType) => set({ serviceType }),
  setStatus: (status) => set({ status }),
  setLocation: (location) => set({ location }),
  setDescription: (description) => set({ description }),
  setPrice: (price) => set({ price }),
  setProviderId: (providerId) => set({ providerId }),
  setEta: (eta) => set({ eta }),
  reset: () =>
    set({
      serviceType: null,
      status: 'idle',
      location: null,
      description: '',
      price: 0,
      providerId: null,
      eta: 0,
      requestId: null,
    }),

  // Firebase: Submit service request
  submitRequest: async (params) => {
    set({ status: 'searching' });
    const result = await createServiceRequest(params);
    if (result.success && result.requestId) {
      set({ requestId: result.requestId });
    } else {
      set({ status: 'idle' });
    }
    return result;
  },

  // Firebase: Cancel current request
  cancelRequest: async (reason) => {
    const { requestId } = get();
    if (!requestId) return { success: false, error: 'No active request' };
    const result = await cancelServiceRequest(requestId, reason);
    if (result.success) {
      set({ status: 'cancelled' });
    }
    return result;
  },

  // Firebase: Subscribe to real-time request updates
  subscribeToUpdates: (requestId) => {
    return subscribeToRequestUpdates(requestId, (request) => {
      if (!request) return;

      // Map Firestore status to local status
      const statusMap: Record<string, RequestStatus> = {
        pending: 'searching',
        accepted: 'matched',
        enroute: 'tracking',
        arrived: 'arriving',
        inProgress: 'in_progress',
        completed: 'completed',
        cancelled: 'cancelled',
      };

      set({
        status: statusMap[request.status] || get().status,
        providerId: request.providerId || get().providerId,
        price: request.pricing?.total || get().price,
      });
    });
  },

  // Firebase: Fetch request history
  fetchHistory: async (userId) => {
    const requests = await getRequestHistory(userId);
    set({ history: requests });
  },

  // Firebase: Submit rating
  submitRating: async (stars, review, tags) => {
    const { requestId } = get();
    if (!requestId) return { success: false, error: 'No active request' };
    const result = await addRating(requestId, { stars, review, tags });
    if (result.success) {
      set({ status: 'rated' });
    }
    return result;
  },

  // Firebase: Fetch estimated price
  fetchPrice: async (serviceType, location) => {
    const pricing = await getServicePrice({ serviceType, location });
    set({ price: pricing.total });
    return pricing.total;
  },
}));
