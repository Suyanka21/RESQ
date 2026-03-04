// ResQ Kenya - Backend Services Barrel Export
// Re-exports all service modules for clean imports

// Authentication
export {
    formatPhoneNumber,
    sendOTP,
    verifyOTP,
    getUserProfile,
    signOut,
    getCurrentUser,
    onAuthChange,
    checkIsProvider,
} from '../auth.service';

// Payment (M-Pesa)
export {
    initiatePayment,
    queryPaymentStatus,
    subscribeToPaymentStatus,
    formatPhoneForDisplay,
    formatAmount,
    isValidMpesaPhone,
    initiateDemoPayment,
} from '../payment.service';

// Customer Operations
export {
    createServiceRequest,
    cancelServiceRequest,
    subscribeToRequestUpdates,
    getRequestHistory,
    addRating,
    getServicePrice,
    simulateDemoRequest,
} from '../customer.service';

// Provider Operations
export {
    updateProviderLocation,
    setProviderAvailability,
    acceptRequest,
    updateRequestStatus,
    getNearbyRequests,
    subscribeToIncomingRequests,
    getProviderHistory,
    getProviderProfile,
} from '../provider.service';

// Location
export {
    requestLocationPermission,
    requestBackgroundLocationPermission,
    getCurrentLocation,
    watchLocation,
    reverseGeocode,
    geocodeAddress,
    calculateDistance,
    calculateBearing,
} from '../location.service';

// Realtime Tracking
export {
    startTracking,
    updateTrackingLocation,
    subscribeToTracking,
    updateTrackingStatus,
    stopTracking,
    broadcastProviderLocation,
    subscribeToProviderLocation,
} from '../realtime.service';

// Notifications
export {
    requestNotificationPermissions,
    getExpoPushToken,
    registerPushToken,
    setupNotificationChannel,
    configureNotificationHandler,
    scheduleLocalNotification,
    addNotificationReceivedListener,
    addNotificationResponseListener,
    removeListener,
} from '../notification.service';

// Error Handling
export {
    ErrorSeverity,
    ErrorCategory,
    logError,
    handleError,
    withErrorHandling,
    retryWithBackoff,
    getErrorMessage,
    isNetworkError,
} from '../error.service';
