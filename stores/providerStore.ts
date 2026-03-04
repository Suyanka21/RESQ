import { create } from 'zustand';

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
}

const defaultEarnings: EarningsSummary = {
  today: 0,
  week: 0,
  month: 0,
  total: 0,
  jobsCompleted: 0,
};

export const useProviderStore = create<ProviderState>((set) => ({
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
}));
