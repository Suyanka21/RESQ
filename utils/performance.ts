/**
 * Performance utilities for ResQ Kenya app.
 * Provides helpers for measuring and optimizing app performance.
 */

/**
 * Debounce function to limit the rate at which a function fires.
 * Useful for map interactions, search inputs, and scroll handlers.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function to ensure a function fires at most once per interval.
 * Useful for scroll events and map marker updates.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn(...args);
    }
  };
}

/**
 * Simple marker clustering algorithm for map optimization.
 * Groups nearby markers within a given radius to reduce render count.
 */
export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  [key: string]: unknown;
}

export interface MarkerCluster {
  id: string;
  latitude: number;
  longitude: number;
  markers: MapMarker[];
  count: number;
}

export function clusterMarkers(
  markers: MapMarker[],
  clusterRadius: number = 0.01 // ~1km at equator
): MarkerCluster[] {
  const clusters: MarkerCluster[] = [];
  const visited = new Set<string>();

  for (const marker of markers) {
    if (visited.has(marker.id)) continue;
    visited.add(marker.id);

    const cluster: MarkerCluster = {
      id: `cluster-${marker.id}`,
      latitude: marker.latitude,
      longitude: marker.longitude,
      markers: [marker],
      count: 1,
    };

    // Find nearby markers
    for (const other of markers) {
      if (visited.has(other.id)) continue;
      const distance = Math.sqrt(
        Math.pow(marker.latitude - other.latitude, 2) +
        Math.pow(marker.longitude - other.longitude, 2)
      );
      if (distance <= clusterRadius) {
        visited.add(other.id);
        cluster.markers.push(other);
        cluster.count++;
        // Update cluster center to average
        cluster.latitude =
          cluster.markers.reduce((sum, m) => sum + m.latitude, 0) / cluster.count;
        cluster.longitude =
          cluster.markers.reduce((sum, m) => sum + m.longitude, 0) / cluster.count;
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

/**
 * Viewport-based filtering for markers.
 * Only returns markers visible in the current map viewport.
 */
export interface Viewport {
  latitudeMin: number;
  latitudeMax: number;
  longitudeMin: number;
  longitudeMax: number;
}

export function filterMarkersInViewport(
  markers: MapMarker[],
  viewport: Viewport
): MapMarker[] {
  return markers.filter(
    (marker) =>
      marker.latitude >= viewport.latitudeMin &&
      marker.latitude <= viewport.latitudeMax &&
      marker.longitude >= viewport.longitudeMin &&
      marker.longitude <= viewport.longitudeMax
  );
}
