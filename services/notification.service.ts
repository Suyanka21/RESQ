// ResQ Kenya - Notification Service
// Push notifications using Expo Notifications + Firebase Cloud Messaging

import * as Notifications from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Platform } from 'react-native';

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    } catch (error) {
        console.error('Notification permission error:', error);
        return false;
    }
}

/**
 * Get Expo push token for the device
 */
export async function getExpoPushToken(): Promise<string | null> {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) return null;

        const token = await Notifications.getExpoPushTokenAsync();
        return token.data;
    } catch (error) {
        console.error('Get push token error:', error);
        return null;
    }
}

/**
 * Register push token in Firestore for the user
 */
export async function registerPushToken(userId: string, token: string): Promise<void> {
    if (!isFirebaseConfigured) {
        console.log('[Demo] Push token registered:', token.substring(0, 20) + '...');
        return;
    }

    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { fcmToken: token });
        console.log('Push token registered for user:', userId);
    } catch (error) {
        console.error('Register push token error:', error);
    }
}

/**
 * Set up Android notification channel
 */
export async function setupNotificationChannel(): Promise<void> {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('resq-emergency', {
            name: 'Emergency Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF3D3D',
            sound: 'default',
        });

        await Notifications.setNotificationChannelAsync('resq-updates', {
            name: 'Service Updates',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 150, 150, 150],
            lightColor: '#FFA500',
            sound: 'default',
        });
    }
}

/**
 * Configure notification handler behavior
 */
export function configureNotificationHandler(): void {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });
}

/**
 * Schedule a local notification
 */
export async function scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>,
    trigger?: Notifications.NotificationTriggerInput
): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: data || {},
            sound: 'default',
        },
        trigger: trigger || null,
    });
}

/**
 * Add listener for foreground notifications
 */
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add listener for notification taps (background/killed)
 */
export function addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Remove notification listener
 */
export function removeListener(subscription: Notifications.Subscription): void {
    Notifications.removeNotificationSubscription(subscription);
}
