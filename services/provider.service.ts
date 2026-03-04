// ResQ Kenya - Provider Service
// Cloud Functions integration for provider operations

import { httpsCallable } from 'firebase/functions';
import { doc, onSnapshot, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { functions, db, isFirebaseConfigured } from '../config/firebase';
import type { ServiceRequest, Provider } from '../types';

/**
 * Update provider's current location
 */
export async function updateProviderLocation(
    providerId: string,
    location: { latitude: number; longitude: number; heading?: number }
): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Provider location updated:', location);
        return { success: true };
    }

    try {
        const updateLocation = httpsCallable(functions, 'updateProviderLocation');
        await updateLocation({ providerId, ...location });
        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Update location error:', error);
        return { success: false, error: err.message };
    }
}

/**
 * Set provider online/offline status
 */
export async function setProviderAvailability(
    providerId: string,
    isOnline: boolean
): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Provider availability:', isOnline);
        return { success: true };
    }

    try {
        const setAvailability = httpsCallable(functions, 'setProviderAvailability');
        await setAvailability({ providerId, isOnline });
        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Set availability error:', error);
        return { success: false, error: err.message };
    }
}

/**
 * Accept a service request
 */
export async function acceptRequest(
    requestId: string,
    providerId: string,
    estimatedArrival: number
): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Request accepted:', requestId);
        return { success: true };
    }

    try {
        const acceptFn = httpsCallable(functions, 'acceptServiceRequest');
        await acceptFn({ requestId, providerId, estimatedArrival });
        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Accept request error:', error);
        return { success: false, error: err.message };
    }
}

/**
 * Update request status (enroute, arrived, inProgress, completed)
 */
export async function updateRequestStatus(
    requestId: string,
    status: string,
    metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Request status updated:', status);
        return { success: true };
    }

    try {
        const updateStatus = httpsCallable(functions, 'updateRequestStatus');
        await updateStatus({ requestId, status, ...metadata });
        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Update status error:', error);
        return { success: false, error: err.message };
    }
}

/**
 * Get nearby pending requests for provider
 */
export async function getNearbyRequests(
    _providerId: string,
    location: { latitude: number; longitude: number },
    radiusKm: number = 10
): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured) return [];

    try {
        const requestsRef = collection(db, 'requests');
        const q = query(
            requestsRef,
            where('status', '==', 'pending'),
            orderBy('timeline.requestedAt', 'desc'),
            limit(20)
        );

        const snapshot = await getDocs(q);
        const requests = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        } as ServiceRequest));

        // Filter by distance on client (for simplicity; server-side geo-query preferred)
        return requests.filter(request => {
            if (!request.customerLocation?.coordinates) return false;
            const distance = calculateDistance(
                location.latitude,
                location.longitude,
                request.customerLocation.coordinates.latitude,
                request.customerLocation.coordinates.longitude
            );
            return distance <= radiusKm;
        });
    } catch (error) {
        console.error('Get nearby requests error:', error);
        return [];
    }
}

/**
 * Subscribe to incoming requests for a provider
 */
export function subscribeToIncomingRequests(
    _providerId: string,
    callback: (requests: ServiceRequest[]) => void
): () => void {
    if (!isFirebaseConfigured) {
        return () => {};
    }

    const requestsRef = collection(db, 'requests');
    const q = query(
        requestsRef,
        where('status', '==', 'pending'),
        orderBy('timeline.requestedAt', 'desc'),
        limit(10)
    );

    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        } as ServiceRequest));
        callback(requests);
    });
}

/**
 * Get provider's service history
 */
export async function getProviderHistory(
    providerId: string,
    limitCount: number = 20
): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured) return [];

    try {
        const requestsRef = collection(db, 'requests');
        const q = query(
            requestsRef,
            where('providerId', '==', providerId),
            orderBy('timeline.requestedAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        } as ServiceRequest));
    } catch (error) {
        console.error('Get provider history error:', error);
        return [];
    }
}

/**
 * Get provider profile from Firestore
 */
export async function getProviderProfile(providerId: string): Promise<Provider | null> {
    if (!isFirebaseConfigured) return null;

    try {
        const providerRef = doc(db, 'providers', providerId);
        const providerSnap = await getDocs(query(collection(db, 'providers'), where('__name__', '==', providerId), limit(1)));

        if (!providerSnap.empty) {
            const docSnap = providerSnap.docs[0];
            return { id: docSnap.id, ...docSnap.data() } as Provider;
        }
        return null;
    } catch (error) {
        console.error('Get provider profile error:', error);
        return null;
    }
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
