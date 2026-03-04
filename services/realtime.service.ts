// ResQ Kenya - Realtime Database Service
// Manages live tracking data using Firebase Realtime Database

import { ref, set, onValue, update, remove, serverTimestamp } from 'firebase/database';
import { rtdb, isFirebaseConfigured } from '../config/firebase';
import type { GeoLocation } from '../types';

interface TrackingData {
    requestId: string;
    status: string;
    providerLocation?: GeoLocation;
    customerLocation?: GeoLocation;
    eta?: number;
    distance?: number;
    updatedAt?: object;
}

/**
 * Start tracking for a service request
 */
export async function startTracking(
    requestId: string,
    data: {
        providerLocation?: GeoLocation;
        customerLocation?: GeoLocation;
        eta?: number;
    }
): Promise<void> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Tracking started for:', requestId);
        return;
    }

    const trackingRef = ref(rtdb, `tracking/${requestId}`);
    await set(trackingRef, {
        ...data,
        status: 'active',
        updatedAt: serverTimestamp(),
    });
}

/**
 * Update live location during active service
 */
export async function updateTrackingLocation(
    requestId: string,
    role: 'provider' | 'customer',
    location: GeoLocation
): Promise<void> {
    if (!isFirebaseConfigured) return;

    const locationRef = ref(rtdb, `tracking/${requestId}/${role}Location`);
    await set(locationRef, {
        ...location,
        timestamp: serverTimestamp(),
    });
}

/**
 * Subscribe to tracking data changes
 */
export function subscribeToTracking(
    requestId: string,
    callback: (data: TrackingData | null) => void
): () => void {
    if (!isFirebaseConfigured) {
        return () => {};
    }

    const trackingRef = ref(rtdb, `tracking/${requestId}`);

    const unsubscribe = onValue(trackingRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val() as TrackingData);
        } else {
            callback(null);
        }
    });

    return unsubscribe;
}

/**
 * Update tracking status
 */
export async function updateTrackingStatus(
    requestId: string,
    status: string
): Promise<void> {
    if (!isFirebaseConfigured) return;

    const trackingRef = ref(rtdb, `tracking/${requestId}`);
    await update(trackingRef, {
        status,
        updatedAt: serverTimestamp(),
    });
}

/**
 * Stop tracking (remove tracking data)
 */
export async function stopTracking(requestId: string): Promise<void> {
    if (!isFirebaseConfigured) return;

    const trackingRef = ref(rtdb, `tracking/${requestId}`);
    await remove(trackingRef);
}

/**
 * Broadcast provider location for nearby customer visibility
 */
export async function broadcastProviderLocation(
    providerId: string,
    location: GeoLocation
): Promise<void> {
    if (!isFirebaseConfigured) return;

    const locationRef = ref(rtdb, `provider_locations/${providerId}`);
    await set(locationRef, {
        ...location,
        timestamp: serverTimestamp(),
    });
}

/**
 * Subscribe to a specific provider's live location
 */
export function subscribeToProviderLocation(
    providerId: string,
    callback: (location: GeoLocation | null) => void
): () => void {
    if (!isFirebaseConfigured) {
        return () => {};
    }

    const locationRef = ref(rtdb, `provider_locations/${providerId}`);

    const unsubscribe = onValue(locationRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val() as GeoLocation);
        } else {
            callback(null);
        }
    });

    return unsubscribe;
}
