import type { Entries } from "@live24hisere/core/types";

/**
 * Returns a copy of an object without the specified keys
 * @param object The object to copy
 * @param keys The keys to exclude
 */
export function excludeKeys<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
  const result = { ...object };

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key];
  }

  return result;
}

/**
 * Returns a copy of an object with only the specified keys
 * @param object The object to copy
 * @param keys The keys to include
 */
export function pickKeys<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};

  for (const key of keys) {
    result[key] = object[key];
  }

  return result as Pick<T, K>;
}

export function assignDefined<T extends object>(target: T, ...sources: Array<Partial<T>>): T {
  const newTarget = { ...target };

  for (const source of sources) {
    for (const key of Object.keys(source)) {
      const value = source[key as keyof typeof source];

      if (value !== undefined) {
        newTarget[key as keyof typeof source] = value;
      }
    }
  }

  return newTarget;
}

/**
 * Wrapper to Object.entries which infers entries type
 */
export function entries<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}

/**
 * Wrapper of Object.keys which infers keys type
 */
export function keys<T extends object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}

export function isEmptyObject(object: object): object is Record<string, never> {
  return Object.keys(object).length < 1;
}
