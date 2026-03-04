// ResQ Kenya - M-Pesa Payment Service (Client-Side)

import { httpsCallable } from 'firebase/functions';
import { doc, onSnapshot } from 'firebase/firestore';
import { functions, db, isFirebaseConfigured } from '../config/firebase';
import type { PaymentRequest, PaymentResult, PaymentStatus } from '../types';

/**
 * Initiate M-Pesa STK Push payment
 */
export async function initiatePayment(payment: PaymentRequest): Promise<PaymentResult> {
    if (!isFirebaseConfigured) {
        return initiateDemoPayment(payment);
    }

    try {
        const initiateStkPush = httpsCallable(functions, 'initiateStkPush');

        const result = await initiateStkPush({
            phoneNumber: payment.phoneNumber,
            amount: payment.amount,
            requestId: payment.requestId,
            description: payment.description || 'ResQ Service Payment',
        });

        const data = result.data as PaymentResult;
        return data;
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error('Payment initiation error:', error);
        return {
            success: false,
            error: err.message || 'Failed to initiate payment',
        };
    }
}

/**
 * Query M-Pesa payment status
 */
export async function queryPaymentStatus(
    checkoutRequestID: string
): Promise<{ resultCode: string; resultDesc: string }> {
    if (!isFirebaseConfigured) {
        return { resultCode: '0', resultDesc: 'Demo payment completed' };
    }

    try {
        const queryStkStatus = httpsCallable(functions, 'queryStkStatus');
        const result = await queryStkStatus({ checkoutRequestID });
        return result.data as { resultCode: string; resultDesc: string };
    } catch (error: unknown) {
        console.error('Payment query error:', error);
        return { resultCode: '-1', resultDesc: 'Query failed' };
    }
}

/**
 * Subscribe to real-time payment status updates
 */
export function subscribeToPaymentStatus(
    requestId: string,
    callback: (status: PaymentStatus) => void
): () => void {
    if (!isFirebaseConfigured) {
        // Simulate payment completion in demo mode
        const timer = setTimeout(() => {
            callback({
                status: 'completed',
                mpesaReceiptNumber: `DEMO_${Date.now()}`,
                resultDesc: 'Demo payment successful',
            });
        }, 3000);
        return () => clearTimeout(timer);
    }

    const paymentRef = doc(db, 'payment_requests', requestId);

    return onSnapshot(paymentRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.data();
            callback({
                status: data.status,
                mpesaReceiptNumber: data.mpesaReceiptNumber,
                resultDesc: data.resultDesc,
            });
        }
    });
}

/**
 * Format phone number for display (0712 345 678)
 */
export function formatPhoneForDisplay(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
        const local = '0' + cleaned.slice(3);
        return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
    }
    return phone;
}

/**
 * Format amount for display (KES 1,500)
 */
export function formatAmount(amount: number): string {
    return `KES ${amount.toLocaleString('en-KE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

/**
 * Validate M-Pesa phone number
 */
export function isValidMpesaPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
        return cleaned.length === 12;
    }
    if (cleaned.startsWith('0')) {
        return cleaned.length === 10;
    }
    return cleaned.length === 9;
}

/**
 * Demo payment for testing (bypasses M-Pesa API)
 */
export async function initiateDemoPayment(payment: PaymentRequest): Promise<PaymentResult> {
    console.log('[Demo] Payment initiated:', payment);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                checkoutRequestID: `demo_${Date.now()}`,
                merchantRequestID: `demo_merchant_${Date.now()}`,
            });
        }, 2000);
    });
}
