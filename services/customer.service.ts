// ResQ Kenya - Customer Service
// Client-side functions for customer operations via Cloud Functions

import { httpsCallable } from 'firebase/functions';
import { doc, onSnapshot, collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { functions, db, isFirebaseConfigured } from '../config/firebase';
import type { ServiceRequest } from '../types';

interface CreateRequestParams {
    serviceType: string;
    location: {
        latitude: number;
        longitude: number;
        address: string;
        landmark?: string;
        instructions?: string;
    };
    serviceDetails: Record<string, unknown>;
    vehicleInfo?: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        fuelType: string;
    };
}

/**
 * Create a new service request
 */
export async function createServiceRequest(params: CreateRequestParams): Promise<{
    success: boolean;
    requestId?: string;
    error?: string;
}> {
    if (!isFirebaseConfigured) {
        return simulateDemoRequest(params);
    }

    try {
        const createRequest = httpsCallable(functions, 'createServiceRequest');
        const result = await createRequest(params);
        const data = result.data as { requestId: string };

        return {
            success: true,
            requestId: data.requestId,
        };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Create request error:', error);
        return {
            success: false,
            error: err.message || 'Failed to create request',
        };
    }
}

/**
 * Cancel a service request
 */
export async function cancelServiceRequest(requestId: string, reason?: string): Promise<{
    success: boolean;
    error?: string;
}> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Request cancelled:', requestId);
        return { success: true };
    }

    try {
        const cancelRequest = httpsCallable(functions, 'updateRequestStatus');
        await cancelRequest({
            requestId,
            status: 'cancelled',
            reason: reason || 'Cancelled by customer',
        });

        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Cancel request error:', error);
        return {
            success: false,
            error: err.message || 'Failed to cancel request',
        };
    }
}

/**
 * Subscribe to real-time request updates
 */
export function subscribeToRequestUpdates(
    requestId: string,
    callback: (request: ServiceRequest | null) => void
): () => void {
    if (!isFirebaseConfigured) {
        return () => {};
    }

    const requestRef = doc(db, 'requests', requestId);

    return onSnapshot(requestRef, (snapshot) => {
        if (snapshot.exists()) {
            callback({ id: snapshot.id, ...snapshot.data() } as ServiceRequest);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error('Request subscription error:', error);
        callback(null);
    });
}

/**
 * Get customer's request history
 */
export async function getRequestHistory(
    userId: string,
    limitCount: number = 20
): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured) return [];

    try {
        const requestsRef = collection(db, 'requests');
        const q = query(
            requestsRef,
            where('userId', '==', userId),
            orderBy('timeline.requestedAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        } as ServiceRequest));
    } catch (error) {
        console.error('Get request history error:', error);
        return [];
    }
}

/**
 * Add rating to completed request
 */
export async function addRating(
    requestId: string,
    rating: { stars: number; review?: string; tags?: string[] }
): Promise<{ success: boolean; error?: string }> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Rating added:', rating);
        return { success: true };
    }

    try {
        const addRatingFn = httpsCallable(functions, 'updateRequestStatus');
        await addRatingFn({
            requestId,
            rating,
        });
        return { success: true };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Add rating error:', error);
        return {
            success: false,
            error: err.message || 'Failed to add rating',
        };
    }
}

/**
 * Get estimated price for service
 */
export async function getServicePrice(params: {
    serviceType: string;
    location: { latitude: number; longitude: number };
    serviceDetails?: Record<string, unknown>;
}): Promise<{
    baseServiceFee: number;
    distanceFee: number;
    platformFee: number;
    total: number;
}> {
    if (!isFirebaseConfigured) {
        // Return fallback pricing in demo mode
        return {
            baseServiceFee: 1500,
            distanceFee: 0,
            platformFee: 150,
            total: 1650,
        };
    }

    try {
        const getPriceFn = httpsCallable(functions, 'getPriceQuote');
        const result = await getPriceFn(params);
        return result.data as {
            baseServiceFee: number;
            distanceFee: number;
            platformFee: number;
            total: number;
        };
    } catch (error) {
        console.error('Get price error:', error);
        // Return fallback pricing
        return {
            baseServiceFee: 1500,
            distanceFee: 0,
            platformFee: 150,
            total: 1650,
        };
    }
}

/**
 * Demo: Simulate service request flow for testing
 */
export async function simulateDemoRequest(params: CreateRequestParams): Promise<{
    success: boolean;
    requestId: string;
}> {
    console.log('[Demo] Request:', params);

    const demoRequestId = `demo_${Date.now()}`;

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                requestId: demoRequestId,
            });
        }, 1500);
    });
}
