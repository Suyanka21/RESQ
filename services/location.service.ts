// ResQ Kenya - Location Service
// Device location management using Expo Location

import * as Location from 'expo-location';

export interface LocationResult {
    latitude: number;
    longitude: number;
    heading?: number | null;
    speed?: number | null;
    accuracy?: number | null;
    timestamp?: number;
}

/**
 * Request foreground location permissions
 */
export async function requestLocationPermission(): Promise<boolean> {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Location permission error:', error);
        return false;
    }
}

/**
 * Request background location permissions (for providers)
 */
export async function requestBackgroundLocationPermission(): Promise<boolean> {
    try {
        // First ensure foreground permission
        const foreground = await requestLocationPermission();
        if (!foreground) return false;

        const { status } = await Location.requestBackgroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('Background location permission error:', error);
        return false;
    }
}

/**
 * Get current device location
 */
export async function getCurrentLocation(): Promise<LocationResult | null> {
    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            console.warn('Location permission not granted');
            return null;
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
        };
    } catch (error) {
        console.error('Get location error:', error);
        return null;
    }
}

/**
 * Watch location changes (for real-time tracking)
 */
export async function watchLocation(
    callback: (location: LocationResult) => void,
    options?: {
        accuracy?: Location.Accuracy;
        distanceInterval?: number;
        timeInterval?: number;
    }
): Promise<Location.LocationSubscription | null> {
    try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) return null;

        return await Location.watchPositionAsync(
            {
                accuracy: options?.accuracy || Location.Accuracy.High,
                distanceInterval: options?.distanceInterval || 10,
                timeInterval: options?.timeInterval || 5000,
            },
            (location) => {
                callback({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    heading: location.coords.heading,
                    speed: location.coords.speed,
                    accuracy: location.coords.accuracy,
                    timestamp: location.timestamp,
                });
            }
        );
    } catch (error) {
        console.error('Watch location error:', error);
        return null;
    }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(
    latitude: number,
    longitude: number
): Promise<string> {
    try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (results.length > 0) {
            const addr = results[0];
            const parts = [
                addr.street,
                addr.district,
                addr.city,
                addr.region,
            ].filter(Boolean);
            return parts.join(', ') || 'Unknown location';
        }
        return 'Unknown location';
    } catch (error) {
        console.error('Reverse geocode error:', error);
        return 'Unknown location';
    }
}

/**
 * Geocode address to coordinates
 */
export async function geocodeAddress(
    address: string
): Promise<{ latitude: number; longitude: number } | null> {
    try {
        const results = await Location.geocodeAsync(address);
        if (results.length > 0) {
            return {
                latitude: results[0].latitude,
                longitude: results[0].longitude,
            };
        }
        return null;
    } catch (error) {
        console.error('Geocode error:', error);
        return null;
    }
}

/**
 * Calculate distance between two points (km)
 */
export function calculateDistance(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Calculate bearing between two points
 */
export function calculateBearing(
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number {
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
    const x = Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
        Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    return (bearing + 360) % 360;
}
