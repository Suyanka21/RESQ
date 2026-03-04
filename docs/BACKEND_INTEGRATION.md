# ResQ Kenya - Backend Integration Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   React Native App                   │
│                  (Expo / TypeScript)                  │
├──────────┬──────────┬──────────┬────────────────────┤
│ authStore│requestSt │trackingSt│  providerStore     │
│ (Zustand)│ (Zustand) │ (Zustand)│  (Zustand)        │
├──────────┴──────────┴──────────┴────────────────────┤
│                   Service Layer                      │
│  auth.service │ payment.service │ customer.service   │
│  provider.service │ location.service │ realtime.svc  │
│  notification.service │ error.service                │
├─────────────────────────────────────────────────────┤
│                  Firebase SDK                        │
│  Auth │ Firestore │ Realtime DB │ Functions │ FCM    │
├─────────────────────────────────────────────────────┤
│              Firebase Cloud Functions                 │
│  (RESQ-KENYA/functions/src - deployed separately)    │
│  M-Pesa STK Push │ Request Lifecycle │ AI Dispatch   │
└─────────────────────────────────────────────────────┘
```

## Firebase Project

- **Project ID:** `res-q-c0b59`
- **Backend Repo:** [RESQ-KENYA](https://github.com/Suyanka21/RESQ-KENYA)
- **Cloud Functions Runtime:** Node.js 18

## Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.example .env.local
```

Required variables:
| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `EXPO_PUBLIC_FIREBASE_DATABASE_URL` | Realtime Database URL |

### Demo Mode

When Firebase is not configured (no API key), the app runs in **demo mode**:
- Auth: OTP send/verify are simulated locally
- Payments: M-Pesa transactions return mock success after 2s delay
- Requests: Service requests use local state only
- Tracking: No real-time updates

## Service Layer API Reference

### Auth Service (`services/auth.service.ts`)

| Function | Description | Firebase Service |
|----------|-------------|-----------------|
| `formatPhoneNumber(phone)` | Format to +254 international | Local |
| `sendOTP(phone, recaptchaId?)` | Send verification code | Firebase Auth |
| `verifyOTP(code)` | Verify OTP and create profile | Firebase Auth + Firestore |
| `getUserProfile(userId)` | Get user document | Firestore |
| `checkIsProvider(userId)` | Check if user has provider profile | Firestore |
| `signOut()` | Sign out current user | Firebase Auth |
| `onAuthChange(callback)` | Subscribe to auth state | Firebase Auth |

### Payment Service (`services/payment.service.ts`)

| Function | Description | Firebase Service |
|----------|-------------|-----------------|
| `initiatePayment(payment)` | Trigger M-Pesa STK Push | Cloud Functions |
| `queryPaymentStatus(checkoutId)` | Poll payment status | Cloud Functions |
| `subscribeToPaymentStatus(requestId, cb)` | Real-time payment updates | Firestore |
| `formatAmount(amount)` | Format as KES currency | Local |
| `isValidMpesaPhone(phone)` | Validate Safaricom number | Local |

### Customer Service (`services/customer.service.ts`)

| Function | Description | Firebase Service |
|----------|-------------|-----------------|
| `createServiceRequest(params)` | Create new request | Cloud Functions |
| `cancelServiceRequest(requestId)` | Cancel active request | Cloud Functions |
| `subscribeToRequestUpdates(id, cb)` | Real-time request status | Firestore |
| `getRequestHistory(userId)` | Past service requests | Firestore |
| `addRating(requestId, rating)` | Rate completed service | Cloud Functions |
| `getServicePrice(params)` | Get price estimate | Cloud Functions |

### Provider Service (`services/provider.service.ts`)

| Function | Description | Firebase Service |
|----------|-------------|-----------------|
| `updateProviderLocation(id, loc)` | Send GPS position | Cloud Functions |
| `setProviderAvailability(id, online)` | Toggle online/offline | Cloud Functions |
| `acceptRequest(requestId, providerId)` | Accept job | Cloud Functions |
| `updateRequestStatus(id, status)` | Update job progress | Cloud Functions |
| `subscribeToIncomingRequests(id, cb)` | Listen for new jobs | Firestore |
| `getProviderHistory(id)` | Past completed jobs | Firestore |
| `getProviderProfile(id)` | Get provider document | Firestore |

### Location Service (`services/location.service.ts`)

| Function | Description | API |
|----------|-------------|-----|
| `getCurrentLocation()` | Get device GPS | Expo Location |
| `watchLocation(callback, options)` | Continuous GPS tracking | Expo Location |
| `reverseGeocode(lat, lng)` | Coordinates → address | Expo Location |
| `geocodeAddress(address)` | Address → coordinates | Expo Location |
| `calculateDistance(lat1, lon1, lat2, lon2)` | Haversine distance (km) | Local |

### Realtime Service (`services/realtime.service.ts`)

