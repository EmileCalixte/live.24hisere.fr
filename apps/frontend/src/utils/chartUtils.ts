import { WINDOW_WIDTH_BREAKPOINTS } from "../constants/ui/sizing";

/**
 * @param raceDuration The race duration, in seconds
 */
function getBaseXAxisDateInterval(raceDuration: number): number {
  if (raceDuration <= 14400) {
    // up to 4h
    return Math.ceil(raceDuration / 60 / 24 / 10) * 10;
  }

  if (raceDuration <= 21600) {
    // up to 6h
    return Math.ceil(raceDuration / 60 / 24 / 15) * 15;
  }

  if (raceDuration <= 28800) {
    // up to 8h
    return Math.ceil(raceDuration / 60 / 24 / 20) * 20;
  }

  if (raceDuration <= 43200) {
    // up to 12h
    return Math.ceil(raceDuration / 60 / 24 / 30) * 30;
  }

  return Math.ceil(raceDuration / 60 / 24 / 60) * 60;
}

export function getXAxisDateInterval(raceDuration: number, width: number): number {
  const baseInterval = getBaseXAxisDateInterval(raceDuration);

  if (width < WINDOW_WIDTH_BREAKPOINTS.MD) {
    return baseInterval * 4;
  }

  if (width < WINDOW_WIDTH_BREAKPOINTS.LG) {
    return baseInterval * 2;
  }

  return baseInterval;
}
