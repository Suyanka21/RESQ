// ResQ Kenya - Error Handling & Logging Service

export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum ErrorCategory {
    NETWORK = 'network',
    AUTH = 'auth',
    PAYMENT = 'payment',
    LOCATION = 'location',
    FIREBASE = 'firebase',
    VALIDATION = 'validation',
    UNKNOWN = 'unknown',
}

interface ErrorLog {
    message: string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    context?: string;
    timestamp: Date;
    stack?: string;
}

/**
 * Log error to console (and optionally to Firebase in production)
 */
export function logError(
    error: unknown,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: string
): ErrorLog {
    const errorLog: ErrorLog = {
        message: getErrorMessage(error),
        category,
        severity,
        context,
        timestamp: new Date(),
        stack: error instanceof Error ? error.stack : undefined,
    };

    // Console logging based on severity
    if (severity === ErrorSeverity.CRITICAL || severity === ErrorSeverity.HIGH) {
        console.error(`[${category.toUpperCase()}]`, errorLog.message, context || '');
    } else {
        console.warn(`[${category.toUpperCase()}]`, errorLog.message, context || '');
    }

    return errorLog;
}

/**
 * Centralized error handler with user-friendly messages
 */
export function handleError(
    error: unknown,
    context?: string
): { userMessage: string; category: ErrorCategory } {
    const message = getErrorMessage(error);

    if (isNetworkError(error)) {
        return {
            userMessage: 'Connection lost. Please check your internet and try again.',
            category: ErrorCategory.NETWORK,
        };
    }

    if (message.includes('auth/') || message.includes('authentication')) {
        return {
            userMessage: 'Authentication error. Please sign in again.',
            category: ErrorCategory.AUTH,
        };
    }

    if (message.includes('payment') || message.includes('mpesa') || message.includes('M-Pesa')) {
        return {
            userMessage: 'Payment processing error. Please try again.',
            category: ErrorCategory.PAYMENT,
        };
    }

    if (message.includes('location') || message.includes('permission')) {
        return {
            userMessage: 'Location access required. Please enable location services.',
            category: ErrorCategory.LOCATION,
        };
    }

    if (message.includes('firebase') || message.includes('firestore')) {
        return {
            userMessage: 'Service temporarily unavailable. Please try again shortly.',
            category: ErrorCategory.FIREBASE,
        };
    }

    logError(error, ErrorCategory.UNKNOWN, ErrorSeverity.MEDIUM, context);

    return {
        userMessage: 'Something went wrong. Please try again.',
        category: ErrorCategory.UNKNOWN,
    };
}

/**
 * Wrap async functions with automatic error handling
 */
export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: string
): Promise<{ data?: T; error?: string }> {
    try {
        const data = await fn();
        return { data };
    } catch (error) {
        const { userMessage } = handleError(error, context);
        return { error: userMessage };
    }
}

/**
 * Retry failed operations with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}

/**
 * Extract user-friendly message from any error type
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (typeof error === 'object' && error !== null) {
        const errObj = error as { message?: string; error?: string };
        return errObj.message || errObj.error || 'Unknown error';
    }
    return 'An unexpected error occurred';
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
    const message = getErrorMessage(error).toLowerCase();
    return (
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('fetch') ||
        message.includes('connection') ||
        message.includes('econnrefused') ||
        message.includes('offline')
    );
}