| Function | Description | Firebase Service |
|----------|-------------|-----------------|
| `startTracking(requestId, data)` | Initialize tracking session | Realtime DB |
| `updateTrackingLocation(id, role, loc)` | Update live position | Realtime DB |
| `subscribeToTracking(requestId, cb)` | Listen to tracking updates | Realtime DB |
| `stopTracking(requestId)` | End tracking session | Realtime DB |
| `broadcastProviderLocation(id, loc)` | Broadcast for nearby view | Realtime DB |
| `subscribeToProviderLocation(id, cb)` | Watch provider position | Realtime DB |

### Notification Service (`services/notification.service.ts`)

| Function | Description | API |
|----------|-------------|-----|
| `requestNotificationPermissions()` | Request push permission | Expo Notifications |
| `getExpoPushToken()` | Get device push token | Expo Notifications |
| `registerPushToken(userId, token)` | Save token to Firestore | Firestore |
| `setupNotificationChannel()` | Android channels setup | Expo Notifications |
| `scheduleLocalNotification(...)` | Show local notification | Expo Notifications |

## Zustand Store → Firebase Wiring

### authStore
```typescript
// Firebase auth state listener (call in app root)
const unsubscribe = useAuthStore.getState().initAuthListener();

// Firebase OTP flow
await useAuthStore.getState().sendFirebaseOTP('+254712345678');
await useAuthStore.getState().verifyFirebaseOTP('123456');
```

### requestStore
```typescript
// Submit request via Cloud Function
await useRequestStore.getState().submitRequest({
  serviceType: 'towing',
  location: { latitude: -1.2921, longitude: 36.8219, address: 'Nairobi CBD' },
  serviceDetails: { vehicleType: 'sedan' },
});

// Subscribe to real-time updates
const unsub = useRequestStore.getState().subscribeToUpdates(requestId);
```

### trackingStore
```typescript
// Subscribe to live tracking
const unsub = useTrackingStore.getState().subscribeToLiveTracking(requestId);

// Provider sends location updates
await useTrackingStore.getState().updateLocation(requestId, 'provider', location);
```

### providerStore
```typescript
// Go online and listen for jobs
await useProviderStore.getState().goOnline(providerId);
const unsub = useProviderStore.getState().listenForJobs(providerId);

// Accept and update job status
await useProviderStore.getState().acceptJob(requestId, providerId, 8);
await useProviderStore.getState().updateJobStatus(requestId, 'enroute');
```

## Cloud Functions (RESQ-KENYA)

The backend Cloud Functions are deployed from the [RESQ-KENYA](https://github.com/Suyanka21/RESQ-KENYA) repo:

| Function | Trigger | Description |
|----------|---------|-------------|
| `initiateStkPush` | HTTPS Callable | M-Pesa STK Push via Daraja API |
| `queryStkStatus` | HTTPS Callable | Query M-Pesa transaction status |
| `mpesaCallback` | HTTPS | M-Pesa payment callback webhook |
| `createServiceRequest` | HTTPS Callable | Create request + notify providers |
| `acceptServiceRequest` | HTTPS Callable | Provider accepts + update status |
| `updateRequestStatus` | HTTPS Callable | Status transitions |
| `updateProviderLocation` | HTTPS Callable | GPS update + geohash |
| `setProviderAvailability` | HTTPS Callable | Online/offline toggle |
| `autoOfflineCheck` | Scheduled | Auto-offline stale providers |
| `getPriceQuote` | HTTPS Callable | Dynamic pricing engine |
| `findOptimalProvider` | HTTPS Callable | AI-powered dispatch |

## Firestore Collections

| Collection | Document Fields | Used By |
|------------|----------------|---------|
| `users` | id, phoneNumber, displayName, membership, vehicles, fcmToken | Auth Service |
| `providers` | id, phoneNumber, serviceTypes, rating, availability, earnings | Provider Service |
| `requests` | userId, providerId, serviceType, status, pricing, timeline | Customer/Provider Service |
| `payment_requests` | requestId, amount, phone, status, mpesaReceiptNumber | Payment Service |

## Realtime Database Paths

| Path | Data | Used By |
|------|------|---------|
| `/tracking/{requestId}` | providerLocation, customerLocation, eta, status | Tracking Store |
| `/provider_locations/{providerId}` | latitude, longitude, heading, timestamp | Provider Service |

## Request Lifecycle

```
pending → accepted → enroute → arrived → inProgress → completed
   ↓                                                      ↓
cancelled                                              rated
```

## M-Pesa Payment Flow

```
1. Customer confirms payment
2. Client calls initiatePayment() → Cloud Function
3. Cloud Function → Safaricom Daraja STK Push API
4. User receives M-Pesa prompt on phone
5. User enters PIN
6. Safaricom → mpesaCallback Cloud Function
7. Cloud Function updates Firestore payment_requests
8. Client receives real-time update via subscribeToPaymentStatus()
```

## Error Handling

All services include:
- **Demo mode fallback** when Firebase is not configured
- **Typed error responses** with user-friendly messages
- **Error categorization** (network, auth, payment, location, firebase)
- **Retry with exponential backoff** for transient failures

See `services/error.service.ts` for the centralized error handling utilities.
