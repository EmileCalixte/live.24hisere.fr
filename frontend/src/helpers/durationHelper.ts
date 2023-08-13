export function getDurationAsMs(hours: number, minutes: number, seconds: number): number {
    return (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
}
