/**
 * @param distance in meters
 * @param duration in ms
 * @return speed in km/h
 */
export function getSpeed(distance: number, duration: number): number {
  return (distance / (duration / 1000)) * 3.6;
}

/**
 * Calculates a pace from a speed
 * @param speed the speed in km/h
 * @return {number} the corresponding pace in ms/km
 */
export function getPaceFromSpeed(speed: number): number {
  return (1 / (speed / 60)) * 60 * 1000;
}

/**
 * Returns a duration in milliseconds from hours, minutes and seconds
 */
export function getDurationAsMs(hours: number, minutes: number, seconds: number): number {
  return seconds * 1000 + minutes * 60 * 1000 + hours * 60 * 60 * 1000;
}
