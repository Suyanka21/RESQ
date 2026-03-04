import { create } from 'zustand';

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

  setServiceType: (type: ServiceType | null) => void;
  setStatus: (status: RequestStatus) => void;
  setLocation: (location: Location) => void;
  setDescription: (description: string) => void;
  setPrice: (price: number) => void;
  setProviderId: (id: string) => void;
  setEta: (eta: number) => void;
  reset: () => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  serviceType: null,
  status: 'idle',
  location: null,
  description: '',
  price: 0,
  providerId: null,
  eta: 0,

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
    }),
}));
