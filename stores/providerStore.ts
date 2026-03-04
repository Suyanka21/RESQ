import { create } from 'zustand';
import {
  updateProviderLocation as fbUpdateLocation,
  setProviderAvailability as fbSetAvailability,
  acceptRequest as fbAcceptRequest,
  updateRequestStatus as fbUpdateStatus,
  subscribeToIncomingRequests,
  getProviderHistory,
  getProviderProfile,
} from '../services/provider.service';

export type JobStatus =
  | 'idle'
  | 'incoming'
  | 'accepted'
  | 'navigating'
  | 'arrived'
  | 'in_service'
  | 'completed';

interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  location: { latitude: number; longitude: number; address: string };
  price: number;
  distance: number;
  eta: number;
}

interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  total: number;
  jobsCompleted: number;
}

interface ProviderState {
  isAvailable: boolean;
  jobStatus: JobStatus;
  currentJob: Job | null;
  earnings: EarningsSummary;
  rating: number;
  completedJobs: number;

  setAvailable: (available: boolean) => void;
  setJobStatus: (status: JobStatus) => void;
  setCurrentJob: (job: Job | null) => void;
  updateEarnings: (earnings: Partial<EarningsSummary>) => void;
  reset: () => void;

  // Firebase-powered actions
  goOnline: (providerId: string) => Promise<{ success: boolean; error?: string }>;
  goOffline: (providerId: string) => Promise<{ success: boolean; error?: string }>;
  sendLocation: (providerId: string, location: { latitude: number; longitude: number; heading?: number }) => Promise<void>;
  acceptJob: (requestId: string, providerId: string, eta: number) => Promise<{ success: boolean; error?: string }>;
  updateJobStatus: (requestId: string, status: string) => Promise<{ success: boolean; error?: string }>;
  listenForJobs: (providerId: string) => () => void;
  loadProfile: (providerId: string) => Promise<void>;
}

const defaultEarnings: EarningsSummary = {
  today: 0,
  week: 0,
  month: 0,
  total: 0,
  jobsCompleted: 0,
};

export const useProviderStore = create<ProviderState>((set, get) => ({
  isAvailable: false,
  jobStatus: 'idle',
  currentJob: null,
  earnings: defaultEarnings,
  rating: 4.8,
  completedJobs: 127,

  setAvailable: (isAvailable) => set({ isAvailable }),
  setJobStatus: (jobStatus) => set({ jobStatus }),
  setCurrentJob: (currentJob) => set({ currentJob }),
  updateEarnings: (earnings) =>
    set((state) => ({ earnings: { ...state.earnings, ...earnings } })),
  reset: () =>
    set({
      isAvailable: false,
      jobStatus: 'idle',
      currentJob: null,
      earnings: defaultEarnings,
    }),

  // Firebase: Go online
  goOnline: async (providerId) => {
    const result = await fbSetAvailability(providerId, true);
    if (result.success) set({ isAvailable: true });
    return result;
  },

  // Firebase: Go offline
  goOffline: async (providerId) => {
    const result = await fbSetAvailability(providerId, false);
    if (result.success) set({ isAvailable: false });
    return result;
  },

  // Firebase: Send live location
  sendLocation: async (providerId, location) => {
    await fbUpdateLocation(providerId, location);
  },

  // Firebase: Accept incoming job
  acceptJob: async (requestId, providerId, eta) => {
    const result = await fbAcceptRequest(requestId, providerId, eta);
    if (result.success) {
      set({ jobStatus: 'accepted' });
    }
    return result;
  },

  // Firebase: Update job status
  updateJobStatus: async (requestId, status) => {
    const result = await fbUpdateStatus(requestId, status);
    if (result.success) {
      const statusMap: Record<string, JobStatus> = {
        enroute: 'navigating',
        arrived: 'arrived',
        inProgress: 'in_service',
        completed: 'completed',
      };
      const mappedStatus = statusMap[status];
      if (mappedStatus) set({ jobStatus: mappedStatus });
    }
    return result;
  },

  // Firebase: Listen for incoming job requests
  listenForJobs: (providerId) => {
    return subscribeToIncomingRequests(providerId, (requests) => {
      if (requests.length > 0 && get().jobStatus === 'idle') {
        const incoming = requests[0];
        set({
          jobStatus: 'incoming',
          currentJob: {
            id: incoming.id,
            customerName: 'Customer',
            customerPhone: '',
            serviceType: incoming.serviceType,
            location: {
              latitude: incoming.customerLocation?.coordinates?.latitude || 0,
              longitude: incoming.customerLocation?.coordinates?.longitude || 0,
              address: incoming.customerLocation?.address || '',
            },
            price: incoming.pricing?.total || 0,
            distance: 0,
            eta: 0,
          },
        });
      }
    });
  },

  // Firebase: Load provider profile
  loadProfile: async (providerId) => {
    const profile = await getProviderProfile(providerId);
    if (profile) {
      set({
        rating: profile.rating,
        completedJobs: profile.totalServices,
        earnings: {
          today: profile.earnings?.today || 0,
          week: profile.earnings?.thisWeek || 0,
          month: profile.earnings?.thisMonth || 0,
          total: profile.earnings?.allTime || 0,
          jobsCompleted: profile.totalServices,
        },
      });
    }
  },
}));
