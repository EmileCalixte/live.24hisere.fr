export type FixDrizzleDates<T extends object> = {
    [K in keyof T]: T[K] extends Date
        ? string
        : T[K] extends object
          ? FixDrizzleDates<T[K]>
          : T[K];
};

/**
 * A utility type function to fix the Drizzle types of entities containing dates
 *
 * Drizzle returns dates as string because the dates in the Drizzle schema have the 'string' mode,
 * but dates are wrongly typed as Date objects
 */
export function fixDrizzleDates<T extends object>(
    object: T,
): FixDrizzleDates<T> {
    return object as FixDrizzleDates<T>;
}
