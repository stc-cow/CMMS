/**
 * Warehouse Reference Data
 * Fixed reference coordinates for all ACES & STC warehouses in KSA
 */

export interface Warehouse {
  name: string;
  latitude: number;
  longitude: number;
}

// Warehouse Reference List (Hardcoded - no duplicates)
export const WAREHOUSES: Warehouse[] = [
  {
    name: "ACES WH Muzahmiya",
    latitude: 24.517206,
    longitude: 46.268152,
  },
  {
    name: "STC WH Jeddah",
    latitude: 21.458816,
    longitude: 39.211939,
  },
  {
    name: "STC Sharma WH",
    latitude: 28.0659,
    longitude: 35.1728,
  },
  {
    name: "ACES Dammam WH",
    latitude: 26.201199,
    longitude: 49.947945,
  },
  {
    name: "Madinah STC WH",
    latitude: 24.419135,
    longitude: 39.527377,
  },
  {
    name: "ACES Makkah WH",
    latitude: 21.31922,
    longitude: 39.9033,
  },
  {
    name: "STC WH Al Ula",
    latitude: 26.613083,
    longitude: 37.9245,
  },
];

// Maximum distance to assign to warehouse (km)
export const MAX_WAREHOUSE_DISTANCE_KM = 10;

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest warehouse for a COW location
 * Always returns the closest warehouse, regardless of distance
 */
export function findNearestWarehouse(
  latitude: number,
  longitude: number,
): { warehouse: string; distanceKm: number } {
  if (!latitude || !longitude) {
    // This should never be called without coordinates, but return a fallback
    return {
      warehouse: "OFF-AIR & Still on site",
      distanceKm: 0,
    };
  }

  let nearestWarehouse: Warehouse | null = null;
  let minDistance = Infinity;

  WAREHOUSES.forEach((warehouse) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      warehouse.latitude,
      warehouse.longitude,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestWarehouse = warehouse;
    }
  });

  if (nearestWarehouse) {
    return {
      warehouse: nearestWarehouse.name,
      distanceKm: minDistance,
    };
  }

  // Fallback (should never reach here)
  return {
    warehouse: "OFF-AIR & Still on site",
    distanceKm: 0,
  };
}
