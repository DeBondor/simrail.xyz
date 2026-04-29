export interface LatLon {
  lat: number;
  lon: number;
}

const TO_RAD = Math.PI / 180;
const TO_DEG = 180 / Math.PI;
const EARTH_R_M = 6_371_008.8;

export function bearingDeg(prev: LatLon, curr: LatLon): number {
  const φ1 = prev.lat * TO_RAD;
  const φ2 = curr.lat * TO_RAD;
  const Δλ = (curr.lon - prev.lon) * TO_RAD;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x) * TO_DEG;
  return (θ + 360) % 360;
}

export function distanceMeters(a: LatLon, b: LatLon): number {
  const φ1 = a.lat * TO_RAD;
  const φ2 = b.lat * TO_RAD;
  const Δφ = (b.lat - a.lat) * TO_RAD;
  const Δλ = (b.lon - a.lon) * TO_RAD;
  const h =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * EARTH_R_M * Math.asin(Math.sqrt(h));
}
